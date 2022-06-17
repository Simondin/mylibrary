import "./BookDetails.css"

import React, { useState, useEffect } from "react"
import useQuery from "../hooks/useQuery"

import {
    useParams,
    useSearchParams,
    useNavigate,
} from "react-router-dom"

import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    Footer,
    Image,
    Nav,
    Spinner,
    Text,
} from "grommet"

import {
    Add as AddIcon,
    Book as BookIcon,
    Erase as EraseIcon,
    Catalog as CatalogIcon,
    FormPreviousLink as BackIcon,
} from "grommet-icons"

const REST = process.env.REACT_APP_REST_API || "http://localhost:8000/api"

export default function BookDetails() {
    const [isBookOwned, setIsBookOwned ] = useState(false)
    const [isBookRead, setIsBookRead ] = useState(false)
    const { bookId } = useParams()
    const [searchParams] = useSearchParams()

    const type = searchParams.get("type")
    const navigate = useNavigate()

    const typeParam = type ? `?type=${type}` : ""
    const { data: book, loading: bookLoading, error: bookError } = useQuery(`${REST}/book/${bookId}${typeParam}`)

    const queryOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"}
    }

    const { data: isOwned, loading: ownLoading, error: ownError, refetch: ownRefetch } = useQuery(
        `${REST}/book/own/`,
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
        `${REST}/book/read/`,
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
            navigate("/");
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

        const authorValue = data.by_statement
            ? data.by_statement.replace(/(\s;)/g,",")
            : (data.authors && data.authors.length)
                ? `by ${data.authors[0].name}`
                : ""


        return (
            <Box
                fill
                align="center"
                margin={{top: "medium"}}
            >
                <Card
                    width="medium"
                    background="light-1"
                    direction="column"
                    align="center"

                >
                    <CardBody
                        pad="medium"
                        gap="small"
                    >
                        <Box align="center">
                            <Text>{data.title}</Text>
                            {data.subtitle ? <Text size="small">{data.subtitle}</Text>:""}
                            <Text>{authorValue}</Text>
                            {data.edition_name && <Text size="small">{data.edition_name}</Text>}
                        </Box>
                        <Box
                            direction="row"
                            gap="small"
                        >
                            <Image
                                fallback="https://openlibrary.org/images/icons/avatar_book.png"
                                fit="contain"
                                src={data.cover?.medium || "https://openlibrary.org/images/icons/avatar_book.png"}
                            />
                            <Box>
                                <Text size="small">{data.number_of_pages && `Pages: ${data.number_of_pages}`}</Text>
                                <Text size="small">{data.publish_date && `Publish Date: ${data.publish_date}`}</Text>
                                <Text size="small">{data.languages && `Language: ${data.languages}`}</Text>
                            </Box>
                        </Box>
                    </CardBody>
                    <CardFooter pad={{vertical: "small"}}>
                    <Button
                        icon={isBookOwned ? <EraseIcon /> : <AddIcon />}
                        hoverIndicator
                        color="neutral-1"
                        primary={isBookOwned}
                        onClick={ownRefetch}
                        disabled={ownLoading}
                        label={
                            isBookOwned
                                ? "Remove"
                                : "Add"
                        }
                    />
                    <Button
                        icon={<BookIcon />}
                        color="neutral-4"
                        primary={isBookRead}
                        onClick={readRefetch}
                        disabled={ownLoading}
                        label={
                            isBookRead
                                ? "No read"
                                : "Read"
                        }
                    />

                    </CardFooter>
                </Card>
            </Box>
        )
    }

    return (
        <>
            <Nav
                direction="row"
                background="light-3"
                pad="xxsmall"
                align="center"
                justify="between"
            >
                <Box round="full" overflow="hidden">
                    <Button hoverIndicator icon={<BackIcon />} onClick={() => navigate("/")}/>
                </Box>
                {
                    (bookLoading || ownLoading || readLoading) && <Spinner size="small" />
                }
            </Nav>
            {
                book && bookDetails(book)
            }
            {
                (bookError || ownError || readError) &&
                <Footer
                    background="light-3"
                    pad="small"
                    align="center"
                >
                    <Text>{bookError || ownError || readError}</Text>
                </Footer>
            }
        </>
    )
}