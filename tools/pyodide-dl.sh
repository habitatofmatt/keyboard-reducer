#!/usr/bin/env bash

set -e

PYODIDE_VERSION=0.23.4
PYODIDE_PACKAGE=pyodide-core-${PYODIDE_VERSION}.tar.bz2
PYODIDE_TARGET_DIR=pyodide/v${PYODIDE_VERSION}/full

wget -nc https://github.com/pyodide/pyodide/releases/download/${PYODIDE_VERSION}/${PYODIDE_PACKAGE}

rm -r pyodide || true
tar xf ${PYODIDE_PACKAGE}
mkdir -p ${PYODIDE_TARGET_DIR}
find pyodide -maxdepth 1 -type f -exec mv {} ${PYODIDE_TARGET_DIR} \;
