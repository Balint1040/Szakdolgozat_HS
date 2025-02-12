'use client'

import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"

export default function SearchButton() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const searchRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setResults([])
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [searchRef])

    const handleFocus = async () => {
        if (query.length > 3) {
            try {
                const res = await fetch(`/api/search?kereses=${query}`)
                const data = await res.json()
                setResults(data)
            } catch (e) {
                console.error(e)
            }
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.length > 0) {
            router.push(`/termekek/kereses?=${query}`)
        }
    }

    return (
        <div ref={searchRef}>
            <form className="d-flex navbarSearch position-relative" role="search" onSubmit={handleSubmit}>
                <input
                    
                    className="form-control"
                    type="search"
                    placeholder="Keresés"
                    aria-label="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={handleFocus}
                />
                <FontAwesomeIcon className="navbarSearchIcon" icon={faMagnifyingGlass as IconProp} />
            </form>
            <div className="search-res-container">
                {results.slice(0, 4).map((result: any) => (
                    <div key={result.id} className="search-res-item">
                        <Link legacyBehavior href={`/termekek/${result.id}`}>
                            <a className="search-res-link">
                                <img src={result.url} className="search-res-img" alt={result.name} /> {result.name}
                            </a>
                        </Link>
                    </div>
                ))}
                {results.length > 4 && (
                    <div>
                        <Link legacyBehavior href={`/termekek/kereses?=${query}`}>
                            <a>További találatok</a>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}