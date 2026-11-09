#!/bin/sh

set -eu

OPENAPI_FILE="$(mktemp)"
trap 'rm -f "$OPENAPI_FILE"' EXIT

# The current API certificate is expired, so curl must fetch the document.
curl -kfsS 'https://3.38.112.170/v3/api-docs' -o "$OPENAPI_FILE"
openapi-typescript "$OPENAPI_FILE" -o './src/shared/types/schema.ts'
