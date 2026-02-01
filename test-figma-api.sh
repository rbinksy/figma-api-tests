#!/bin/bash

# Figma API Test Script
# Usage: ./test-figma-api.sh

FIGMA_TOKEN="${FIGMA_TOKEN:?Please set FIGMA_TOKEN environment variable}"
FILE_KEY="2Wvw7V9ERrDnwFoayq7hic"
BASE_URL="https://api.figma.com"

# Helper function for API calls
figma_api() {
  local endpoint="$1"
  curl -s -H "X-Figma-Token: $FIGMA_TOKEN" "${BASE_URL}${endpoint}"
}

echo "=== Testing Figma API ==="
echo ""

echo "1. GET /v1/me - Current User"
figma_api "/v1/me" | jq .
echo ""

echo "2. GET /v1/files/{file_key}/meta - File Metadata"
figma_api "/v1/files/${FILE_KEY}/meta" | jq .
echo ""

echo "3. GET /v1/files/{file_key}?depth=1 - File Structure (Pages)"
figma_api "/v1/files/${FILE_KEY}?depth=1" | jq .
echo ""

echo "4. GET /v1/files/{file_key}?depth=2 - File Structure (With Top-Level Objects)"
figma_api "/v1/files/${FILE_KEY}?depth=2" | jq .
