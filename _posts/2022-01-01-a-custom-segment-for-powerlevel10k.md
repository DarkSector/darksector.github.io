---
layout: post
title: A Custom segment for Powerlevel10K
categories: powerlevel10k
date: 2022-01-01 05:11 -0800
---


<img src="/assets/posts/2022-01-01-a-custom-segment-for-powerlevel10k/custom_segment.png" width="500" />

I really like a pretty terminal using ZSH with oh-my-zsh and Powerlevel10K. It gives you the exact information you need when you're working with multiple terminals. I recently started working with x86 and arm64 architectures. I prefer to know which architecture is currently being used. 


I used the `p10k help segment` command to understand how to write custom segment. All it needs to do is output the text x86 or arm64. In my previous post I detailed how to set particular variables when either of the architectures is enabled. Here's the relevant code snippet from `~/.zshrc`

```
# Multiple Homebrews on Apple Silicon
if [ "$(arch)" = "arm64" ]; then
    architecture="arm64"
else
    architecture="x86"
fi
```

I basically set the architecture variable to x86 or arm64 and I output that in the segment. You can do that in the segment directly as well but I chose to do it here since I need to reference other variables.

Here's the segment code that goes in `~/.p10k.zsh` after the example segment `prompt_example`

```
  function prompt_show_arch() {
    #if [ "$(arch)" = "arm64" ]; then
    #  p10k segment -b 2 -f 'black' -t 'arm64'
    #else
    #  p10k segment -b 2 -f 'black' -t 'x86'
    #fi
    p10k segment -b 2 -f 'black' -t $architecture
  }
```

Then, add the segment name `show_arch` to `POWERLEVEL9K_LEFT_PROMPT_ELEMENTS`


```
  # The list of segments shown on the left. Fill it with the most important segments.
  typeset -g POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(
    # =========================[ Line #1 ]=========================
    #os_icon                 # os identifier
    show_arch
    nvm
    pyenv
    dir                     # current directory
    vcs                     # git status
    # =========================[ Line #2 ]=========================
    newline                 # \n
    # prompt_char           # prompt symbol
  )
```