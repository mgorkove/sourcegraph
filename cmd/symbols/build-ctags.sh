#!/usr/bin/env bash

# This script builds the ctags image for local development.

cd "$(dirname "${BASH_SOURCE[0]}")/../.."
set -eu

# If CTAGS_COMMAND is set to a custom executable, we don't need to build the
# image. See /dev/universal-ctags-dev.
if [[ "${CTAGS_COMMAND}" != "dev/universal-ctags-dev" ]]; then
  echo "CTAGS_COMMAND set to custom executable. Building of Docker image not necessary."
  exit 0
fi

# Build ctags docker image for universal-ctags-dev
echo "Building ctags docker image"
docker build -f cmd/symbols/Dockerfile -t ctags . \
  --platform linux/amd64 \
  --target=ctags \
  --progress=plain
