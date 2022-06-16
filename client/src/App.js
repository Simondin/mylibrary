import "./App.css"

import React from "react"

import {
    Routes,
    Route,
} from "react-router-dom"
import { Grommet, Box } from "grommet"

import SearchBooks from "./components/SearchBooks"
import BookDetails from "./components/BookDetails"

const App = () => {
    return (
        <Grommet className="App" full>
            <Box fill>
                <Routes>
                    <Route
                        exact path="/"
                        element={<SearchBooks />}
                    />
                    <Route path="/book/:bookId" element={<BookDetails />} />
                </Routes>
            </Box>
        </Grommet>
    )
}

export default App
