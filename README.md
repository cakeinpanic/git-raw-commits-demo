# git log -- <path> inconsistency reproduction
`git-raw-commits` uses `git log -- <path>` under the hood.
When path is passed to `git log`, it uses `history simplification` feature which ends up into inconsistent behaviour of `git-raw-commits`.
Sometimes merge commits are included and sometimes they are not.
[This StackOverflow answer](https://stackoverflow.com/a/56556222/4166537) explains main idea of history simplification


In cases when another tool relies on getting all commits to process them(for example to calculate next verison bump), this behaviour can produce a bug.

This repo contains simple reproduction of this effect.

Run `npm i` first and then follow the instructions below

### Simple workflow

1. Log:
```git
* 4b1b570 (HEAD -> master) update readme
* 2392f65 add index.js
| * 117a489 (branch2) edit indexA
| * e496412 edit indexB
|/  
* 1fd4340 add folderB
* be71eea (tag: 1.0.0) add folderA
| * bad672e (branch1) add textB
|/  
* 6f71cae init
```
3. `node index.js`
4. Output:
```txt
add folderB
1fd4340077be17454969c1e3a98400412cb931d8
```
Contains only one commit changing files in `folderB`

### Merge branch1
1. `git checkout master-merge-branch1`
2. Log:
```git
*   25b4e0c (master-merge-branch1) Merge branch 'branch1' into master-merge-branch1
|\  
| * bad672e (origin/branch1, branch1) add textB
* | 9091f80 (HEAD -> master, origin/master) update readme
* | 2392f65 add index.js
* | 1fd4340 add folderB
* | be71eea (tag: 1.0.0) add folderA
|/  
* 6f71cae init

```
3. `node index.js`
4. Output
```git
Merge branch 'branch1'
6e31f434b2b283fc0f3ceeb4c664af3fa88d20f3

add textB
bad672eec790a782d6ea1d3c8136c22343e9c932

add folderB
1fd4340077be17454969c1e3a98400412cb931d8
```
Contains commits changing files in folderB _*with*_ merge commit

### Merge branch2
1. `git checkout master-merge-branch2`
2. Log
```git
*   bcd9a75 (master-merge-branch2) Merge branch 'branch2' into master-merge-branch-2
|\  
| * 117a489 (origin/branch2, branch2) edit indexA
| * e496412 edit indexB
* | 9091f80 (HEAD -> master, origin/master) update readme
* | 2392f65 add index.js
|/  
* 1fd4340 add folderB
* be71eea (tag: 1.0.0) add folderA
* 6f71cae init
```
4. `node index.js`
5. Result:
```diff
edit indexB
e49641253ff6ee7f656df94450ca6a72d5b5f741

add folderB
1fd4340077be17454969c1e3a98400412cb931d8
```
Contains commits changing files in folderB _*without*_ merge commit
