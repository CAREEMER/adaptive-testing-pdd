-- CreateTable
CREATE TABLE "DeeplinkToken" (
    "token" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userID" UUID NOT NULL,

    CONSTRAINT "DeeplinkToken_pkey" PRIMARY KEY ("token")
);

-- AddForeignKey
ALTER TABLE "DeeplinkToken" ADD CONSTRAINT "DeeplinkToken_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
