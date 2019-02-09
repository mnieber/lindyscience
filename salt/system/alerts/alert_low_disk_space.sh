#!/bin/bash
CURRENT=$(df / | grep / | awk '{ print $5}' | sed 's/%//g')
THRESHOLD=90

if [ "$CURRENT" -gt "$THRESHOLD" ] ; then
    python /root/sendmail.py 'Disk Space Alert' 'mnieber@gmail.com' "Your {{ pillar['org_name'] }} root partition remaining free space is critically low. Used: $CURRENT"
fi
