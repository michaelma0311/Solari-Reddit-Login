# reddit-login

Sign into Reddit in a browser on your own machine, then save that session to a
Solari profile so an agent can browse as you. Your password never leaves
Reddit's own login form.

Reddit refuses sign-ins from datacenter addresses, which is every cloud browser.
It accepts an existing session from those same addresses, so the login happens
here and only the cookies go to Solari.

## Setup

Node 20 or newer. Everything else (two packages plus Chromium) installs with:

```bash
npm install
```

## Use

```bash
npm start
```

1. First run only: paste your Solari API key (dashboard, under API keys). It is
   saved to `.env` next to the script.
2. A Chrome window opens on Reddit's login page. Clear the "prove your humanity"
   check if shown, then sign in normally. 2FA and email checks work as usual.
3. The script polls for up to 10 minutes. When you are in, the window closes and
   it prints:

```
Created the profile "reddit-<username>", now at version 1.

  SOLARI_PROFILE_ID=prof_01J8XQ4T7N
```

Put that line in your agent's configuration.

## Renewing

When the agent starts seeing logged-out pages, run `npm start` again. The same
profile is refreshed in place, so the configured id keeps working.

## Multiple accounts

Run it once per account. Each username gets its own profile and id.

## Notes

- `.env` holds the API key and is git-ignored.
- Cookies live on Solari. Delete the profile from the dashboard to revoke access.
