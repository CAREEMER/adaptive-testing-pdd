#!/bin/bash
npx prisma migrate deploy
npx prisma generate
npx tsc
node ./dist/backend/ingex.js 