
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

ROOT="${DIR}"

ENVFILE="${ENVFILE:-.env}"

source "${DIR}/bash/require_non_empty_var.sh"

# Load environment variables
eval "$(/bin/bash "${ROOT}/bash/exportsource.sh" "${ROOT}/.env")"

require_non_empty_var "${0}" "PROJECT"
require_non_empty_var "${0}" "HOST"
require_non_empty_and_matching_var "${0}" "PORT" "^[0-9]+$"












