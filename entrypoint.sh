#!/bin/bash

if [[ $ENVIRONMENT == "develop" ]]; then
    yarn start:dev
else
    yarn start
fi