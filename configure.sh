#!/bin/sh

cd xdelta/xdelta3

# emconfigure ./configure CFLAGS=-DNOT_MAIN "LDFLAGS="
emconfigure ./configure "CFLAGS=-I${PWD}/../../xz-5.2.2/src/liblzma/api" "LDFLAGS=-s ALLOW_MEMORY_GROWTH=1 -L${PWD}/../../xz-5.2.2/src/liblzma/.libs -llzma -lworkerfs.js"

cd ../..
