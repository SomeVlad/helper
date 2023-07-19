export function daysLeftInCurrentMonth() {
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const currentDay = today.getDate()

    return lastDayOfMonth - currentDay
}
