#!/bin/bash

# Function to run npm install and test in a given directory
run_npm_commands() {
  local dir=$1
  cd "$dir" || exit
  echo "Running npm install in $dir"
  npm install

  # Check if the package.json has a test script before running npm test
  if grep -q "\"test\"" package.json; then
    echo "Running npm test in $dir"
    npm test
  else
    echo "No test script found in $dir/package.json"
  fi

  cd - || exit
}

# List of directories containing package.json
directories=("Authentification" "BackEnd" "FrontEnd" "Messagerie")

# Use nvm to set the Node.js version
echo "Switching to Node.js version 18 using nvm"
nvm use 18

# Iterate over directories and run npm commands
for dir in "${directories[@]}"; do
  if [ -f "$dir/package.json" ]; then
    run_npm_commands "$dir"
  else
    echo "No package.json found in $dir"
  fi
done
