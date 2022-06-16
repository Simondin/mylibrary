import "./SearchBooks.css"

import React, { useState, useEffect } from "react"
import useQueryBooks from "../hooks/useQueryBooks"
import useIntersect from "../hooks/useIntersect"

import {
    Anchor,
    Box,
    Nav,
    Spinner,
    Text,
    TextInput,
} from "grommet"
import { Search as SearchIcon } from "grommet-icons"

export default function SearchBooks() {
    const [query, setQuery] = useState("")
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
            type,
        } = book


        const isLast = index === books.length -1
        return (
            <div className="BookPreview" key={id} ref ={ r => isLast && setElement(r) }>
                <div className="CoverContainer">
                    <img className="Cover" src={cover}></img>
                </div>
                <div className="DetailsContainer">
                    <Anchor href={`/book/${id}${type === "work" ? "?type=work" : ""}`} label={title} size="medium"/>
                    <Text size="medium">{`by: ${author}`}</Text>
                </div>
            </div>
        )
    }

    useEffect( () => {
        if (!hasMore || loading || ! isIntersecting) {
            return
        }

        setPage(prevPage => prevPage + 1)
    }, [isIntersecting])

    return (
        <>
            <Nav
                direction="row"
                background="light-3"
                pad="small"
                justify="between"
                margin={{bottom: "small"}}
                align="center"
            >
                <Box direction="row" width="xlarge" gap="small">
                    <TextInput
                        icon={<SearchIcon />}
                        placeholder="Search a book by title, author or ISBN"
                        value={query}
                        onChange={event => {
                            setQuery(event.target.value)
                            setPage(1)
                        }}
                    />

                </Box>
                {
                    loading && <Spinner size="small"/>
                }
            </Nav>
            <Box
                direction="column"
                margin="small"
            >
                <Box>
                    { error && <span>{error.message}</span> }
                    { books && books.length > 0 && (
                            <Box
                                border={{
                                    side: "between",
                                    color: "light-4"
                                }}
                                gap="small"
                                fill
                            >
                                <Text size="small">{`${books.length} books of ${booksFound} found`}</Text>
                                <Box
                                    overflow="scroll"
                                    fill
                                >
                                    { books.map(booksMap)}
                                </Box>
                            </Box>
                        )
                    }
                    {
                        books && books.length === 0 && (
                            <Box align="center">
                                <Text>No results found. Try to change the search parameter</Text>
                            </Box>
                        )
                    }
                </Box>
            </Box>
        </>

    )
}
