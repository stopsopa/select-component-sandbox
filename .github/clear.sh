set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

ROOT="${DIR}/.."

cd "${ROOT}"

cd node_modules

set -euo pipefail

KEEP_DIR='^./(yargs|composite-select)$'

echo "Removing everything except: ${KEEP_DIR}"

find . -maxdepth 1 -mindepth 1 | grep -v -E "${KEEP_DIR}" | while read -r ITEM; do
  echo "Removing >${ITEM}<"
  rm -rf "${ITEM}"
done

echo "Done."