import { PrismaClient } from "@prisma/client";
import { trimWhitespaces } from "../helpers/helpers";
const fs = require('fs')


const prisma = new PrismaClient();


async function createCategory(categoryName: string) {
    const exists = await prisma.questionCategory.findFirst({
        where: {
            name: categoryName
        }
    })

    if (exists) {return}

    await prisma.questionCategory.create({
        data: {
            name: categoryName
        }
    })
}


async function createQuestion(question_data) {
    const category = await prisma.questionCategory.findFirst({
        where: {
            name: question_data.category
        }
    })

    var question = await prisma.question.findFirst({
        where: {
            categoryID: category?.id,
            img: question_data.img,
            title: question_data.title,
        }
    })

    if (!(question)) {

        question = await prisma.question.create({
            data: {
                categoryID: category?.id,
                img: question_data.img,
                title: question_data.title,
                answer_explanation: question_data.full_corrent_answer,
            }
        })

    }   

    question_data.answers.forEach(async(value, index) => {
        const correct = Number(question_data.correct_answer_index) === index + 1;

        const answerText = trimWhitespaces(question_data.answers[index])

        const exists = await prisma.answer.findFirst({
            where: {
                questionID: question?.id,
                correct: correct,
                text: answerText,
            }
        })

        if (exists) {return}

        await prisma.answer.create({
            data: {
                //@ts-ignore
                questionID: question.id,
                correct: correct,
                text: answerText,
            }
        })

    })
}


function getUniqueCategories() {
    let uniqueCategories = new Set();

    const questionDir = "./questions/"


    fs.readdir(questionDir, (err, files) => {
        if (err) throw err;

        var categories: string[] = [];
        var questions = [];

        files.forEach(questionFile => {
            const category: string = questionFile.split("__")[0];
            if (!(categories.includes(category))){
                categories.push(category);
            }

            const question = JSON.parse(fs.readFileSync(questionDir + questionFile, 'utf-8'));
            question.category = category;

            // @ts-ignore
            questions.push(question);
        });
        
        categories.forEach(element => {
            createCategory(element);
        });

        questions.forEach(element => {
            createQuestion(element);
        });
    })
}

getUniqueCategories()
