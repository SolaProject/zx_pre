#!/bin/bash

cp index.html index_with_font.html
cp -r ../00000000-revealjs_share/fonts ./
sed -i '/<head>/a<style> @font-face {font-family: "SimHei"; src: url(./fonts/simhei.ttf);} </style>' ./index_with_font.html
pandoc -f markdown -t html -s ./raw_doc.md -o raw_doc.html
sed -i '/<head>/a<style> body {font-family: "SimHei";} </style>' ./raw_doc.html
sed -i '/<head>/a<style> @font-face {font-family: "SimHei"; src: url(./fonts/simhei.ttf);} </style>' ./raw_doc.html
font-spider --no-backup ./raw_doc.html
# must open a new child process, or decktape will report TimeoutError
(decktape --slides 2-999 ./index_with_font.html $(date +%Y%m%d-%H%M%S)-output.pdf)
