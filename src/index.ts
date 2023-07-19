import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { MyContext, Triggers } from './types'
import { logger } from './utils/logger'
import { TELEGRAM_BOT_TOKEN } from './config'
import { handleTextMessage } from './handlers/handle-text-message'
import { handleGetData } from './handlers/handle-get-data'
;(async () => {
    logger.info(`Initializing bot...`)
    const bot = new Telegraf<MyContext>(TELEGRAM_BOT_TOKEN)
    logger.info(`Bot initialized`)

    bot.use((ctx, next) => {
        if (!ctx.chat?.id) {
            return next()
        }

        ctx.userId = ctx.message?.from.id || ctx.chat.id

        return next()
    })

    bot.on(message('text'), handleTextMessage)

    bot.action(Triggers.GET_DATA, handleGetData)

    logger.info(`Launching bot`)
    await bot.launch()

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
})()
