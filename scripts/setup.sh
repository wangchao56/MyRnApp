#!/usr/bin/env bash
# Unix 入口（macOS / Linux）→ 跨平台安装逻辑见 scripts/setup.js
set -euo pipefail
cd "$(dirname "$0")/.."
exec node scripts/setup.js "$@"
