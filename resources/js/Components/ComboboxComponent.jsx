import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/Components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover"
import { Input } from "@/Components/ui/input"
import { useDebounce } from '@/Hooks/useDebounce'
import { Badge } from "@/Components/ui/badge"

const FetchingCombobox = ({
                              apiUrl,
                              placeholder,
                              onSelect,
                              multiple = false,
                              renderItem = null,
                              renderSelected = null
                          }) => {
    const [open, setOpen] = useState(false)
    const [selectedValues, setSelectedValues] = useState([])
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearchTerm = useDebounce(searchTerm, 300)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const observer = useRef()
    const listRef = useRef()

    const lastItemRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    const fetchItems = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`${apiUrl}?search=${debouncedSearchTerm}&page=${page}`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            if (data.error) {
                throw new Error(data.error)
            }
            const newItems = Array.isArray(data.data) ? data.data : (data.data?.data || [])
            setItems(prevItems => page === 1 ? newItems : [...prevItems, ...newItems])
            setHasMore(data.next_page_url !== null)
        } catch (error) {
            console.error('Erreur lors du fetch des données:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }, [apiUrl, debouncedSearchTerm, page])

    useEffect(() => {
        setItems([])
        setPage(1)
        setHasMore(true)
        setError(null)
    }, [debouncedSearchTerm])

    useEffect(() => {
        fetchItems()
    }, [fetchItems, debouncedSearchTerm, page])

    const handleSearch = (term) => {
        setSearchTerm(term)
        setPage(1)
    }

    const handleSelect = (item) => {
        if (multiple) {
            setSelectedValues(prev => {
                const newValues = prev.some(i => i.value === item.value)
                    ? prev.filter(i => i.value !== item.value)
                    : [...prev, item]
                onSelect(newValues)
                return newValues
            })
        } else {
            setSelectedValues([item])
            setOpen(false)
            onSelect(item)
        }
    }

    const removeItem = (item) => {
        setSelectedValues(prev => {
            const newValues = prev.filter(i => i.value !== item.value)
            onSelect(multiple ? newValues : null)
            return newValues
        })
    }

    const renderSelectedItem = (item) => {
        if (renderSelected) {
            return renderSelected(item, () => removeItem(item))
        }
        return (
            <Badge key={item.value} variant="secondary" className="mr-1">
                {item.label}
                {multiple && (
                    <button
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                removeItem(item)
                            }
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            removeItem(item)
                        }}
                    >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                )}
            </Badge>
        )
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {selectedValues.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {selectedValues.map(renderSelectedItem)}
                        </div>
                    ) : (
                        placeholder
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <div className="p-2">
                    <Input
                        placeholder="Rechercher..."
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                <ul ref={listRef} className="max-h-[300px] overflow-auto">
                    {error ? (
                        <li className="p-2 text-red-500">Erreur: {error}</li>
                    ) : items.length === 0 && !loading ? (
                        <li className="p-2">Aucun résultat trouvé.</li>
                    ) : (
                        items.map((item, index) => (
                            <li
                                key={item.value}
                                ref={index === items.length - 1 ? lastItemRef : null}
                                className={cn(
                                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                                    "hover:bg-accent hover:text-accent-foreground",
                                    selectedValues.some(i => i.value === item.value) && "bg-accent text-accent-foreground"
                                )}
                                onClick={() => handleSelect(item)}
                            >
                                {renderItem ? (
                                    renderItem(item, selectedValues.some(i => i.value === item.value))
                                ) : (
                                    <>
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedValues.some(i => i.value === item.value) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {item.label}
                                    </>
                                )}
                            </li>
                        ))
                    )}
                    {loading && <li className="p-2">Chargement...</li>}
                </ul>
            </PopoverContent>
        </Popover>
    )
}

export default FetchingCombobox
