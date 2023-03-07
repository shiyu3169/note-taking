import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export const useLocalStorage = <T>(
  key: string,
  initialValue: T | (() => T),
) => {
  const [value, setValue] = useState<T>(() => {
    const jsonValue = localStorage.getItem(key)
    return jsonValue
      ? JSON.parse(jsonValue)
      : typeof initialValue === 'function'
      ? (initialValue as () => T)()
      : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return value
}
