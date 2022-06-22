import { Answer, UserAnswer, User, Question, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


function randomChoice(choices: string[]) {
    let index = Math.floor(Math.random() * choices.length);
    return choices[index];
}


function trimWhitespaces(input: string): string {
    return input.slice(26, input.length)
}


export { randomChoice, trimWhitespaces };