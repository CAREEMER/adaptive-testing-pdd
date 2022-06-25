import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


async function checkQuestion(questionID: number) {
    let question = await prisma.question.findFirst({
        where: {
            id: questionID,
        },
        include: {
            answers: true,
        }
    })

    console.log(question);
}


async function checkAllQuestions() {
    let questions = await prisma.question.findMany({
        include: {
            answers: true,
        }
    });
    questions.forEach((question) => {
        var hasCorrect = false;

        question.answers.forEach((answer) => {
            if (answer.correct) {
                hasCorrect = true;
            }
        })

        if (!(hasCorrect)) {
            checkQuestion(question.id)
        }
    })
}

checkAllQuestions();