# reddit-login

```bash
npm start       # sign into Reddit, save the session to Solari, get a profile id
npm run list    # print every Reddit profile on the Solari account with its id
```

`npm start` exists because Reddit refuses sign-ins from cloud browsers but
accepts an existing session from them. So you sign in here, on your own
machine, and only the cookies go to Solari as a profile. Your password never
leaves Reddit's login form.

`npm run list` exists so anyone with the API key can see all the profiles and
their ids without signing in again.

## Setup (first time, from nothing)

1. Install Node from https://nodejs.org. Pick the LTS download and run the
   installer with the defaults. This also installs `npm`.
2. Get this folder onto your computer: Git Clone. (If you don't know git, on the GitHub page click the green
   "Code" button, then "Download ZIP", and unzip it.)
3. Open a terminal in the folder.
   - Windows: open the folder in File Explorer, click the address bar, type
     `cmd`, press Enter.
   - Mac: right-click the folder in Finder, choose "New Terminal at Folder".
4. In that terminal, run:

```bash
npm install
```

That downloads everything the script needs. It takes a minute or two.

You do not need to create any files. The Solari API key is asked for the
first time you run `npm start` and saved to `.env` for you.

## npm start

1. First run only: paste your Solari API key into the terminal. Get it from the Solari
   dashboard under API keys, paste it in the terminal, press Enter. It is saved
   to `.env` in this folder, and you are not asked again.
2. Chrome opens on Reddit's login page. Clear the "prove your humanity" check if
   shown, then sign in normally.
3. When you are in, the window closes and it prints:

```
Created the profile "reddit-<username>", now at version 1.

  SOLARI_PROFILE_ID=cmt4y4qaa000hnu01lyyfycpd
```

That id is what an agent passes to Solari as `profileId` to browse as you.

**If you want to share your profile with somebody else, share this
SOLARI_PROFILE_ID with them.**

Run `npm start` again when the session expires. The same profile is refreshed
and the id stays the same. One run per Reddit account.

## npm run list

A convenient way to list all the profiles on the Solari account:

```
Reddit profiles on this Solari account:

  some_user                    cmt4y4qaa000jnu01lyyfycpd
  other_user                   cmt4xzzo5000hnu011evya8db
```
