import { logger } from '../utils/logger'
import { cachedRetrieveData } from '../retrieve-data'
import { getTextResponse } from '../utils/get-text-response'

export async function handleGetData(ctx) {
    logger.info(`getData keyboard button pressed`)

    logger.info(`Retrieving data for chat id ${ctx.userId}...`)
    const [remainder, total] = await cachedRetrieveData(ctx.userId)
    logger.info(`Data retrieved: ${JSON.stringify([remainder, total])}`)

    logger.info(`Building text response...`)

    const text = getTextResponse(remainder, total)
    logger.info(`Text response: ${text}`)

    logger.info(`Sending text response...`)
    await ctx.replyWithHTML(text)
    logger.info(`Text response sent`)
}
