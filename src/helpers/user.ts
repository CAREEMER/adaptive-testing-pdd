import { User, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


async function registerUser(ctx): Promise<User> {
    const user = await prisma.user.findUnique({
        where: {
            telegramID: ctx.chat.id
        }
    })

    if (!(user)) {
        return await prisma.user.create({
            data: {
                telegramID: ctx.chat.id,
                username: ctx.chat.username,
            }
        })
    }

    return user;
}


async function registerUserAnswer(telegramID: number, questionID: number, correct: boolean) {
    await prisma.userAnswer.create({
        data: {
            correct: correct,
            questionID: questionID,
            userID: telegramID,
        }
    })
}


async function updateUserState(telegramID: number, state: string) {
    const user = await prisma.user.update({
        where: {
            telegramID: telegramID
        },
        data: {
            // @ts-ignore
            state: state,
        }
    })
}


export { registerUser, registerUserAnswer, updateUserState };