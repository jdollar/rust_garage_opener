#!/usr/bin/env sh

cmd=$1

cd server
case ${cmd} in
  build)
    cargo $@ --target=armv7-unknown-linux-gnueabihf
    ;;
  clean)
    cargo $@ --target=armv7-unknown-linux-gnueabihf
    ;;
  *) 
    cargo $@
    ;;
esac
