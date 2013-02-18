#!/bin/bash
git submodule init
git submodule update
rm -Rf node_modules/titanium-backbone
cd node_modules
ln -s ../submodules/titanium-backbone titanium-backbone
cd titanium-backbone && npm install
