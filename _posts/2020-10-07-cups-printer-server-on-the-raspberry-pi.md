---
layout: post
title: CUPS Printer Server on the Raspberry Pi
categories: RaspberryPi CUPS Linux Printers
date: 2020-10-07 23:50 -0700
---
Recently acquired a $30 laser printer from a flash sale. The B/W Brother HL-L2320D. Decided to use CUPS on the RPi to share the printer on the local network. First things first, Brother doesn't provide drivers for the printer compiled for the ARM architecture. But the [brlaser](https://github.com/pdewacht/brlaser) project mercifully has support for many series. 

After setting up the Pi, the first thing to do was find if there was a debian package for this library

```bash
pi@raspberrypi:~ $ apt-cache search brlaser
printer-driver-brlaser - printer driver for (some) Brother laser printers
```

That's great! But hold on a second, what's this? 

```bash
pi@raspberrypi:~ $ apt-cache policy printer-driver-brlaser
printer-driver-brlaser:
  Installed: (none)
  Candidate: 4-1
  Version table:
     4-1 500
        500 http://raspbian.raspberrypi.org/raspbian buster/main armhf Packages
```

Oh great, it's V4. Now that's not necessarily bad, but it's better to get v6 from the repo directly.


## Setup the toolchain and dependencies

```bash
sudo apt install libcupsimage2-dev libcups2-dev cmake cups
```

## Clone the repo and install the lib

```bash
git clone https://github.com/pdewacht/brlaser.git
cd brlaser
cmake .
make
sudo make install
```

Great! now let's configure to access cups remotely. I don't like attaching my peripherals to the Pi and hauling my monitor to it.

## Allow access to CUPS admin


`sudo cupsctl --remote-admin --remote-any --share-printers`

This will modify `/etc/cups/cupsd.conf` to open up everything. Now the admin interface is available to be accessed remotely via the address `https://<pi-address>:631/admin`

## Add the printer

I added the printer by going to `/admin` and `Add printer`. It's pretty straightforward, just needed to make sure the printer is shared and HL-L2300 series is a viable driver. The default options are enough and make sure you select the printer as server default. 


## MacOS & Windows

Pretty straightforward access. Just go to printers and the printer shows up. If it doesn't show up for Mac OS, install and enable `avahi-daemon`

`sudo apt install avahi-daemon`

Start/Restart & Enable it

```bash
sudo systemctl restart avahi-daemon
sudo systemctl enable avahi-daemon
```

If Windows can't find it, maybe install the Samba package


```bash
sudo apt install samba
sudo systemctl restart smbd
```

Go to the printers section under `/etc/samba/smb.conf` and update it to reflect the following

```text
[printers]
   comment = All Printers
   browseable = no
   path = /var/spool/samba
   printable = yes
   guest ok = yes
   read only = yes
   create mask = 0700

# Windows clients look for this share name as a source of downloadable
# printer drivers
[print$]
   comment = Printer Drivers
   path = /var/lib/samba/printers
   browseable = yes
   read only = no
   guest ok = no
```


Now I just need to the figure out the bug up Linux's ass and get the trifecta working. But it works great on Mac OS and Windows 10