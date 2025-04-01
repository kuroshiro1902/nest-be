export type XOR<T, U> = (T & Partial<Record<Exclude<keyof U, keyof T>, never>>) | (U & Partial<Record<Exclude<keyof T, keyof U>, never>>);
