#!/bin/bash
npx prisma migrate deploy
npx tsc
node ./dist/ingex.js 