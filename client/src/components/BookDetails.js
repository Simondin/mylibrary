import './BookDetails.css'

import React, { useState, useEffect } from 'react'
import useQuery from '../hooks/useQuery'

import { useParams, useNavigate } from 'react-router-dom'

export default function BookDetails() {
    const [isBookOwned, setIsBookOwned ] = useState(false)
    const [isBookRead, setIsBookRead ] = useState(false)
    const { bookId } = useParams()
    const navigate = useNavigate()

    const { data: book, loading: bookLoading, error: bookError } = useQuery(`http://localhost:3000/api/book/${bookId}`)

    const queryOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    }

    const { data: isOwned, loading: ownLoading, error: ownError, refetch: ownRefetch } = useQuery(
        'http://localhost:3000/api/book/own/',
        {
            ...queryOptions,
            body: JSON.stringify({
                id: bookId,
                book: book?.data,
                owned: ! isBookOwned,
            })
        },
        true
    )

    const { data: isRead, loading: readLoading, error: readError, refetch: readRefetch } = useQuery(
        'http://localhost:3000/api/book/read/',
        {
            ...queryOptions,
            body: JSON.stringify({
                id: bookId,
                book: book?.data,
                read: ! isBookRead,
            })
        },
        true
    )

    useEffect(() => {
        if (! bookId) {
            navigate('/');
        }
    }, [bookId])


    useEffect(() => {
        if (! book) {
            return
        }

        setIsBookOwned(isOwned === void undefined
            ? book.owned
            : isOwned
        )

        setIsBookRead(isRead === void undefined
            ? book.read
            : isRead
        )
    }, [book, isOwned, isRead])


    function bookDetails( book ) {
        const { data } = book
        return (
            <div className='BookDetailsContainer'>
                <div className='BookDetailsDataContainer'>
                    <img
                        className='BookDetailsCover'
                        src={data.cover?.medium || 'https://openlibrary.org/images/icons/avatar_book.png'}
                    />
                    <div className='BookDetailsData'>
                        <span>{data.title}</span>
                        <span>{data.edition_name && data.edition_name}</span>
                        <span>{data.by_statement?.replace(/(\s;)/g,',') || `by ${data.authors?.[0].name}` || ''}</span>
                        <span>{data.number_of_pages && `Pages: ${data.number_of_pages}`}</span>
                        <span>{data.publish_date && `Publish Date: ${data.publish_date}`}</span>
                        <span>{data.languages && `Language: ${data.languages}`}</span>
                    </div>
                </div>
                <div className='BookdDetailsActions'>
                    <button
                        onClick={ownRefetch}
                        disabled={ownLoading}
                    >
                        {
                            isBookOwned
                                ? 'Remove from shelf'
                                : 'Add on shelf'
                        }
                    </button>
                    <button
                        onClick={readRefetch}
                        disabled={readLoading}
                    >
                        {
                            isBookRead
                                ? 'Mark as not read'
                                : 'Mark as read'
                        }
                    </button>
                </div>
            </div>
        )
    }

    return (
        <>
            {
                (bookLoading || ownLoading || readLoading) && 'Loading...'
            }
            {
                (bookError || ownError || readError) && <span>{bookError}</span>
            }
            {
                book && bookDetails(book)
            }
        </>
    )
}