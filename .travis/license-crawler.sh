#!/bin/bash

# Path to this file
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# shellcheck source=_shared-vars.sh
. "${DIR}/_shared-vars.sh"

echo
echo "+++ Run node license finder +++"
echo

if [[ ${TRAVIS_PULL_REQUEST} != false ]]; then
  echo -e "${YELLOW}+ Pull Request. Write dummy data.${NC}"

  echo '{"data":[{"name":"NO-DEP","version":"0.0.1","repository":"https://exmaple.com","license":"MIT","devDependency":false},{"name":"NO-DEP","version":"0.0.1","repository":"https://exmaple.com","license":"MIT","devDependency":true}]}' > "${DIR}/../api/nlf-licenses.json"
  sed -i "s#// DEPENDENCY_REPLACE#new Dependency('NO-DEP', '0.0.1', 'https://example.com', 'MIT', false), new Dependency('NO-DEP', '0.0.1', 'https://example.com', 'MIT', true)#" "${DIR}/../app/webFrontend/src/app/about/licenses/dependencies.ts"

  exit 0;
fi

if [[ ${TRAVIS_BRANCH} == "master" ]] || [[ ${TRAVIS_BRANCH} == "develop" ]] || [[ -n ${TRAVIS_TAG} ]]; then
  cd "${DIR}" || exit 0

  node license-crawler.js

  exit 0
fi

echo -e "${YELLOW}+ Branch not master or develop and no tag. Nothing todo.${NC}"
exit 0
