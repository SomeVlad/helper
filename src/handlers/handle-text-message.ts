import { logger } from '../utils/logger'
import { ALLOWED_USERS_LIST } from '../config'
import { Markup } from 'telegraf'
import { Triggers } from '../types'

const KEYBOARD = Markup.inlineKeyboard([
    Markup.button.callback('Сколько у меня осталось данных', Triggers.GET_DATA),
])

export async function handleTextMessage(ctx) {
    logger.info(`Text message received: ${JSON.stringify(ctx.update)}`)

    if (!ALLOWED_USERS_LIST.includes(ctx.userId)) {
        logger.info(`Text message from an unauthorized user: sending report`)
        return await ctx.telegram.sendMessage(
            ALLOWED_USERS_LIST[0],
            JSON.stringify(ctx.message)
        )
    }

    logger.info(`Replying with keyboard...`)

    return ctx.reply('Я жажду служить…', KEYBOARD)
}
