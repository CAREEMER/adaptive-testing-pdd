import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


async function getQuestionsByCategory(categoryID: string) {
    return await prisma.question.findMany({
        where: {
            categoryID: categoryID,
        },
        include: {
            answers: true
        }
    })
}


async function getQuestionsByCategoryPaginated(categoryID: string, skip: number, take: number) {
    return await prisma.question.findMany({
        skip: skip,
        take: take,
        where: {
            categoryID: categoryID
        }
    })
}


async function registerAnswer(res, user, questionID, answerID) {
    const answer = await prisma.answer.findFirst({
        where: {
            id: answerID,
            questionID: questionID
        }
    })

    if (!answer) {
        res.status(404)
        throw new Error("Can't find such answer.")
    }

    await prisma.userAnswer.create({
        data: {
            correct: answer.correct,
            //@ts-ignore
            questionID: answer.questionID,
            userID: user.id
        }
    })

    return answer.correct
}


export { getQuestionsByCategory, getQuestionsByCategoryPaginated, registerAnswer }