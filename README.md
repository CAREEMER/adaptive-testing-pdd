docker-compose rm -s -v -f db && docker-compose up -d && npx prisma db push

tsc && node ./dist/src/fill-db.js

tsc && node ./dist/src/index.js


ONLY CREATE MIGRATIONS:
npx prisma migrate dev --create-only

npx prisma migrate dev --name migration_name


RESTORE DB
cat pdd-tg-bot.dump | docker exec -i db_db_1 psql -U rashid -d pdd-tg-bot-staging
BACKUP
docker exec -it db_db_1 pg_dump -U rashid -w pdd-tg-bot-staging --no-owner > st-pdd-tg-bot.dump