#!/bin/bash

set -e
set -x

rm -rf build
npm run build
(cd gh-pages; git checkout gh-pages;)
find gh-pages -maxdepth 1 -type f -delete
rm -rf gh-pages/static
cp -r  build/* gh-pages
cd gh-pages
git add .
set -e
git commit -m "update pages"
git push