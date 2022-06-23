#!/bin/bash
npx prisma db push
npx tsc
node ./dist/ingex.js 