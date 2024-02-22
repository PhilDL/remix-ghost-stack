import {
  lruCacheAdapter,
  type Cache,
  type CacheEntry,
} from "@epic-web/cachified";
import { LRUCache } from "lru-cache";

let cache: Cache;

declare global {
  var __cache: Cache | undefined;
}

if (process.env.NODE_ENV === "production") {
  const lru = new LRUCache<string, CacheEntry<unknown>>({ max: 100000 });
  cache = lruCacheAdapter(lru);
} else {
  if (!global.__cache) {
    const lru = new LRUCache<string, CacheEntry<unknown>>({ max: 100000 });
    global.__cache = lruCacheAdapter(lru);
  }
  cache = global.__cache;
}

export { cache };
