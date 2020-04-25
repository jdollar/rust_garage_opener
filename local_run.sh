#!/usr/bin/env sh

DOCKER_TAG=ionizedwarhead/garage_door_opener
WORKAPP_DIR=/root/app
current_dir=$(pwd)
server_dir=${current_dir}/server

RPI_IP=192.168.1.22
RPI_USER=pi

cmd=$1

case $cmd in
  build_docker)
    docker build -t ${DOCKER_TAG} .
    ;;
  build_rust)
    docker run \
      --mount type=bind,source=${current_dir}/proto,target=${WORKAPP_DIR}/proto \
      --mount type=bind,source=${server_dir},target=${WORKAPP_DIR}/server \
      ${DOCKER_TAG} \
      build 
    ;;
  build_rust_release)
    docker run \
      --mount type=bind,source=${current_dir}/proto,target=${WORKAPP_DIR}/proto \
      --mount type=bind,source=${server_dir},target=${WORKAPP_DIR}/server \
      ${DOCKER_TAG} \
      build --release
    ;;
  clean_rust)
    docker run \
      --mount type=bind,source=${current_dir}/proto,target=${WORKAPP_DIR}/proto \
      --mount type=bind,source=${server_dir},target=${WORKAPP_DIR}/server \
      ${DOCKER_TAG} \
      clean
    ;;
  ship_it)
    rsync -avzhe ssh --progress ${server_dir}/target/armv7-unknown-linux-gnueabihf/debug/garageopener-{server,client} ${RPI_USER}@${RPI_IP}:/home/${RPI_USER}
    ;;
  ship_it_deb)
    rsync -avzhe ssh --progress ${current_dir}/dist/deb/*.deb ${RPI_USER}@${RPI_IP}:/home/${RPI_USER}
    ;;
  *)
    echo "Invalid command passed. Allowed commands: docker_build|build_rust|clean_rust|ship_it"
    ;;
esac
