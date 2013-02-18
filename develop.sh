#!/bin/bash
git submodule init
git submodule update
rm -Rf node_modules/titanium-backbone
ln -s submodules/titanium-backbone node_modules/titanium-backbone
cd node_modules/titanium-backbone
npm install
