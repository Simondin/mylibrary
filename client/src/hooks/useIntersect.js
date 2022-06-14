import { useEffect, useState } from 'react'

const useIntersect = () => {
    const [ element, setElement ] = useState()
    const [ entry, setEntry ] = useState()
    const [ isIntersecting, setIsIntersecting ] = useState(false)
    const [ options, setOptions ] = useState({})

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => setEntry(entry), options)

        if (observer.current) {
            observer.disconnect()
        }

        if (element) {
            observer.observe(element)
        }

        return () => {
            observer.disconnect()
        }

    }, [element])

    useEffect(() => {
        setIsIntersecting(entry?.isIntersecting)
    }, [entry])

    return { setElement, setOptions, isIntersecting }

}

export default useIntersect