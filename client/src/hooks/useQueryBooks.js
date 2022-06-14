import { useEffect, useState } from 'react'
import useDebounce from './useDebounce'

/**
 * Custom hook to query the books
 * @param {*} query The searching parameter.
 * @param {*} page The page to visualize: the default value is 1.
 * @param {*} limit The number of books to visualize: the default value is 10.
 * @returns
 */
export default function useQueryBooks(query, page=1, limit=20) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(void undefined)
    const [books, setBooks] = useState([])
    const [hasMore, setHasMore] = useState(false)
    const [booksFound, setBooksFound] = useState(0)

    const deboucedQuery = useDebounce(query, 500)

    function resetState () {
        setBooks([])
        setLoading(false)
        setBooksFound(0)
        setHasMore(false)
        setError(void undefined)
    }

    useEffect(() => {
        async function getBooks(query, page, limit) {
            if (! query) {
                return {}
            }

            const data = {
                title: query,
                page,
                limit
            }
            const url = new URL("http://localhost:3000/api/books")
            for (const it in data ) {
                url.searchParams.append(it, data[it])
            }
            const result = await fetch(url)

            return result.json()
        }

        setLoading(true)
        setError(void undefined)
        async function fetchBooks () {
            if (! deboucedQuery) {
                resetState()
                return
            }

            const data = await getBooks(query, page, limit)
            setBooks((prevBooks) => {
                // To avoid double rendering with strict mode
                switch (true) {
                    case ! data.books:
                    case prevBooks.length === data.books.length && page === 0:
                        return prevBooks
                    default:
                        return [
                            ...prevBooks,
                            ...data.books,
                        ]
                }
            })
            setBooksFound(data.num_found || 0)
            setHasMore(data.books?.length > 0 || false)
        }

        fetchBooks()
            .catch(e => setError(e))
            .finally(() => setLoading(false))
    }, [deboucedQuery, page])

    return {
        books,
        loading,
        error,
        hasMore,
        booksFound,
    }
}