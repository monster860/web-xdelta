#!/bin/sh

rm -rf xz-5.2.2
rm -f xz-5.2.2.tar.gz
wget https://github.com/xz-mirror/xz/releases/download/v5.2.2/xz-5.2.2.tar.gz
tar -xvf xz-5.2.2.tar.gz
cd xz-5.2.2
emconfigure ./configure
emmake make
cd ..

rm -rf xdelta
git clone https://github.com/jmacd/xdelta.git
cd xdelta
git apply ../xdelta.patch
cd ..

cd xdelta/xdelta3

emconfigure ./generate_build_files.sh

cd ../..