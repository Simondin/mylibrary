import { useEffect, useState, useCallback } from "react"

/**
 * Custom hook to perfom queries
 * @param {*} api The callback used to fetch data.
 * @returns
 */
export default function useQuery(url, options, manual=false) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(void undefined)
    const [data, setData] = useState()

    const callAPI = useCallback(() => {
        if (! url) {
            return
        }

        setLoading(true)
        setError(void undefined)

        fetch(url, options)
            .then(r => r.json())
            .then(d => setData(d))
            .catch(e => setError(e))
            .finally(() => setLoading(false))
    }, [url, options])

    useEffect(() => {
        if (! manual) {
            callAPI()
        }

    }, [callAPI])

    return {
        data,
        loading,
        error,
        refetch: callAPI,
    }
}