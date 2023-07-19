import puppeteer, { Browser } from 'puppeteer'
import { logger } from './utils/logger'
import { withCache } from './utils/withCache'
import { DataMatch, DataUnit } from './types'
import { USERNAME, PASSWORD, LINK } from './config'

const USERNAME_SELECTOR = '#UserLoginType_alias'
const PASSWORD_SELECTOR = '#UserLoginType_password'
const LOGIN_BUTTON_SELECTOR = '#loginButton button'
const DATA_USAGE_SELECTOR = '.dataUsageBar .medium'
const CACHE_DURATION = 10 * 60 * 1000 // 10 mins

let browser: Browser
async function retrieveData(chatId) {
    try {
        logger.info(`Launching browser...`)
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox'],
        })
        const page = await browser.newPage()
        logger.info(`Browser launched`)

        logger.info('Navigating to the login page...')
        await page.goto(LINK)
        await page.setViewport({ width: 1080, height: 1024 })
        logger.info('Navigated')

        logger.info('Typing credentials, submitting form...')
        // Type into login box
        await page.type(USERNAME_SELECTOR, USERNAME)
        await page.type(PASSWORD_SELECTOR, PASSWORD)
        await page.click(LOGIN_BUTTON_SELECTOR)
        logger.info('Form submitted')

        logger.info('Waiting for the needed selector...')
        const dataUsageElement = await page.waitForSelector(DATA_USAGE_SELECTOR)
        const dataUsageText = await dataUsageElement?.evaluate(
            (el) => el.textContent
        )

        logger.info(`Data usage text: ${dataUsageText}`)

        if (!dataUsageText) {
            throw new Error('Error: Data usage not found.')
        }

        const regex = new RegExp(/(\d{1,3}(?:,\d{2})?) (\w{2})/g)

        const matches: DataMatch[] = []

        let match: RegExpExecArray | null
        while ((match = regex.exec(dataUsageText)) !== null) {
            matches.push({
                value: parseFloat(match[1].replace(',', '.')),
                unit: match[2] as DataUnit,
            })
        }

        logger.info(`Data usage: ${JSON.stringify(matches)}`)

        return matches
    } catch (error) {
        logger.error('Error:', error)
        throw error
    } finally {
        if (browser) {
            await browser.close()
        }
    }
}

export const cachedRetrieveData = withCache(retrieveData, CACHE_DURATION)
