FROM ubuntu:latest

SHELL ["/bin/bash", "-c"]
ENV HOME /root

WORKDIR ${HOME}/app

RUN apt-get update && \
  apt-get install -y \
    curl \
    gcc-arm-linux-gnueabihf

RUN curl https://sh.rustup.rs -sSf | sh -s -- --default-toolchain nightly -y
ENV PATH ${HOME}/.cargo/bin:${PATH}
RUN rustup target add armv7-unknown-linux-gnueabihf

ADD ./docker/cargo/config ${HOME}/.cargo/config
ADD ./docker/build_script.sh build_script.sh

ADD . .

ENTRYPOINT [ "/bin/sh", "-c", "./build_script.sh"]
