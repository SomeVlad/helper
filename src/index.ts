import puppeteer from 'puppeteer'
import * as winston from 'winston'

enum DataUnit {
    GB = 'GB',
    MB = 'MB',
}

type DataMatch = {
    value: string
    unit: DataUnit
}

function getTimestamp() {
    return new Date(Date.now()).toUTCString()
}

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf(
            (info) =>
                `${info.timestamp} ${info.level}: ${info.message}` +
                (info.splat !== undefined ? `${info.splat}` : ' ')
        )
    ),
    transports: [new winston.transports.Console()],
    level: 'debug',
})

;(async () => {
    try {
        logger.info(`Starting: ${getTimestamp()}`)
        const browser = await puppeteer.launch({ headless: 'new' })
        // const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()

        logger.info('Navigating to the login page')
        await page.goto('link')

        // Set screen size
        await page.setViewport({ width: 1080, height: 1024 })

        // Type into login box
        await page.type('#UserLoginType_alias', 'login')
        await page.type('#UserLoginType_password', 'password')
        await page.click('#loginButton button')

        // Wait for the usage bar and extract data
        const dataUsageSelector = '.dataUsageBar .medium'
        const dataUsageElement = await page.waitForSelector(dataUsageSelector)
        const dataUsageText = await dataUsageElement?.evaluate(
            (el) => el.textContent
        )

        logger.info(`Data usage text: ${dataUsageText}`)

        if (!dataUsageText) {
            throw new Error('Error: Data usage not found.')
        }

        const regex = new RegExp(/(\d{1,3}(?:,\d{2})?) (\w{2})/g)

        const matches: DataMatch[] = []

        let match: RegExpExecArray
        while ((match = regex.exec(dataUsageText)) !== null) {
            matches.push({
                value: match[1],
                unit: match[2] as DataUnit,
            })
        }

        logger.info(`Data usage: ${JSON.stringify(matches)}`)

        await browser.close()
    } catch (error) {
        logger.error('Error:', error)
    }
})()
