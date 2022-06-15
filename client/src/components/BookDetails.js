import './BookDetails.css'

import React, { useState, useEffect, useCallback } from 'react'
import useQuery from '../hooks/useQuery'

import { useParams, useNavigate } from 'react-router-dom'

export default function BookDetails() {
    const { bookId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (! bookId) {
            navigate(-1);
        }
    }, [bookId])


    const { data, loading, error } = useQuery(`http://localhost:3000/api/book/${bookId}`)

    function bookDetails( book ) {
        return (
            <div className='BookDetailsContainer'>
                <img
                    className='BookDetailsCover'
                    src={book.cover?.medium || 'https://openlibrary.org/images/icons/avatar_book.png'}
                />
                <div className='BookDetailsDataContainer'>
                    <span>{book.title}</span>
                    <span>{book.edition_name && book.edition_name}</span>
                    <span>{book.by_statement?.replace(/(\s;)/g,',') || `by ${book.authors?.[0].name}` || ''}</span>
                    <span>{book.number_of_pages && `Pages: ${book.number_of_pages}`}</span>
                    <span>{book.publish_date && `Publish Date: ${book.publish_date}`}</span>
                    <span>{book.languages && `Language: ${book.languages}`}</span>
                </div>
            </div>
        )

    }

    return (
        <>
            {loading && 'Loading...'}
            {error && <span>{error}</span>}
            {data && bookDetails(data)}
        </>
    )


}