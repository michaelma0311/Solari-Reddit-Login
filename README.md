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

## Setup

Node 20 or newer, then:

```bash
npm install
```

## npm start

1. First run only: paste your Solari API key (dashboard, under API keys). It is
   saved to `.env`.
2. Chrome opens on Reddit's login page. Clear the "prove your humanity" check if
   shown, then sign in normally.
3. When you are in, the window closes and it prints:

```
Created the profile "reddit-<username>", now at version 1.

  SOLARI_PROFILE_ID=cmt4y4qaa000jnu01lyyfycpd
```

That id is what an agent passes to Solari as `profileId` to browse as you.


## npm run list

```
Reddit profiles on this Solari account:

  some_user                    cmt4y4qaa000jnu01lyyfycpd
  other_user                   cmt4xzzo5000hnu011evya8db
```
**If you want to share your profile with somebody else, you would share this SOLARI_PROFILE_ID with them**

npm run list is just a convenient way to list out all your profiles