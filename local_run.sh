#!/usr/bin/env sh

DOCKER_TAG=ionizedwarhead/garage_door_opener

cmd=$1

case $cmd in
  build_docker)
    docker build -t ${DOCKER_TAG} .
    ;;
  compile_rust)
    docker run --mount type=bind,source="$(pwd)"/target,target=/root/app/target ${DOCKER_TAG}
    ;;
  *)
    echo "Invalid command passed. Allowed commands: docker_build|compile_rust"
    ;;
esac
