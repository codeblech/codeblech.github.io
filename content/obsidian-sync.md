---
title: Obsidian Sync using Git
draft: false
description: Syncing Obidian notes across Linux, Windows, MacOS, and Android. Fuck iPhone.
date: 2025-03-17
tags:
  - obsidian
---

## Introduction
I use Obsidian for most of my note taking needs. But, the free version lacks one essential feature:
**✨&nbsp;Sync&nbsp;across&nbsp;devices&nbsp;✨**

There are some plugins that provide this functionality:
1. [Remotely Save](https://github.com/remotely-save/remotely-save)
   - Has options for various cloud platforms.
   - Supports E2E.
   - You need to pay cloud providers for storage.
1. [Obsidian Git](https://github.com/Vinzent03/obsidian-git)
   - Has a lot of features and a good UI.
   - Has poor mobile performance due to the use of [isomorphic-git](https://isomorphic-git.org/).

Admittedly mostly as a fun exercise, I decided to roll my own sync layer.
After some tinkering, I've successfully setup sync for my Obsidian notes between my android phone and my Linux machine. The steps are exactly the same even if you use Windows, MacOS or any other OS. You just need **git** installed.

## Installation
1. Install **Termux** from [GitHub](https://github.com/termux/termux-app) or [F-Droid](https://f-droid.org/packages/com.termux). You can also download it from Play Store (yuck).
2. Install **Termux:Tasker** from [GitHub](https://github.com/termux/termux-tasker) or [F-Droid](https://f-droid.org/packages/com.termux.tasker). This is a Tasker plugin that allows using Termux from Tasker.
3. Install **Tasker**. It's [paid](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm). Please don't try looking for cracks. The dev is awesome. It's the only app ever I have paid for on android. Only other one is Goodnotes on iPad. If you decide to not pay, you can try setting up the automation using [Automate](https://llamalab.com/automate/).

>[!info]
>It usually takes a few days (or even a week or more) for updates to be available on F-Droid once an update has been released on GitHub.

## Setup on Android
### Set Up Git in Termux:
1. Open Termux and update packages:
```bash
apt update
```

3. Install Git:
```bash
apt install git
```

3. Configure Git with your user information:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```
4. Authenticate with a GitHub host:
```
apt install gh
gh auth login
```
5. Follow the steps on the terminal to authenticate.

### Grant Termux Storage Access:
Allow Termux to access your device storage:
```bash
termux-setup-storage
```

### Push notes to GitHub
1. Create a new repository on your GitHub.
2. On **Termux**, Navigate to the shared storage directory. This directory is what you see in your File Explorer (if you're not rooted):
```bash
cd ~/storage/shared
```
3. Now navigate to your Obsidian Vault.

>[!hint]
>Create a backup of all your files before you proceed. Although git will save you from fucking things up, it's still possible to fuck things up.

4. Initialize the repository inside the Obsidian Vault directory:
```bash
git init
```
5. If you see an error saying your repo is dubious, run:
```bash
git config --global --add safe.directory /path/to/repo
```
6. .
```bash
git branch -m main # rename branch if you want to
git remote add origin <GITHUB-REPO-URL>
git remote -v # verify that remote url is added successfully
```
7. Create a `.gitignore` file:
```gitignore
.trash/
.obsidian/
_.obsidian/
```
8. Commit and push all files:
```bash
git status # verify that the ignored files are not tracked
git add .
git commit -m "init android"
git push origin main
git branch --set-upstream-to=origin/main main # optional
```

## Setup on PC
>[!hint]
>Create a backup of all your files before you proceed. Although git will save you from fucking things up, it's still possible to fuck things up.

### Setup git repository
1. Navigate to the Obsidian Vault:
```bash
cd path/to/vault
```
2. Initialize git repository 
```bash
git init
git remote add origin <GITHUB-REPO-URL>
git remote -v # verify that remote url is added successfully
```
3. Pull changes from remote
```bash
git pull
```
4. If any file in the remote repo has the same name as a file in this Obsidian Vault on the PC, the merge will fail. To solve this, rename the conflicting files, and run `git pull` again.
5. Now, the local repository would have all the Obsidian notes from the phone.

### Push notes to GitHub
```bash
git status # verify that the ignored files are not tracked
git add .
git commit -m "init desktop"
git push origin main
git branch --set-upstream-to=origin/main main # optional
```

## Is that it?
Yeah. If you are fine with manually pushing changes through **git** every time you modify your notes. Now you can easily sync your notes between devices.
If you modify notes on your PC:
```bash
cd path/to/repo

git add -A
git commit -m "Desktop: $(date '+%Y-%m-%d %H:%M:%S')"

# Pull remote changes using rebase to integrate remote changes cleanly
git pull --rebase

# Push local commits to the remote repository
git push
```

If you modify notes on your android, run this from **Termux**:
```bash
cd path/to/repo

git add -A
git commit -m "Desktop: $(date '+%Y-%m-%d %H:%M:%S')"

# Pull remote changes using rebase to integrate remote changes cleanly
git pull --rebase

# Push local commits to the remote repository
git push
```
You can stop here if you want, but the automation part is much more fun.

## Automation 
### Cron Job on PC
A cron job is the simplest way to keep the notes synced on the PC. The script is lightweight so running it again and again won't cause any performance degradation. In future, I'd like to setup automatic sync on opening and closing Obsidian. Spoiler Alert...This is exactly what we'll setup on Android.
1. Save this script somewhere in your filesystem:
```bash
#!/usr/bin/env bash

cd /home/malik/Documents/obsidian-backup

# Stage all changes
git add -A

# If there are any changes, commit them with a timestamp
if ! git diff-index --quiet HEAD --; then
  echo "--------------------------"
  echo "|Uncommited changes exist.|"
  echo "--------------------------"

  git commit -m "Desktop: $(date '+%Y-%m-%d %H:%M:%S')"
else
  echo "-----------------------"
  echo "|No uncommited changes.|"
  echo "-----------------------"
fi

# Pull remote changes using rebase to integrate remote changes cleanly
git pull --rebase

# Push local commits to the remote repository
git push
```

2. Make this script executable:
```bash
chmod +x /path/to/script.sh
```

>[!note]
>If you're on Fedora, follow these steps. If you're on another distro or operating system, the steps must be similar. Search online for specific steps for your operating system

3. Ensure `cronie` is Installed and Running:
```bash
sudo dnf install cronie -y
sudo systemctl enable --now crond
```
3. Open the `crontab` editor:
```bash
crontab -e
```
4. Add the following line at the bottom:
```bash
*/10 * * * * /path/to/script.sh
```

>[!info]
>The above cron job is setup to run every 10 minutes. You can choose any interval you want. Checkout https://crontab.guru/ to learn more about cron expressions.

>[!tip]
>You can create an alias for the script in your shell profile, so that you can run it easily from anywhere on the terminal. This way you won't have to wait for the cron job to run, and do a sync on demand. Here's how to setup aliases in [bash](https://linuxize.com/post/how-to-create-bash-aliases/), [zsh](https://github.com/rothgar/mastering-zsh/blob/master/docs/helpers/aliases.md), and [fish](https://fishshell.com/docs/current/cmds/alias.html)

### Tasker on Android
Here's the plan: We'll save a script in the filesystem that **Tasker** can access. Then, we'll setup **Tasker** to run that script through **Termux**. The plugin **Termux:Tasker** will allow the communication between Tasker and Termux.
#### Setup Termux:Tasker
Follow the setup instructions [here](https://github.com/termux/termux-tasker) to setup the plugin.
#### Save the shell script
1. In the directory `~/.termux/tasker`:
```bash
nano obsidian.sh
```
2. Save the following contents in this script:
```bash

#!/data/data/com.termux/files/usr/bin/bash

cd /data/data/com.termux/files/home/storage/shared/<PATH> # update this path

# Stage all changes
git add -A

# If there are any changes, commit them with a timestamp
if ! git diff-index --quiet HEAD --; then
  echo "--------------------------"
  echo "|Uncommited changes exist.|"
  echo "--------------------------"

  git commit -m "Android: $(date '+%Y-%m-%d %H:%M:%S')"
else
  echo "-----------------------"
  echo "|No uncommited changes.|"
  echo "-----------------------"
fi

# Pull remote changes using rebase to integrate remote >
git pull --rebase

# Push local commits to the remote repository
git push
```
3. Although the **Termux:Tasker** [guide](https://github.com/termux/termux-tasker) says it automatically updates the permissions of all the files in this direction, we'll do it manually just to be sure:
```bash
chmod +x obsidian.sh
```

#### Setup Tasker 
Now we will setup Tasker to run the sync script every time Obsidian is opened or closed.
##### Create Task
1. Open **Tasker** and create a new **Action** in a **Task**.
2. In the resulting Select Action Category dialog, select **Plugin**.
3. In the resulting Action Plugin dialog, select **Termux:Tasker**.
4. Click the edit button to edit the configuration.
5. In the Executable section, write `obsidian.sh`
6. Leave the rest as default.
7. Save the Action.
8. Go back and save the Task by clicking the check mark (✓) at the top.
##### Create Profile
Now we'll create a Tasker profile that triggers the created task when you open and close the Obsidian app:
1. Detecting When Obsidian Opens:
	- Open **Tasker** and tap the **Profiles** tab.
	- Tap the **+** button to add a new profile.
	- Select **Application** as the context.
	- Choose **Obsidian** from the list of installed applications and tap **Back**.
	- Tasker will prompt you to add a new task. Select the task that we created earlier and tap the check mark (✓).

2. Detecting When Obsidian Closes:
	- In the same profile you created above, tap and hold the task name until a menu appears.
	- Select **Add Exit Task**.
	- Add the same task (e.g., "Obsidian Sync") and tap the check mark(✓) at the top.


## Is this finally it?
Yes. This is finally it...for now. What have we achieved? Well, now our Obsidian notes on our android device and our PC are synced...kind of. There's a caveat. You can't work on the same note on both PC and the phone at the same time. This will create merge conflicts. Our scripts doesn't handle any merge conflicts, yet. I will keep the *last part of this blog* updated with all the syncing issues that I face and how to solve them. But other than that, the sync works really well. If you don't work on the same notes on different devices at the same time, you won't face any issues (hopefully)

## Last part of this blog
### Git Object Corruption
I ran into an issue on Termux where Git threw errors like:
```bash
error: object file .git/objects/1c/e2b73db9f9e6cb99df516618a29836c642fa5a is empty
error: 1ce2b73db9f9e6cb99df516618a29836c642fa5a: object corrupt or missing...
```

This meant a Git object was corrupt and my index had an invalid pointer.

### Quick Fix
1. Remove the Bad Object:
```bash
rm .git/objects/1c/e2b73db9f9e6cb99df516618a29836c642fa5a
```

2. If above step didn't work, rebuild the Git Index:
```bash
rm -f .git/index
git reset
```

3. Verify Everything’s Back in Shape:
```bash
git fsck --full
```

### Dirty Fix
After the quick fix, the commits and pushes were working again. If this doesn't fix your issue, the easiest way to solve that would be:
1. Delete the `.git` directory.
2. Run the following commands:
```bash
git init
git add .
git commit -m "fuckup"
git remote add origin <GITHUB-REPO-URL>
git pull --rebase
# Solve any merge conflicts if they arise
git push
```

