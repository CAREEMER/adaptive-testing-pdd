import {  User, PrismaClient, QuestionCategory } from "@prisma/client";
const prisma = new PrismaClient();


// async function getStatistics(userId: string) {
//     const categories = await prisma.questionCategory.


//     // const categories = await prisma.questionCategory.findMany();

//     const answersOnCategories = await Promise.all(categories.map(
//         async (category) => await prisma.userAnswer.findMany(
//             {
//                 where: {
//                     question: {
//                         categoryID: category.id
//                     },
//                     userID: user.id,
//                 },
//             }
//         )
//     ))

//     const probs = answersOnCategories.map(
//         (answersOnCategory) => countVal - answersOnCategory.filter(answer => answer.correct).length
//     )
// }