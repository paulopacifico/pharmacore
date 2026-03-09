import { useCallback } from "react";

export function useLocalStorage<T = any>(key: string, ttlMinutes?: number) {
    type Payload = { value: T; timestamp: number };

    const isExpired = (payload: Payload) => {
        if (ttlMinutes == null) return false;
        const age = Date.now() - payload.timestamp;
        return age > ttlMinutes * 60 * 1000;
    };

    const getLocalStorageValue = useCallback((): T | null => {
        try {
            if (typeof window === "undefined") {
                return null;
            }

            const item = window.localStorage.getItem(key);
            if (!item) return null;

            const parsed: Payload = JSON.parse(item);
            if (ttlMinutes && isExpired(parsed)) {
                window.localStorage.removeItem(key);
                return null;
            }

            return parsed.value;
        } catch (error) {
            console.error(error);
            return null;
        }
    }, [key, ttlMinutes]);

    const setLocalStorageValue = useCallback(
        (value: T) => {
            try {
                if (typeof window === "undefined") return;
                const payload: Payload = {
                    value,
                    timestamp: Date.now(),
                };
                window.localStorage.setItem(key, JSON.stringify(payload));
            } catch (error) {
                console.error(error);
            }
        },
        [key],
    );

    return { getLocalStorageValue, setLocalStorageValue };
}
