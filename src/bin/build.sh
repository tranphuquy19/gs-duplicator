#!/bin/bash

# Set the version of the user script by timestamp (UTC milliseconds)
export USER_SCRIPT_VERSION=$(date +%s%3N)

# Build the project
export MINIMIZE=true
echo "Building with minimization..."
npx webpack

# Backup the minified files to ./tmp
mkdir -p ./tmp
cp -r ./dist/* ./tmp

export MINIMIZE=false
echo "Building without minimization..."
npx webpack

# COPY minified files from ./tmp to ./dist and remove ./tmp
cp -r ./tmp/* ./dist
rm -rf ./tmp
