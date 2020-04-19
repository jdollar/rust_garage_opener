# rust_garage_opener

Environment setup:

Setup Docker:
```
./local_run.sh build_docker
```

Setup Rpi:
Install raspian buster

Get access to gpio char devices
```
apt-get install libgpiod-devel gpiod
reboot
```


To build:

```
./local_run.sh build_rust
```

To clean:

```
./local_run.sh clean_rust
```

To Send compiled binaries to rpi server

Update local_run.sh with PI details (IP, User) then run
```
./local_run.sh ship_it
```
