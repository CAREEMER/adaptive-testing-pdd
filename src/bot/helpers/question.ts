import { Question, PrismaClient } from "@prisma/client";
import { constructQuestionKeyboard } from "./keyboard";


const prisma = new PrismaClient();


function sendQuestion(ctx, telegram, question: Question) {
    const messageText = constructMessageText(question);

    if (question.img) {
        telegram.sendPhoto(
            ctx.from.id, question.img, constuctKeyboard(question, messageText)
        )
    } else {
        var keyboard = constructQuestionKeyboard(question);
        ctx.reply(constructMessageText(question), keyboard)
    }
}

function constuctKeyboard(question, messageText) {
    var keys = []
    var replyMarkup = {
        reply_markup: {
            inline_keyboard: [keys]
        }, caption: messageText
    }

    for (let i = 0; i < question.answers.length; i++) {
        const answer = question.answers[i];
        // @ts-ignore
        keys.push({ text: i + 1, callback_data: answer.correct + '**' + question.id, hide: false })
    }

    console.log(replyMarkup.reply_markup.inline_keyboard)

    return replyMarkup
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