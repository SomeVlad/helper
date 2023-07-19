import { Context } from 'telegraf'

export enum DataUnit {
    GB = 'GB',
    MB = 'MB',
}

export type DataMatch = {
    value: number
    unit: DataUnit
}

export interface MyContext extends Context {
    userId: number
}

export type CacheEntry<T> = {
    value: T
    expiryTime: number
}

export enum Triggers {
    GET_DATA = 'getData',
}
