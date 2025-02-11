import { useCallback, useState } from "react";
import store from "store2";

export const useLocalStorage = <T>(key: string, initialValue?: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      return store.get(key) ?? initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prevValue: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        store.set(key, valueToStore);
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    },
    [key, storedValue],
  );

  const removeValue = useCallback(() => {
    try {
      store.remove(key);
      setStoredValue(initialValue as T);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  }, [key, initialValue]);

  return { value: storedValue, setValue, removeValue };
};
