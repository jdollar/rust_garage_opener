#!/usr/bin/env sh

DOCKER_TAG=ionizedwarhead/garage_door_opener
WORKAPP_DIR=/root/app
current_dir=$(pwd)
server_dir=${current_dir}/server

cmd=$1

case $cmd in
  build_docker)
    docker build -t ${DOCKER_TAG} .
    ;;
  build_rust)
    docker run \
      --mount type=bind,source=${current_dir}/proto,target=${WORKAPP_DIR}/proto \
      --mount type=bind,source=${server_dir},target=${WORKAPP_DIR}/server \
      ${DOCKER_TAG} build 
    ;;
  clean_rust)
    docker run \
      --mount type=bind,source=${current_dir}/proto,target=${WORKAPP_DIR}/proto \
      --mount type=bind,source=${server_dir},target=${WORKAPP_DIR}/server \
      ${DOCKER_TAG} \
      clean
    ;;
  *)
    echo "Invalid command passed. Allowed commands: docker_build|compile_rust"
    ;;
esac
