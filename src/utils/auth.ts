import {  User, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { getToken } from "./user";


async function authWithToken(req, res) {
    const headerToken = req.get('Authorization')
    const token = await getToken(headerToken)

    if (!token) {
      res.status(403)
      throw new Error("Unauthorized, provide 'Authorization: <token>' header.")
    }

    return token.user;
}


async function createDeeplinkToken(user: User) {
  const token = await prisma.deeplinkToken.create({
    data: {
      userID: user.id,
    }
  })

  return token.token;
}


export { authWithToken, createDeeplinkToken };