const EasyYandexS3 = require("easy-yandex-s3")
const https = require('https')                                              
const Stream = require('stream').Transform                           
const fs = require('fs')

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function updateImg() {
    const question = await prisma.question.findMany()
}