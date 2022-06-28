import {  User, Question, QuestionCategory, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


async function getQuestionsByCategory(categoryID: string) {
    return await prisma.question.findMany({
        where: {
            categoryID: categoryID,
        },
        select: {
            id: true,
            img: true,
            title: true,
            answers: {
                select: {
                    id: true,
                    text: true,
                }
            }

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


async function registerAnswer(res, user, question, answerID) {
    const answer = await prisma.answer.findFirst({
        where: {
            id: answerID,
            questionID: question.id
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


async function getRandomQuestion(short: boolean): Promise<Question> {
    const count = await prisma.question.count();

    const randomNumber = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    if (short) {
        var question = await prisma.question.findMany({
            orderBy: { ['id']: 'asc' },
            take: 1,
            skip: randomNumber(0, count - 1),
            select: {
                id: true,
                category: true,
                img: true,
                title: true,
                answers: {
                    select: {
                        id: true,
                        text: true,
                    }
                }

            }
        })

    } else {
        //@ts-ignore
        var question = await prisma.question.findMany({
            orderBy: { ['id']: 'asc' },
            take: 1,
            skip: randomNumber(0, count - 1),
            include: {
                answers: true
            }
        })
    }

    //@ts-ignore
    return question[0]
}


async function getRandomQuestionInCategory(category: QuestionCategory, short: boolean): Promise<Question> {
    const count = await prisma.question.count({
        where: {
            categoryID: category.id
        }
    });

    const randomNumber = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    if (short) {
        var question = await prisma.question.findMany({
            orderBy: { ['id']: 'asc' },
            where: {
                categoryID: category.id
            },
            take: 1,
            skip: randomNumber(0, count - 1),
            select: {
                id: true,
                category: true,
                img: true,
                title: true,
                answers: {
                    select: {
                        id: true,
                        text: true,
                    }
                }

            }
        })
    } else {
        //@ts-ignore
        var question = await prisma.question.findMany({
            orderBy: { ['id']: 'asc' },
            where: {
                categoryID: category.id
            },
            take: 1,
            skip: randomNumber(0, count - 1),
            include: {
                answers: true
            }
        })
    }

    //@ts-ignore
    return question[0]
}


// @ts-ignore
const chooseWeightedElement = (probs: number[]): number => {
    var totalWeight = 0;

    for (var prob in probs) {
        totalWeight = totalWeight + Number(prob);
    }

    var random = Math.floor(Math.random() * totalWeight);

    for (var i of probs) {
        random -= probs[i];

        if (random < 0) {
            return i;
        }
    }

    return probs.length - 1;
}


async function getAdaptiveQuestion(user: User, short: boolean) {
    const categories = await prisma.questionCategory.findMany();
    const countVal = 5;


    const answersOnCategories = await Promise.all(categories.map(
        async (category) => await prisma.userAnswer.findMany(
            {
                where: {
                    question: {
                        categoryID: category.id
                    },
                    userID: user.id,
                },
                take: countVal,
            }
        )
    ))

    const probs = answersOnCategories.map(
        (answersOnCategory) => countVal - answersOnCategory.filter(answer => answer.correct).length
    )

    while (probs.indexOf(0) !== -1) {
        probs[probs.indexOf(0)] = 1
    }

    const ind = chooseWeightedElement(probs)

    const chosenCategory = categories[ind];

    return await getRandomQuestionInCategory(chosenCategory, short);
}


async function getQuestion(userFindQuery, short: boolean): Promise<Question> {
    const user = await prisma.user.findUnique({
        where: userFindQuery
    })

    //@ts-ignore
    if (user.state === 'ADAPTIVE') {
        //@ts-ignore
        return getAdaptiveQuestion(user, short)
    } else {
        return getRandomQuestion(short)
    }
}


async function getQuestionById(id: string): Promise<Question | null> {
    const question = await prisma.question.findFirst({
        where: {
            id: id
        }
    })

    return question;
}


export { getQuestion, getQuestionById, getQuestionsByCategory, getQuestionsByCategoryPaginated, registerAnswer }