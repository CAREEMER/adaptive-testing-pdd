import { Question, User, PrismaClient, QuestionCategory } from "@prisma/client";
import e from "express";
import { constructQuestionKeyboard } from "./keyboard";


const prisma = new PrismaClient();


function sendQuestion(ctx, question: Question) {
    if (question.img) { ctx.replyWithPhoto(question.img) };

    var keyboard = constructQuestionKeyboard(question);
    ctx.reply(constructMessageText(question), keyboard)
}


function constructMessageText(question) {
    let output = question.title + "\n\n";

    for (let i = 0; i < question.answers.length; i++) {
        const answer = question.answers[i]
        output += (i + 1).toString() + " - " + answer.text + "\n\n"
    }

    return output
}


async function getQuestion(telegramID: number): Promise<Question> {
    const user = await prisma.user.findUnique({
        where: {
            telegramID: telegramID,
        }
    })

    //@ts-ignore
    if (user.state === 'ADAPTIVE') {
        //@ts-ignore
        return getAdaptiveQuestion(user)
    } else {
        return getRandomQuestion()
    }
}


async function getRandomQuestion(): Promise<Question> {
    const count = await prisma.question.count();

    const randomNumber = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const question = await prisma.question.findMany({
        orderBy: { ['id']: 'asc' },
        take: 1,
        skip: randomNumber(0, count - 1),
        include: {
            answers: true
        }
    })

    return question[0]
}


async function getRandomQuestionInCategory(category: QuestionCategory): Promise<Question> {
    const count = await prisma.question.count({
        where: {
            categoryID: category.id
        }
    });

    const randomNumber = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const question = await prisma.question.findMany({
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


async function getAdaptiveQuestion(user: User) {
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

    return await getRandomQuestionInCategory(chosenCategory);
}


async function getQuestionById(id: string): Promise<Question | null> {
    const question = await prisma.question.findFirst({
        where: {
            id: id
        }
    })

    return question;
}


export { getRandomQuestion, getAdaptiveQuestion, getQuestionById, sendQuestion, getQuestion }