#!/bin/bash

# Utiliser nvm pour changer de version de Node.js
if command -v nvm &> /dev/null
then
    echo "Switching to Node.js version 18 using nvm"
    nvm use 18
else
    echo "nvm is not installed. Please install nvm first."
    exit 1
fi

# Fonction pour exécuter npm install et npm test
run_npm_commands() {
    local dir=$1
    cd "$dir" || exit
    echo "Running npm install in $dir"
    npm install

    echo "Running npm test in $dir"
    npm test

    cd - || exit
}

# Liste des dossiers à traiter
directories=("Authentification" "BackEnd" "FrontEnd" "Messagerie")

# Parcourir chaque dossier et exécuter les commandes npm
for dir in "${directories[@]}"; do
    run_npm_commands "$dir"
done
