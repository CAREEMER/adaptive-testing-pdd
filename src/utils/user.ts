import { User, SessionToken, PrismaClient } from "@prisma/client";
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

function findUserByUsername(username: string) {
  return prisma.user.findFirst({
    where: {
      username,
    }
  })
}

async function createUserByUsernameAndPassword(username: string, password: string): Promise<User> {
  password = bcrypt.hashSync(password, 12);
  return await prisma.user.create({
    data: {
      username,
      password,
      state: 'RANDOM',
    }
  });
}

async function checkPassword(username: string, password: string): Promise<Boolean> {
  const user = await prisma.user.findFirst({
    where: {
      username,
    }
  })

  return (!user || !bcrypt.compareSync(password, bcrypt.hashSync(user.password)))
}

async function createSessionToken(username: string): Promise<SessionToken> {
  return await prisma.sessionToken.create({
    data: {
      user: {
        connect: {
          username: username
        }
      }
    }
  })
}

async function findUserById(id: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}


async function getToken(token: string) {
  return await prisma.sessionToken.findFirst({
    where: {
      id: token,
      active: true,
    },
    include: {
      user: true
    }
  })
}

export {
  findUserByUsername,
  findUserById,
  checkPassword,
  createSessionToken,
  createUserByUsernameAndPassword,
  getToken,
};