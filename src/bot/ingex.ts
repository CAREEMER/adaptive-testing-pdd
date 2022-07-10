import { Telegraf } from "telegraf";
import { getQuestion, getQuestionById } from "../utils/questions";
import { registerUserAnswer, registerUser, updateUserState } from "./helpers/user";
import { sendQuestion } from "./helpers/question";
import { constructSelectModeKeyboard } from "./helpers/keyboard";
import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_DSN || 'redis://localhost:6379'
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();


//@ts-ignore
const bot = new Telegraf(process.env.TG_TOKEN || '5557815278:AAHh8l21JqkjOtTc7swr6KoQHezhI6H9VkU');
const environment = process.env.ENVIRONMENT || 'local'


// MIDDLEWARE

bot.use(async (ctx, next) => {
    console.time(`Processing update ${ctx.update.update_id}`);
    await next();
    console.timeEnd(`Processing update ${ctx.update.update_id}`);
})

bot.use(async (ctx, next) => {
    const user = await registerUser(ctx, redisClient);

    //@ts-ignore
    if (ctx.message?.dice?.emoji === '🎲') {
        //@ts-ignore
        await updateUserState(user.telegramID, 'RANDOM', redisClient)
        await ctx.reply("Вы выбрали случайные вопросы!")
        //@ts-ignore
    } else if (ctx.message?.text === '📊') {
        //@ts-ignore
        await updateUserState(user.telegramID, 'ADAPTIVE', redisClient)
        await ctx.reply("Бот теперь будет адаптивно подбирать вопросы!")
        //@ts-ignore
    } else if (ctx.message?.text === '📝 Следующий вопрос') {
        sendQuestion(ctx, bot.telegram, await getQuestion({ telegramID: user.telegramID }, false));
    }
    await next();
})

// END MIDDLEWARE


bot.command('start', async (ctx) => {
    const startReply: string = "Привет! Это ПДД-бот с адаптивным тестированием. По мере твоих ответов на вопросы ПДД бот будет учиться и давать тебе вопросы из тем, которые ты знаешь хуже.\nСкорейшего обучения!\n\nВведи /q чтобы начать тестирование!"
    await ctx.reply(startReply, constructSelectModeKeyboard())
})

bot.command('q', async (ctx) => {
    sendQuestion(ctx, bot.telegram, await getQuestion({ telegramID: ctx.message.from.id }, false));
})

bot.on('callback_query', async (ctx) => {
    // @ts-ignore
    var data = ctx.callbackQuery.data.split("**");

    const isCorrect = data[0] === 'true';
    const questionID = data[1];

    if (!(isCorrect)) {
        var question = await getQuestionById(questionID);

        // @ts-ignore
        ctx.reply(question.answer_explanation);
    }

    // @ts-ignore
    await registerUserAnswer(Number(ctx.chat.id), questionID, isCorrect);

    //@ts-ignore
    var randomQuestion = await getQuestion({ telegramID: ctx.chat.id }, false)

    sendQuestion(ctx, bot.telegram, randomQuestion);
})

if (environment === 'local') {
    bot.launch()
    console.log("BOT IS STARTED")
} else {
    bot.launch({
        webhook: {
            domain: process.env.DOMAIN,
            hookPath: process.env.SECRET_PATH || '/secret-path',
            port: 80
        }
    })

    const webhookUrl = process.env.DOMAIN + (process.env.SECRET_PATH || '/secret-path')

    if (process.env.SET_WEBHOOK || false) {
        bot.telegram.setWebhook(webhookUrl)
    }

    console.log("BOT IS STARTED ON " + webhookUrl)
}


function botStop(stopReason: string) {
    redisClient.disconnect()
    bot.stop(stopReason)
}

process.once('SIGINT', () => botStop('SIGINT'))
process.once('SIGTERM', () => botStop('SIGTERM'))
