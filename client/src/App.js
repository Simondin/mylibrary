import './App.css'

import React from 'react'

import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom'

import SearchBooks from './components/SearchBooks'
import BookDetails from './components/BookDetails'

const App = () => {
    return (
        <div className='App'>
            <Routes>
                <Route
                    exact path="/"
                    element={<SearchBooks />}
                />
                <Route path="/book/:bookId" element={<BookDetails />} />
            </Routes>
        </div>
    )
}

export default App
