---
layout: post
title:  "Raspberry Pi - Chromium on boot in kiosk mode"
date:   2020-02-02 00:47:00 -0800
categories: Raspberry-pi chromium linux
---

Recently, I built [this](https://leaderboard.thestrength.co/leaderboard/2) using Django. It's my Gym's leaderboard running on a [Digital Ocean droplet](https://m.do.co/c/bfdb1a8e009b). I decided to use a Raspberry Pi running perpetually displaying the leaderboard in the gym. Apparently it has become a huge motivator (even for me).

However, getting chromium to launch isn't all that straightforward so I am jotting down what I know 

```
sudo vim /etc/xdg/lxsession/LXDE-pi/autostart
```

```bash
#@xscreensaver -no-splash  # comment this line out to disable screensaver
@xset s off
@xset -dpms
@xset s noblank
@chromium-browser --noerrdialogs --force-device-scale-factor=1.25 --kiosk https://leaderboard.thestrength.co/leaderboard/2  
```

One thing that really bothers me is that the file system crashes if the Pi isn't shut down properly (multiple times). I found a post talking about making the root file system read-only which led me to the [documentation](https://wiki.debian.org/ReadonlyRoot#Enable_readonly_root). However, if you do mark the partition read-only the Desktop won't boot. 

So to undo that, you gotta re-mount `/etc/fstab` as non-read-only. 

So the only viable option is to create a new writable filesystem and keep it in the RAM and mark the root as read-only. [This post talks about it in detail](https://www.raspberrypi.org/forums/viewtopic.php?t=161416). I'll tinker with that later so that I can mount a writeable file system in an external drive or create a new partition during install. 