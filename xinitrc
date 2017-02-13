#xrandr --dpi 160
#xrandr --scale 1.2x1.2
#xrandr --output Virtual1 --mode 2560x1600
xrandr --output Virtual1 --mode 1920x1440 
xrdb -merge ~/.Xresources
/usr/bin/vmware-user-suid-wrapper
exec i3 --shmlog-size=26214400
