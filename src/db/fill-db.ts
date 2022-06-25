import { PrismaClient } from "@prisma/client";
import { trimWhitespaces } from "../helpers/helpers";
const fs = require('fs')


const prisma = new PrismaClient();


async function createCategory(data) {
    await prisma.questionCategory.create({
        data: data,
    })
}


function constructAnswers(answers, correct_answer_index) {
    var outputAnswers = []
    answers.forEach((value, index) => {
        const correct = Number(correct_answer_index) === index + 1;

        const answerText = trimWhitespaces(value)
        
        outputAnswers.push({
            //@ts-ignore
            correct: correct,
            //@ts-ignore
            text: answerText,
        })
    })
    return outputAnswers
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function getUniqueCategories() {
    const questionDir = "./questions/"


    fs.readdir(questionDir, (err, files) => {
        if (err) throw err;

        var categories: string[] = [];
        var data = [];

        files.forEach(questionFile => {
            const categoryName: string = questionFile.split("__")[0];
            if (!(categories.includes(categoryName))){
                //@ts-ignore
                categories.push(categoryName);
                //@ts-ignore

                data.push({name: categoryName, questions: {create: []}});
            }
            
            //@ts-ignore
            let categoryIndex = data.findIndex(x => x.name === categoryName)

            const questionData = JSON.parse(fs.readFileSync(questionDir + questionFile, 'utf-8'));

            const question = {
                img: questionData.img,
                title: questionData.title,
                answer_explanation: questionData.full_corrent_answer,
                answers: {
                    create: constructAnswers(questionData.answers, questionData.correct_answer_index)
                }
            }

            // @ts-ignore
            data[categoryIndex].questions.create.push(question)
        });


        for (const category of data) {
            createCategory(category)
            sleep(100)
        }

    })
}


getUniqueCategories()
