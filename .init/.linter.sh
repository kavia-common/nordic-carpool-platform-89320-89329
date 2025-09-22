#!/bin/bash
cd /home/kavia/workspace/code-generation/nordic-carpool-platform-89320-89329/blablabil_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

