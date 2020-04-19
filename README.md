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
