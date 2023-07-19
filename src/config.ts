import 'dotenv/config'

const ALLOWED_USERS_LIST = process.env.ALLOWED_USERS.split(' ').map(Number)
const { TELEGRAM_BOT_TOKEN, PASSWORD, LINK, USERNAME } = process.env

export { ALLOWED_USERS_LIST, LINK, USERNAME, PASSWORD, TELEGRAM_BOT_TOKEN }
