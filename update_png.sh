# -strip to prevent timestamp in image
# resize at the end to smoothen edges.
convert -strip -background transparent -size 384x384 logo.svg -antialias -resize 192x192 assets/logo_192.png
convert -strip -background transparent -density 300 logo.svg -resize 80% -background transparent -gravity center -extent 120% -resize 512x512 -antialias assets/logo_512.png
