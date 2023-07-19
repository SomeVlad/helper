import { splitBar } from 'string-progressbar'
import { DataMatch, DataUnit } from '../types'
import { getDataValueMb } from './get-data-value-mb'
import { daysLeftInCurrentMonth } from './days-left-in-current-month'

export function getTextResponse(remainder: DataMatch, total: DataMatch) {
    const totalValueMb = getDataValueMb(total)
    const remainderValueMb = getDataValueMb(remainder)

    const split = splitBar(totalValueMb, remainderValueMb, 24)
    return `${split[0]} 
Израсходовано ${remainder.value} ${remainder.unit} из ${total.value} ${
        total.unit
    } (${parseInt(split[1])}%).
Осталось ${(totalValueMb - remainderValueMb) / 1000} ${
        DataUnit.GB
    } на ${daysLeftInCurrentMonth()} дней.`
}
