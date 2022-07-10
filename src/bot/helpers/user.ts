import { User, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


async function registerUser(ctx, redisClient) {
    const redisKey = 'user**' + ctx.chat.id.toString()
    const cachedUser = await redisClient.get(redisKey)

    if (!cachedUser) {
        var user = await prisma.user.findUnique({
            where: {
                telegramID: ctx.chat.id
            }
        }) || await prisma.user.create({
            data: {
                telegramID: ctx.chat.id,
            }
        })

        await redisClient.set(redisKey, JSON.stringify(user))
    } else {
        //@ts-ignore
        var user = JSON.parse(cachedUser);
    }

    return user;
}


async function registerUserAnswer(telegramID: number, questionID: string, correct: boolean) {
    console.log(questionID)
    await prisma.userAnswer.create({
        data: {
            correct: correct,
            question: {
                connect: {
                    id: questionID
                }
            },
            user: {
                connect: {
                    telegramID: telegramID
                }
            }
        }
    })
}


async function updateUserState(telegramID: number, state: string, redisClient) {
    const redisKey = "user**" + telegramID.toString()

    const user = await prisma.user.update({
        where: {
            telegramID: telegramID
        },
        data: {
            // @ts-ignore
            state: state,
        }
    })

    await redisClient.set(redisKey, JSON.stringify(user))
}


export { registerUser, registerUserAnswer, updateUserState };