import path from 'path'
import { Low, JSONFile } from 'lowdb'

// Use JSON file for storage
const relativePath = path.relative(process.cwd(), 'data/db.json')
const adapter = new JSONFile(relativePath)

const db = new Low(adapter)

const init = async () => {
    await db.read()

    const { data } = db

    if (! data || ! Object.keys(data).length) {
        db.data = {
            books: []
        }

        await db.write()
    }

    return db
}


export default await init()