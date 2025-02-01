'use client'

import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

export default function SearchButton() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])


    useEffect(() => {
        if (query.length > 3) {
            const fetchResults = async () => {
                try {
                    const res = await fetch(`/api/search?kereses=${query}`)
                    const data = await res.json()
                    setResults(data)
                } catch (e) {
                    console.error(e)
                }
            }
            fetchResults()
        } else {
            setResults([])
        }
    }, [query])

    return (
        <div>
            <form className="d-flex navbarSearch position-relative" role="search">
                <input
                    className="form-control"
                    type="search"
                    placeholder="Keresés"
                    aria-label="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <FontAwesomeIcon className="navbarSearchIcon" icon={faMagnifyingGlass as IconProp} />
            </form>
            <div className="search-res-container">
                {results.slice(0, 4).map((result: any) => (
                    <div key={result.id} className="search-res">
                        <img src={result.url} className="search-res-img" /> {result.name}
                    </div>
                ))}
                {results.length > 4 && (
                    <div>
                        <a href="#">További találatok</a>
                    </div>
                )}
            </div>
        </div>
    )
}