import { useEffect, useState } from "react"
import useDebounce from "./useDebounce"
import useQuery from "./useQuery"

const REST = process.env.REACT_APP_REST_API || "http://localhost:8080/api"

function prepareURL(query, page, limit) {
    const data = {
        all: query,
        page,
        limit
    }
    const url = []
    for (const it in data ) {
        url.push(`${encodeURIComponent(it)}=${encodeURIComponent(data[it])}`)
    }

    return `${REST}/books?` + url.join('&')
}


/**
 * Custom hook to query the books
 * @param {*} query The searching parameter.
 * @param {*} page The page to visualize: the default value is 1.
 * @param {*} limit The number of books to visualize: the default value is 10.
 * @returns
 */
export default function useQueryBooks(query, page=1, limit=20) {
    const [books, setBooks] = useState()
    const [hasMore, setHasMore] = useState(false)
    const [booksFound, setBooksFound] = useState(0)
    const [url, setUrl] = useState("")

    const deboucedQuery = useDebounce(query, 500)
    const { data, loading, error } = useQuery(url)

    function resetState () {
        setBooks()
        setBooksFound(0)
        setHasMore(false)
        setUrl("")
    }

    useEffect(() => {
        if (loading || ! data) {
            return
        }

        setBooks((prevBooks) => {
            // To avoid double rendering with strict mode
            switch (true) {
                case ! data.books:
                case prevBooks?.length === data.books?.length && page === 0:
                    return prevBooks
                default:
                    return [
                        ...(page !== 1
                            ? prevBooks
                            : []),
                        ...data.books
                    ]
            }
        })
        setBooksFound(data.num_found || 0)
        setHasMore(data.books?.length > 0 || false)
    }, [data])

    useEffect(() => {
        if (! deboucedQuery) {
            resetState()
            return
        }

        const queryURL = prepareURL(deboucedQuery, page, limit)
        setUrl(queryURL)
    }, [deboucedQuery, page, limit])

    return {
        books,
        loading,
        error,
        hasMore,
        booksFound,
    }
}