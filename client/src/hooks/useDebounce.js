import { useEffect, useState } from "react"

/**
 * Custom hook to handle value that have to be debounced.
 * @param {*} value The value to debounce
 * @param {*} delay The delay value: the default value is 300ms.
 * @returns debouncedValue
 */
export default function useDebounce(value, delay=300) {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		// Cancel the timeout if value changes (also on delay change or unmount)
		// This is how we prevent debounced value from updating if value is changed
		// within the delay period. Timeout gets cleared and restarted.
		return () => {
			clearTimeout(handler)
		}
	}, [value, delay])

	return debouncedValue
}