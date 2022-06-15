import './SearchBooks.css'

import React, { useState, useEffect } from 'react'
import useQueryBooks from '../hooks/useQueryBooks'
import useIntersect from '../hooks/useIntersect'

export default function SearchBooks() {
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)

    const {
        books,
        hasMore,
        loading,
        error,
        booksFound,
    } = useQueryBooks(query, page, limit)

    const { setElement, setOptions, isIntersecting } = useIntersect()

    function booksMap(book, index) {
        const {
            title,
            author,
            cover,
            id,
        } = book


        const isLast = index === books.length -1
        return (
            <div className='BookPreview' key={id} ref ={ r => isLast && setElement(r) }>
                <div className='CoverContainer'>
                    <img className='Cover' src={cover}></img>
                </div>
                <div className='DetailsContainer'>
                    <a href={`/book/${id}`}>
                        <span>{title}</span>
                    </a>
                    <span>{`by: ${author}`}</span>
                </div>
            </div>
        )
    }

    function onSearch(payload) {
        setQuery(payload.target.value)
        // Reset to the first page when search
        setPage(1)
    }

    useEffect( () => {
        if (!hasMore || loading || ! isIntersecting) {
            return
        }

        setPage(prevPage => prevPage + 1)
    }, [isIntersecting])

    return (
        <div className='SearchBooks'>
            <input type='text' onChange={onSearch} value={query}></input>
            <div className='Header'>
                <span>{`Books (${books.length} / ${booksFound})`}</span>
            </div>
            <div className='SearchBooksContainer'>
                { error && <span>{error.message}</span> }
                { books.map(booksMap) }
                { loading && <span>Loading...</span> }
            </div>
        </div>
    )
}
