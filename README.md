docker-compose rm -s -v -f db && docker-compose up -d && npx prisma db push

tsc && node ./dist/src/fill-db.js

tsc && node ./dist/src/index.js


ONLY CREATE MIGRATIONS:
npx prisma migrate dev --create-only

npx prisma migrate dev --name migration_name