import { Router } from 'express'
import {
    getBook,
    getBooks,
    getOwnedBooks,
    getReadBooks,
    ownBook,
    readBook,
} from './books.js'

const routes = Router()

routes.get('/book/:id', getBook)
routes.get('/books', getBooks)
routes.get('/books/owned', getOwnedBooks)
routes.get('/books/read', getReadBooks)

routes.post('/book/own', ownBook)
routes.post('/book/read', readBook)

export { routes }