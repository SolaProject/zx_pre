#!/bin/bash

cp index.html index_with_font.html
cp -r ../00000000-revealjs_share/fonts ./
sed -i '/<head>/a<style> @font-face {font-family: "SimHei"; src: url(./fonts/simhei.ttf);} </style>' ./index_with_font.html
decktape ./index_with_font.html $(date +%Y%m%d-%H%M%S)-output.pdf
rm -rf ./fonts
