// Log into Reddit here, keep the session on Solari.
//
//   npm start
//
// Opens Chrome on this machine, waits for you to sign in by hand, then copies
// the cookies that login produced into a Solari profile. Agents point at the
// profile and browse as you, without a password going anywhere near them.
//
// Why the sign-in has to happen locally: Reddit rate-limits its login page when
// the request comes from datacenter or proxy addresses, which is every address
// a cloud browser has. Tested through Solari on both the rotating residential
// pool and static ISP egress in September 2026, and both got the "whoa there,
// pardner" page instead of a form. An existing session is fine by Reddit from
// those same addresses. It is only the sign-in that it refuses.

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { Solari } from "@solarisdk/browser";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ENV_FILE = path.join(DIR, ".env");
const WAIT_MINUTES = 10;
const POLL_MS = 5000;

async function whoAmI(page) {
  return await page.evaluate(async () => {
    try {
      const res = await fetch("/api/me.json", { headers: { accept: "application/json" } });
      return res.ok ? (await res.json())?.data?.name || null : null;
    } catch {
      return null;
    }
  });
}

async function saveProfile(client, name, storageState) {
  const existing = (await client.profiles.list()).find((p) => p.name === name);
  const profile = existing ?? (await client.profiles.create({ name }));
  const { version } = await client.profiles.save(profile.id, storageState);
  return { id: profile.id, version, reused: Boolean(existing) };
}

function storedKey() {
  if (process.env.SOLARI_API_KEY) return process.env.SOLARI_API_KEY;
  const file = fs.existsSync(ENV_FILE) ? fs.readFileSync(ENV_FILE, "utf8") : "";
  const found = file.match(/^\s*SOLARI_API_KEY\s*=\s*(.+)$/m)?.[1] ?? "";
  return found.trim().replace(/^["']|["']$/g, "");
}

async function askForKey() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const key = (await rl.question("Paste your Solari API key (dashboard, under API keys): ")).trim();
  rl.close();
  if (!key) throw new Error("No key given, so there is nowhere to save the session.");

  const prior = fs.existsSync(ENV_FILE) ? fs.readFileSync(ENV_FILE, "utf8") : "";
  fs.writeFileSync(ENV_FILE, `${prior ? prior.replace(/\n*$/, "\n") : ""}SOLARI_API_KEY=${key}\n`);
  console.log(`Written to ${ENV_FILE}, so you only do that once.\n`);
  return key;
}

async function waitForLogin(page) {
  const rounds = Math.ceil((WAIT_MINUTES * 60000) / POLL_MS);
  for (let i = 0; i < rounds; i++) {
    await new Promise((r) => setTimeout(r, POLL_MS));
    if (page.isClosed()) return null;
    const name = await whoAmI(page).catch(() => null);
    if (name) return name;
    if (i % 6 === 5) console.log("Still waiting. Finish the login in the Chrome window.");
  }
  return null;
}

async function main() {
  const key = storedKey() || (await askForKey());

  console.log("Opening Chrome. Sign into Reddit in the window that appears.\n");
  const browser = await chromium
    .launch({ headless: false, channel: "chrome" })
    .catch(() => chromium.launch({ headless: false }));

  let username = null;
  let state = null;
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://www.reddit.com/login/", { waitUntil: "domcontentloaded" });

    username = await waitForLogin(page);
    if (!username) {
      throw new Error(
        page.isClosed()
          ? "The window closed before the login finished. Run npm start again."
          : `No login after ${WAIT_MINUTES} minutes. Run npm start again when you have a moment.`
      );
    }
    state = await context.storageState();
  } finally {
    await browser.close().catch(() => {});
  }

  console.log(`\nSigned in as ${username}. Copying the session to Solari.`);
  const client = new Solari({ apiKey: key, baseUrl: "https://api.getsolari.com" });
  try {
    const name = `reddit-${username}`;
    const profile = await saveProfile(client, name, state);
    console.log(`${profile.reused ? "Refreshed" : "Created"} the profile "${name}", now at version ${profile.version}.`);
    console.log(`\nGive this line to whatever runs your agent:\n\n  SOLARI_PROFILE_ID=${profile.id}\n`);
  } finally {
    await client.close();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  main().catch((err) => {
    console.error(`\n${err.message}`);
    process.exit(1);
  });
}
