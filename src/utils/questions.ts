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


export { getQuestionsByCategory, getQuestionsByCategoryPaginated }