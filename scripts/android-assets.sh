#!/usr/bin/env bash
# Regenerates the Android launcher icons and splash screens from the Groundwork brand mark
# (blue rounded square with a white "G", as in public/brand/icon.svg). Needs rsvg-convert.
set -euo pipefail
cd "$(dirname "$0")/.."
RES=android/app/src/main/res
BLUE="#3b6bff"; DARK="#0a0c12"
FONT="Archivo, Nimbus Sans, Arial, sans-serif"

# G letter centred in a WxH canvas, letter height ~ S px
# (baseline = centre + half the cap height, ~0.36 em, so the letter is optically centred)
glyph() { local w=$1 h=$2 s=$3; printf '<text x="%s" y="%s" text-anchor="middle" font-family="%s" font-size="%s" font-weight="900" fill="#fff">G</text>' \
  "$(( w / 2 ))" "$(( h / 2 + s * 36 / 100 ))" "$FONT" "$s"; }

for d in mdpi:1 hdpi:1.5 xhdpi:2 xxhdpi:3 xxxhdpi:4; do
  name=${d%%:*}; k=${d##*:}
  px() { python3 -c "print(round($1*$k))"; }
  L=$(px 48); F=$(px 108)
  printf '<svg xmlns="http://www.w3.org/2000/svg" width="%s" height="%s"><rect width="%s" height="%s" rx="%s" fill="%s"/>%s</svg>' \
    "$L" "$L" "$L" "$L" "$(px 13)" "$BLUE" "$(glyph "$L" "$L" "$(px 26)")" | rsvg-convert -f png > "$RES/mipmap-$name/ic_launcher.png"
  printf '<svg xmlns="http://www.w3.org/2000/svg" width="%s" height="%s"><circle cx="%s" cy="%s" r="%s" fill="%s"/>%s</svg>' \
    "$L" "$L" "$(( L / 2 ))" "$(( L / 2 ))" "$(( L / 2 ))" "$BLUE" "$(glyph "$L" "$L" "$(px 26)")" | rsvg-convert -f png > "$RES/mipmap-$name/ic_launcher_round.png"
  # Adaptive foreground: 108dp canvas, letter inside the 66dp safe zone (background colour below)
  printf '<svg xmlns="http://www.w3.org/2000/svg" width="%s" height="%s">%s</svg>' \
    "$F" "$F" "$(glyph "$F" "$F" "$(px 56)")" | rsvg-convert -f png > "$RES/mipmap-$name/ic_launcher_foreground.png"
done

# Splash screens: dark background, centred brand mark
for f in "$RES"/drawable*/splash.png; do
  read -r w h < <(python3 -c "import struct,sys;d=open(sys.argv[1],'rb').read(24);print(*struct.unpack('>II',d[16:24]))" "$f")
  s=$(( (w < h ? w : h) * 26 / 100 )); x=$(( (w - s) / 2 )); y=$(( (h - s) / 2 ))
  printf '<svg xmlns="http://www.w3.org/2000/svg" width="%s" height="%s"><rect width="%s" height="%s" fill="%s"/><svg x="%s" y="%s" width="%s" height="%s" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="%s"/><text x="32" y="44" text-anchor="middle" font-family="%s" font-size="32" font-weight="900" fill="#fff">G</text></svg></svg>' \
    "$w" "$h" "$w" "$h" "$DARK" "$x" "$y" "$s" "$s" "$BLUE" "$FONT" | rsvg-convert -f png > "$f.tmp" && mv "$f.tmp" "$f"
done

printf '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">%s</color>\n</resources>\n' "$BLUE" \
  > "$RES/values/ic_launcher_background.xml"
echo "Android icons and splash screens regenerated."
