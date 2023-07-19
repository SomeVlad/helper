import { DataMatch, DataUnit } from '../types'

export function getDataValueMb(dataMatch: DataMatch) {
    return dataMatch.unit === DataUnit.MB
        ? dataMatch.value
        : dataMatch.value * 1000
}
