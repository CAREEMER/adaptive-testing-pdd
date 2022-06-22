import { Telegraf } from "telegraf";
import { getQuestion, getQuestionById } from "./helpers/question";
import { registerUserAnswer, registerUser, updateUserState } from "./helpers/user";
import { sendQuestion } from "./helpers/question";
import { constructSelectModeKeyboard } from "./helpers/keyboard";


//@ts-ignore
const bot = new Telegraf(process.env.TG_TOKEN);



// MIDDLEWARE

bot.use(async (ctx, next) => {
    console.time(`Processing update ${ctx.update.update_id}`);
    await next();
    console.timeEnd(`Processing update ${ctx.update.update_id}`);
})

bot.use(async (ctx, next) => {
    const user = await registerUser(ctx);

    //@ts-ignore
    if (ctx.message?.dice?.emoji === '🎲') {
        await updateUserState(user.telegramID, 'RANDOM')
    //@ts-ignore
    } else if (ctx.message?.text === '📊') {
        await updateUserState(user.telegramID, 'ADAPTIVE')
    }
    await next();
})

// END MIDDLEWARE


bot.command('start', async(ctx) => {
    const startReply: string = "Привет! Это ПДД-бот с адаптивным тестированием. По мере твоих ответов на вопросы ПДД бот будет учиться и давать тебе вопросы из тем, которые ты знаешь хуже.\nСкорейшего обучения!"
    await ctx.reply(startReply, constructSelectModeKeyboard())
})

bot.command('q', async(ctx) => {
    const question = await getQuestion(ctx.message.from.id);
    // const question = await getRandomQuestion()
    sendQuestion(ctx, question);
})

bot.on('callback_query', async(ctx) => {
    // @ts-ignore
    var data = ctx.callbackQuery.data.split("**");

    const isCorrect = data[0] === 'true';
    const questionID = data[1];
        
    if (!(isCorrect)) {
        var question = await getQuestionById(Number(questionID));

        // @ts-ignore
        ctx.reply(question.answer_explanation);
    }

    // @ts-ignore
    await registerUserAnswer(Number(ctx.chat.id), Number(questionID), isCorrect);

    //@ts-ignore
    var randomQuestion = await getQuestion(ctx.chat.id)

    sendQuestion(ctx, randomQuestion);
})


bot.launch()
console.log("BOT IS STARTED")
