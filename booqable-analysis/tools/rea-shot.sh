#!/usr/bin/env bash
# usage: rea-shot.sh <name-for-latest-capture> [next-url]
# Saves the newest REA capture_web_screenshot result as PNG + evidence JSON, then navigates tab 2 to next-url.
set -e
S="C:/Users/TRUNGD~1/AppData/Local/Temp/claude/E--Projects-rental/17d08f77-d488-48b5-b53b-087cd33967c5/scratchpad"
R="/c/Users/Trung Do/.claude/projects/E--Projects-rental/17d08f77-d488-48b5-b53b-087cd33967c5/tool-results"
OUT="/e/Projects/booqable-analysis/rea-evidence"
mkdir -p "$OUT/screens" "$OUT/records"
if [ -n "$1" ]; then
  f=$(ls -t "$R"/mcp-rea-capture_web_screenshot-*.txt | head -1)
  jq -r '.normalized_result.artifact.data_base64' "$f" | tr -d '\r\n' | base64 -d > "$OUT/screens/$1.png"
  jq '.normalized_result.artifact.data_base64 = "<see screens/'"$1"'.png>"' "$f" > "$OUT/records/$1.evidence.json"
  echo "saved $1 ($(jq -r '.normalized_result.target.url' "$f")) sha256=$(jq -r '.normalized_result.artifact.sha256' "$f" | cut -c1-12)"
fi
if [ -n "$2" ]; then
  cd "$S"; echo "[{\"nav\":\"$2\",\"ms\":9000},{\"eval\":\"(()=>{const st=document.createElement('style');st.textContent='.intercom-lightweight-app,#intercom-container{display:none!important}';document.head.appendChild(st);return location.href})()\"}]" > _n.json
  timeout 60 node scripts/cdp-run2.mjs 9333 "$(cat target2.txt)" "$S/run" _n _n.json 2>&1 | tail -1 | cut -c1-120
fi
