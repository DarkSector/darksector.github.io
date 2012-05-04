---
layout: post
title: "Single Trigger Terminal Hack Mac OS X Lion"
date: 2012-05-04 16:36
comments: true
categories: ['Mac OS X Lion', 'Terminal', 'AppleScript', 'Finder']
---

My Macbook Air has all its function keys multiplexed with other special functions like Sound up, Sound down, Mute, etc. Now, I really need to pop up the terminal again and again when I am working and even third party applications like [TotalTerminal](http://totalterminal.binaryage.com/) still use a combo. Default being <span class="label label-info">ctrl+~</span>. This is frustrating for someone who's used Guake on Linux. <span class="badge badge-info">F12</span>, I miss you so much.

So what do we do. We hack _zey keyboard_. Well not really hack it, just have two modes to work. Because I love the sound up and sound down keys along with iTunes trigger. Makes life easier. I am not going to explain the whole code because it's pretty self explanatory, comments should help. Should take just one day of your weekend if you're new.

So let's AppleScript it.
```lua Terminal.script
tell application "System Events" to set TerminalisRunning to (name of processes) contains "Terminal"
-- check whether the terminal is running
-- TerminalisRunning is true or false if the process Terminal is running
if TerminalisRunning then
	-- Check, is the terminal visible?
	tell application "System Events" to set TerminalisVisible to visible of process "Terminal"
	-- TerminalisVisible will now contain true or false if the Terminal is visible or not respectively
	set AppInFront to name of (info for (path to frontmost application))
	-- set the variable AppInFront to the name of which application is in the front
	
	if TerminalisVisible and AppInFront is "Terminal.app" then
		
		tell application "System Events" to set visible of process "Terminal" to false
		-- hides the terminal if its process is visible and is on the top
		
	else if TerminalisVisible and AppInFront is not "Terminal.app" then
		-- if terminal's process is visible but it's behind some application
		-- then bring to front
		activate application "Terminal"
		
	else if not TerminalisVisible then
		-- if it's process isn't visible then it activates it
		activate application "Terminal"
	end if
else
	-- start the application
	activate application "Terminal"
end if
```

The syntax is very easy. So whenever the script is run, if the terminal is running it'll bring to the front and when it is ran again, it'll hide it. If it's not running, it'll start it.

But the question is how to start it in the first place? Answer is pretty simple [FastScripts](http://www.red-sweater.com/fastscripts/). You can run 10 scripts with the free version. I simply put the script in a new folder name it foo or whatever and in the preferences assign the key <span class="badge badge-info">__F12__</span> to it.

There's another problem, <span class="badge badge-info">__F12__</span> also gets you to Dashboard. So go to System Preferences and remove that feature.
 
{% img center http://cl.ly/1s0I310w381E0r3Y3m1d/Screen%20Shot%202012-05-04%20at%205.25.09%20PM.png %}

Also, switch the keys permanently here.
{% img center http://cl.ly/1E0e2j3Z1X2g2b2D2C3a/Screen%20Shot%202012-05-04%20at%205.31.58%20PM.png %}

So now we're down to one problem, I'd like to use the special keys too. So let's make another mode for that.

```lua DeveloperMode.script
-- check if GROWL is running
tell application "System Events"
	set isRunning to (count of (every process whose bundle identifier is "com.Growl.GrowlHelperApp")) > 0
end tell

-- check if UI scripting is ON
tell application "System Events"
	if not UI elements enabled then
		set UI elements enabled to true
	end if
end tell


tell application "System Events"
	tell application "System Preferences"
		reveal anchor "keyboardTab" of pane "com.apple.preference.keyboard"
	end tell
	click checkbox 1 of tab group 1 of window 1 of application process "System Preferences"
	if value of checkbox 1 of tab group 1 of window 1 of application process "System Preferences" is 1 then
		
		if isRunning then
			tell application id "com.Growl.GrowlHelperApp"
				-- Make a list of all the notification types 
				-- that this script will ever send:
				set the allNotificationsList to ¬
					{"Developer Mode ON", "Developer Mode OFF"}
				
				-- Make a list of the notifications 
				-- that will be enabled by default.      
				-- Those not enabled by default can be enabled later 
				-- in the 'Applications' tab of the growl prefpane.
				set the enabledNotificationsList to ¬
					{"Developer Mode ON", "Developer Mode OFF"}
				
				-- Register our script with growl.
				-- You can optionally (as here) set a default icon 
				-- for this script's notifications.
				register as application ¬
					"Seed Notifier" all notifications allNotificationsList ¬
					default notifications enabledNotificationsList ¬
					icon of application "Terminal"
				
				
				notify with name ¬
					"Developer Mode ON" title ¬
					"Developer Mode ON" description ¬
					"You can now use Developer keys" application name "Seed Notifier"
				
			end tell
		end if
		
	else
		if isRunning then
			tell application id "com.Growl.GrowlHelperApp"
				-- Make a list of all the notification types 
				-- that this script will ever send:
				set the allNotificationsList to ¬
					{"Developer Mode ON", "Developer Mode OFF"}
				
				-- Make a list of the notifications 
				-- that will be enabled by default.      
				-- Those not enabled by default can be enabled later 
				-- in the 'Applications' tab of the growl prefpane.
				set the enabledNotificationsList to ¬
					{"Developer Mode ON", "Developer Mode OFF"}
				
				-- Register our script with growl.
				-- You can optionally (as here) set a default icon 
				-- for this script's notifications.
				register as application ¬
					"Seed Notifier" all notifications allNotificationsList ¬
					default notifications enabledNotificationsList ¬
					icon of application "Terminal"
				
				
				notify with name ¬
					"Developer Mode OFF" title ¬
					"Developer Mode OFF" description ¬
					"Back to the original layout" application name "Seed Notifier"
				
				
			end tell
		end if		
		
	end if
end tell
-- QUIT SYSTEM PREFERENCCES APPLICATION
if application "System Preferences" is running then
	tell application "System Preferences" to quit
end if
```

I made this script trigger with the combination <span class="label label-info">ctrl+ ⌘+]</span> so that it may switch between developer mode and normal mode. I also updated the script with Growl Notification which I find is pretty cool &lt;/proud&gt;

One successful weekend I'd say. I also might develop further on this application and hence the name Seed. Don't ask me what it stands for, it's just a name.

You can find the code [here](https://github.com/DarkSector/AppleScripts) on Github.