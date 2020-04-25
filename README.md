# rust_garage_opener

Environment setup:

Setup Docker:
```
./local_run.sh build_docker
```

Setup Rpi:
Install raspian buster
Install docker: https://docs.docker.com/engine/install/ubuntu/

Get access to gpio char devices
```
apt-get install libgpiod-devel gpiod
reboot
```

Proxy Server

```
# Get relevant release of proxy server
https://github.com/improbable-eng/grpc-web/releases

# Pull placeholder TLS Keys
mkdir proxy_keys
wget https://raw.githubusercontent.com/improbable-eng/grpc-web/master/misc/localhost.key
wget https://raw.githubusercontent.com/improbable-eng/grpc-web/master/misc/localhost.crt

# unzip and start server
./grpcwebproxy-v0.12.0-arm7 --backend_addr=localhost:10000 --backend_tls_noverify --allow_all_origins --server_tls_cert_file=./proxy_keys/localhost.crt --server_tls_key_file=./proxy_keys/localhost.key

./grpcwebproxy-v0.12.0-arm7 --backend_addr=localhost:10000 --run_tls_server=false --allow_all_origins --server_http_max_write_timeout 900s --server_http_max_read_timeout 900
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

FRONTEND

protoc binary: https://github.com/protocolbuffers/protobuf/releases
protoc web plugin: https://github.com/grpc/grpc-web/releases

Making changes to proto files need to have eslint disabled for the new pb files. See this issue: https://github.com/grpc/grpc-web/issues/447
Accomplishing this by extending eslint and ignoring *_pb.js files as per issue recommendation




Call outs

Door Status Call stream timeout + no reset + deadline

Roadmap:

More user friendly setup


BOM:
Raspberry Pi Zero W
* Pishop Link: https://www.pishop.us/product/raspberry-pi-zero-w/
* Adafruit Link: https://www.adafruit.com/product/3400

Magnetic Reed Switches
* Digi-Key Link: https://www.digikey.com/short/zzjjz4

Magnets
* Digi-Key Link: https://www.digikey.com/short/zzjjz9

Relay Breakout Board (Used two channel for my application, but you just need one if you only have one door)
* Pi-Shop Link (2-Channel): https://www.pishop.us/product/2-channel-relay-module-for-arduino-raspberry-pi-5v/
* Jameco Link (1-Channel): https://www.jameco.com/z/KS0011-Keyestudio-Keyestudio-Single-5V-Relay-Module-Compatible-with-Arduino-UNO-R3-MEGA_2278799.html

Perfboard (Used for sticking the magnetic switches on. Any will do)
* Adafruit Link: https://www.adafruit.com/product/2670
* Digi-Key Link: https://www.digikey.com/products/en?mpart=2670&v=1528

Speaker Wire (Used for the runs between the raspberry pi and the swtiches)
* Amazon Link: https://www.amazon.com/InstallGear-Gauge-100ft-Speaker-Touch/dp/B01CSZAYF0/ref=sr_1_4?dchild=1&keywords=speaker+wire&qid=1587788838&sr=8-4
