# NTP, RTC and computer clocks

- NTP: network-time-protocol
- RTC: real-time-clock

**TLDR**: to sync RTC to system clock, use `sudo hwclock --systohc`

## generalities

NTP is a protocol that syncs a computer's clock to a remote server. it does so
by running [UDP](https://fr.wikipedia.org/wiki/User_Datagram_Protocol)
requests to the remote server. NTP requests are made using the port `123`.

## `hwclock`

`hwclock` is used to read and set the RTC.


- read the RTC

```bash
sudo hwclock
```

- set the RTC to system clock

```bash
sudo hwclock --systohc
```

## `timedatectl` and `systemd-timesyncd`

- `timedatectl` is the used to read/change time settings on a machine.
- `systemd-timesyncd` is the default daemon to sync clocks using NTP. 

### status

basic status reads:

```bash
$ timedatectl
               Local time: jeu. 2026-09-10 16:47:45 CEST
           Universal time: jeu. 2026-09-10 14:47:45 UTC
                 RTC time: jeu. 2026-09-10 14:47:45
                Time zone: Europe/Paris (CEST, +0200)
System clock synchronized: no
              NTP service: active
          RTC in local TZ: no
```

worth noting:
- `Local time` is the system clock (OS-level)
- `RTC time` is the hardware clock. it lives in the BIOS, powered by the CMOS
    battery.
- `System clock synchronized`: shows if the system clock is synced to a remote
    server using the NTP protocol.

### other commands

- manage `timesyncd` using basic `systemctl` commands:
```bash
sudo systemctl enable|start|stop|restart|status systemd-timesyncd
```

- see the sources (servers currently available)
```bash
timedatectl show-timesync --all
```

- see the current source selected by `timesyncd`:
```bash
timedatectl timesync-status
```

- read `timesyncd` journals:
```bash
journalctl -u systemd-timesyncd --no-pager
```

## alternatives to `timesyncd`

other linux packages can be used for clock management and syncing:
- `ntp`: outdated linux package
- `chrony`: modern equivalent
