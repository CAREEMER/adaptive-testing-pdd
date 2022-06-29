import { Question, PrismaClient } from "@prisma/client";
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


export { sendQuestion }