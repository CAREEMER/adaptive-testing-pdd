import { QuestionCategory, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


async function listAllCategories(): Promise<QuestionCategory> {
    //@ts-ignore
    return await prisma.questionCategory.findMany();
}


export { listAllCategories }