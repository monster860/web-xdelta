#!/bin/sh

rm -f dist/xdelta3.js
rm -f dist/xdelta3.wasm

cd xdelta/xdelta3

emmake make clean
emmake make xdelta3

cd ../..

mv xdelta/xdelta3/.libs/xdelta3 dist/xdelta3.js
mv xdelta/xdelta3/.libs/xdelta3.wasm dist/xdelta3.wasm
