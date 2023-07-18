import 'dotenv/config'
import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { retrieveData } from './retrieve-data'

const ALLOWED_USERS = process.env.ALLOWED_USERS.split(' ').map(Number)

;(async () => {
    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

    bot.on(message('text'), async (ctx) => {
        if (!ALLOWED_USERS.includes(ctx.message.chat.id)) {
            await ctx.telegram.sendMessage(
                ALLOWED_USERS[0],
                JSON.stringify(ctx.message)
            )
        } else {
            const data = await retrieveData()
            await ctx.reply(JSON.stringify(data))
        }
    })

    await bot.launch()

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
})()
