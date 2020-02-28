---
layout: post
title:  "Some GIT stuff I keep forgetting"
date:   2020-02-27 15:36:00 -0800
categories: Git
---

Some git stuff I use often but for some reason I keep forgetting

## Setting per repo config

 ```
 [core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
	ignorecase = true
	precomposeunicode = true
[remote "origin"]
	url = repo_url.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[user]
	name = Pronoy Chopra
	email = pronoyc@gmail.com
[credential]
	helper =
[branch "master"]
	remote = origin
	merge = refs/heads/master
 ```

## Undo git add 

  `git reset <filename>`

## Amend a commit
 
 `git commit --amend`

## Undo the last commit and keep changes

  `git reset --soft HEAD~1`


 I'll obviously keep updating it as I find myself forgetting more things