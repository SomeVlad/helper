import { logger } from './logger'
import { CacheEntry } from '../types'

export function withCache<T>(
    func: (...args: unknown[]) => T,
    cacheDurationMs: number
): (...args: unknown[]) => T {
    const cache: Map<string, CacheEntry<T>> = new Map()

    return function (...args: unknown[]): T {
        const cacheKey = JSON.stringify(args)

        if (cache.has(cacheKey)) {
            const cachedEntry = cache.get(cacheKey)

            // Check if the cached entry has expired
            if (cachedEntry && Date.now() < cachedEntry.expiryTime) {
                logger.info('Cache hit. Returning cached result.')
                return cachedEntry.value
            } else {
                logger.info('Cache expired')
                cache.delete(cacheKey) // Remove the expired entry from the cache
            }
        }

        const result = func(...args)

        // Store the result in the cache with the expiry time
        logger.info('Cache miss. Populating cache.')
        cache.set(cacheKey, {
            value: result,
            expiryTime: Date.now() + cacheDurationMs,
        })

        return result
    }
}
