#!/usr/bin/env sh

DOCKER_TAG=ionizedwarhead/garage_door_opener
WORKAPP_DIR=/root/app
current_dir=$(pwd)

cmd=$1

case $cmd in
  build_docker)
    docker build -t ${DOCKER_TAG} .
    ;;
  compile_rust)
    ./local_run.sh build_docker

    docker run \
      --mount type=bind,source=${current_dir}/target,target=${WORKAPP_DIR}/target \
      --mount type=bind,source=${current_dir}/Cargo.lock,target=${WORKAPP_DIR}/Cargo.lock \
      ${DOCKER_TAG}
    ;;
  *)
    echo "Invalid command passed. Allowed commands: docker_build|compile_rust"
    ;;
esac
