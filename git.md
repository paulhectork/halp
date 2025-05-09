# GIT

---

## Submodules

consider the structure below, with a repo named `root` containing a submodule named `sub`.

```
root/             # the root git repository
  |_kewlcode.py   # a file in the git repo
  |_sub/          # a submodule
```

### Add a new submodule to a repo 

this will create a `.gitmodules` file in `root/` containing info on the submodule 

```bash
# in root/
git init                                            # create the repo
git add -A && git commit -m "first commit"          # a commit for good measure
git submodule add git@github.com:youUserId/sub.git  # add the submodule
```

### Clone a repo with a sumodule

```bash
# clone the repo
git clone git@github.com:yourUserId/root.git
cd root

# init the submodules
git submodule init && git submodule update
# or:
git submodule update --init --recursive
```

explanation of the `git submodule init && git submodule update`: 
- `init` reads the .gitmodules file in the repository to configure the submodules and prepares to fetch the submodule contents
- `update` fetches submodule contents from remote repo

### Change the submodule branch or checkout to a submodule commit

the module `root` is in the branch `main`. you want to checkout the submodule to the branch `dev` without changing `root`'s branch.

```bash
# checkout to the desired branch
cd sub/
git checkout dev  # to checkout to a specific commit, do `git checkout <commit hash>`

# move back into `root/` and commit your submodule change
cd .. 
git add sub/ && git commit "change sub branch"
git push origin main
```

---

## Gitignore

### Keep a folder in the git repo but not its contents

you have the following repo structure and want to keep `data` in the folder, but not its contents.

```
root/
  |_data/
```

you need to create in `data/` a `.gitignore` file with the contents below. `*` tells Git to ignore all files, but `!.gitignore` tells Git to keep the `.gitignore` file.

```
*
!.gitignore
```

as a one liner:

```bash
# in root/
echo -e "*\n!.gitignore" > data/.gitignore  # as always, `>` deletes pre-existing contents from file.
```


