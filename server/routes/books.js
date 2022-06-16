// Define here all the books API
import fetch from "node-fetch"

const OPEN_LIBRARY_URL = process.env.OPEN_LIBRARY_URL || "http://openlibrary.org"
const OPEN_LIBRARY_COVERS_URL = process.env.OPEN_LIBRARY_COVER_URL || "https://covers.openlibrary.org"
const OPEN_LIBRARY_BLANK_COVER_URL = process.env.OPEN_LIBRARY_BLANK_COVER_URL || "https://openlibrary.org/images/icons/avatar_book-sm.png"

const SMALL_COVER_SIZE = "S"
const MEDIUM_COVER_SIZE = "M"
const LARGE_COVER_SIZE = "L"

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
			.map(it => {
				const res = {
					id: it.cover_edition_key || it.edition_key?.[0] || it.key.replace("/works/",""),
					author: it.author_name || "Unknown author",
					cover: getCoverURL(it.cover_i, MEDIUM_COVER_SIZE),
					title: it.title,
					type: (it.cover_edition_key || it.edition_key?.[0])
						? "book"
						: "work"
				}

				return res
			})

		res.json({
			...results,
			num_found: results.num_found,
			page,
			books
		})
	} catch (error){
		res.status(500).json({type: "error", message: error.message})
	}
}

async function getBook(req, res) {
	const { params, query, service: db } = req

	const { id } = params
	const { type } = query

	const isBook = ! type || type === "book"

	try{
		const url = isBook
			? `${OPEN_LIBRARY_URL}/api/books?bibkeys=OLID:${id}&jscmd=details&format=json`
			: `${OPEN_LIBRARY_URL}/works/${id}.json`
		const response = await fetch(url)
		const data = await response.json()

		const result = {
			id,
			owned: db.data.books?.[id]?.owned || false,
			read:db.data.books?.[id]?.read || false,
			data: isBook
				? parseBookData(data, id)
				: parseWorkData(data, id)
		}


		res.json(result)
	} catch (error){
		res.status(500).json({type: "error", message: error.message})
	}
}

function parseBookData(book, id) {
	const { details, thumbnail_url } = book[`OLID:${id}`]

	const data = {
			...details,
			authors: details.authors ||  [{ name:"Unknown author" }],
			cover: thumbnail_url && {
				small: thumbnail_url,
				medium: thumbnail_url.replace("-S", "-M"),
				large: thumbnail_url.replace("-S", "-L"),
			},
			languages: details.languages?.[0].key.replace("/languages/","")
	}

	return data
}

function parseWorkData(work) {
	const data = {
		title: work.title,
		// subtitle: work.subtitle,
		cover: work.covers && {
			small: getCoverURL(work.covers?.[0], SMALL_COVER_SIZE),
			medium: getCoverURL(work.covers?.[0], MEDIUM_COVER_SIZE),
			large: getCoverURL(work.covers?.[0], LARGE_COVER_SIZE),
		},
	}

	return data
}

async function ownBook(req, res) {
	const { body, service: db } = req

	const { id, book, owned } = body

	if (! id || ! book) {
		res.sendStatus(500)
		return
	}

	const { books } = db.data

	switch (true) {
		case (id in books): // Set book as owned
			books[id].owned = owned
			break
		case (!(id in books) && owned): // Add owned book
			books[id] = {
				data: book,
				owned
			}
			break
	}

	await db.write()

	res.json(owned)
}

async function readBook(req, res) {
	const { body, service: db } = req

	const { id, book, read } = body

	if (! id || ! book) {
		res.sendStatus(500)
		return
	}

	const { books } = db.data

	switch (true) {
		case (id in books): // Set book as owned
			books[id].read = read
			break
		case (!(id in books) && read): // Add owned book
			books[id] = {
				data: book,
				read
			}
			break
	}

	await db.write()

	res.json(read)
}

function getCoverURL(coverID, size) {
	const coverSize = size
		? `-${size}`
		: ""

	return coverID
		? `${OPEN_LIBRARY_COVERS_URL}/b/id/${coverID}${coverSize}.jpg`
		: OPEN_LIBRARY_BLANK_COVER_URL
}

export {
	getBook,
	getBooks,
	getOwnedBooks,
	getReadBooks,
	ownBook,
	readBook,
}