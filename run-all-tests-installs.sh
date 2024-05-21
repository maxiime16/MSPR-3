#!/bin/bash

# Function to run npm install and test in a given directory
run_npm_commands() {
  local dir=$1
  cd "$dir" || exit
  echo "Running npm install and test in $dir"
  npm install
  npm test
  cd - || exit
}

# List of directories containing package.json
directories=("Authentification" "BackEnd" "FrontEnd" "Messagerie")

# Iterate over directories and run npm commands
for dir in "${directories[@]}"; do
  if [ -f "$dir/package.json" ]; then
    run_npm_commands "$dir"
  else
    echo "No package.json found in $dir"
  fi
done
