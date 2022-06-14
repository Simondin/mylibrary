// Define here all the books API
import fetch from 'node-fetch'

const OPEN_LIBRARY_URL = process.env.OPEN_LIBRARY_URL || 'http://openlibrary.org'
const OPEN_LIBRARY_COVERS_URL = process.env.OPEN_LIBRARY_COVER_URL || 'https://covers.openlibrary.org'
const OPEN_LIBRARY_BLANK_COVER_URL = process.env.OPEN_LIBRARY_BLANK_COVER_URL || 'https://openlibrary.org/images/icons/avatar_book-sm.png'

const DETAILS_COVER_SIZE = 'L'
const LIST_COVER_SIZE = 'M'

/**
 * Returns all the owned books.
 * @param {*} req
 * @param {*} res
 */
async function getOwnedBooks(req, res) {
	const { service: db } = req

	const owned = db.data.books.filter(it => it.owned)

	res.send(owned)
}

/**
 * Returns all the read books.
 * @param {*} req
 * @param {*} res
 */
async function getReadBooks(req, res) {
	const { service: db } = req

	const read = db.data.books.filter(it => it.read)

	res.send(read)
}

/**
 * Returns all the books that match the query parameters.
 * @param {*} req
 * @param {*} req.query.author: Search book by author.
 * @param {*} req.query.title: Search book by title.
 * @param {*} req.query.all: Search book by generic string.
 * @param {*} res
 */
async function getBooks(req, res) {
	const { query } = req

	const { author, title, all, limit, page } = query

	const parameter = {
		...(author && { author }),
		...(title && { title }),
		...(! (query && title) && { q: all }),
		...(limit && { limit }),
		...(page && { page }),
	}

	const queryParams = new URLSearchParams(parameter)

	try{
		const url = `${OPEN_LIBRARY_URL}/search.json?${queryParams.toString()}`
		const response = await fetch(url)
		const results = await response.json()
		// Filter out all books without cover id and ISBN array
		const books = results.docs
			// .filter(it => it.cover_i && it.isbn && it.author_name)
			.map(it => ({
				id: it.key.replace('/works/',''),
				author: it.author_name || 'Unknown author',
				cover: getCoverURL(it.cover_i, LIST_COVER_SIZE),
				title: it.title,
			}))

		res.json({
			...results,
			num_found: results.num_found,
			books
		})
	} catch (error){
		res.status(500).json({type: 'error', message: error.message})
	}
}

async function getBook(req, res) {
	const { params } = req

	const { id } = params

	try{
		const url = `${OPEN_LIBRARY_URL}/works/${id}.json`
		const response = await fetch(url)
		const book = await response.json()
		res.send({
			...book,
			covers: book.covers.map(it => getCoverURL(it, DETAILS_COVER_SIZE))
		})
	} catch (error){
		res.status(500).json({type: 'error', message: error.message})
	}
}

function getCoverURL(coverID, size) {
	return coverID
		? `${OPEN_LIBRARY_COVERS_URL}/b/id/${coverID}-${size}.jpg`
		: OPEN_LIBRARY_BLANK_COVER_URL
}

export {
	getBook,
	getBooks,
	getOwnedBooks,
	getReadBooks,
}