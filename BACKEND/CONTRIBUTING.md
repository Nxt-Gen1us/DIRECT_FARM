# Contributing to DIRECT FARM

Thank you for contributing to DIRECT FARM! This document explains how to create a pull request on GitHub.

## 1. Create a feature branch

Use a descriptive branch name for your work:

```bash
git checkout -b feature/your-change
```

## 2. Make your changes

Edit the code, documentation, or tests.

## 3. Stage and commit your changes

```bash
git add .
git commit -m "Describe your change clearly"
```

## 4. Push your branch to GitHub

```bash
git push -u origin feature/your-change
```

## 5. Open a pull request

1. Go to `https://github.com/Nxt-Gen1us/DIRECT_FARM`
2. Click `Pull requests`
3. Click `New pull request`
4. Select your branch as the compare branch
5. Select `master` as the base branch
6. Add a clear title and description
7. Submit the pull request

## 6. What to include in the PR description

- What was changed
- Why the change was made
- Any tests that were run
- Any notes for reviewers

## 7. After creating the PR

- Monitor comments from reviewers
- Make new commits to the same branch if changes are requested
- Push updates to GitHub and the PR will update automatically

## 8. Helpful commands

```bash
# show current branch
git branch --show-current

# show remote configuration
git remote -v

# fetch latest changes from origin
git fetch origin

# rebase your branch onto updated master
git rebase origin/master
```
