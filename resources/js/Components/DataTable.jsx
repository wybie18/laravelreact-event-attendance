import { useState } from "react"
import { Link, usePage } from "@inertiajs/react"
import { FiSearch, FiChevronLeft, FiChevronRight, FiFilter, FiX, FiEdit, FiTrash } from "react-icons/fi";
import { debounce } from "lodash"

export default function DataTable({
    data,
    columns,
    pagination = null,
    onSearch = null,
    onFilter = null,
    filters = null,
    routePrefix = "",
    deleteRoute = null,
    editRoute = null,
    viewRoute = null,
    onDelete = null,
}) {
    const [searchTerm, setSearchTerm] = useState("")
    const [activeFilters, setActiveFilters] = useState({})
    const [showFilterMenu, setShowFilterMenu] = useState(false)

    // Debounced search function
    const debouncedSearch = debounce((value) => {
        if (onSearch) {
            onSearch(value)
        }
    }, 300)

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchTerm(value)
        debouncedSearch(value)
    }

    // Handle filter change
    const handleFilterChange = (key, value) => {
        const newFilters = { ...activeFilters, [key]: value }

        // If value is empty, remove the filter
        if (!value) {
            delete newFilters[key]
        }

        setActiveFilters(newFilters)

        if (onFilter) {
            onFilter(newFilters)
        }
    }

    // Clear all filters
    const clearFilters = () => {
        setActiveFilters({})
        if (onFilter) {
            onFilter({})
        }
    }

    // Clear a specific filter
    const clearFilter = (key) => {
        const newFilters = { ...activeFilters }
        delete newFilters[key]
        setActiveFilters(newFilters)

        if (onFilter) {
            onFilter(newFilters)
        }
    }

    return (
        <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4">
                <div className="relative w-64">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FiSearch className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                {filters && (
                    <div className="relative">
                        <button
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            <FiFilter className="mr-2 h-4 w-4" />
                            Filter
                        </button>

                        {showFilterMenu && (
                            <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                <div className="py-1">
                                    {filters.map((filter) => (
                                        <div key={filter.key} className="px-4 py-2">
                                            <label className="block text-sm font-medium text-gray-700">{filter.label}</label>
                                            {filter.type === "select" ? (
                                                <select
                                                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                                    value={activeFilters[filter.key] || ""}
                                                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                                >
                                                    <option value="">All</option>
                                                    {filter.options.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type={filter.type || "text"}
                                                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                                    value={activeFilters[filter.key] || ""}
                                                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                    <div className="border-t border-gray-100 px-4 py-2">
                                        <button
                                            onClick={clearFilters}
                                            className="w-full rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {routePrefix && (
                    <Link
                        href={route(`${routePrefix}.create`)}
                        className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Add New
                    </Link>
                )}
            </div>

            {/* Active filters display */}
            {Object.keys(activeFilters).length > 0 && (
                <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2">
                    <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                    {Object.entries(activeFilters).map(([key, value]) => {
                        const filterDef = filters.find((f) => f.key === key)
                        let displayValue = value

                        if (filterDef && filterDef.type === "select") {
                            const option = filterDef.options.find((o) => o.value === value)
                            if (option) displayValue = option.label
                        }

                        return (
                            <span
                                key={key}
                                className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800"
                            >
                                {filterDef ? filterDef.label : key}: {displayValue}
                                <button
                                    onClick={() => clearFilter(key)}
                                    className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-green-400 hover:bg-green-200 hover:text-green-500"
                                >
                                    <FiX className="h-3 w-3" />
                                </button>
                            </span>
                        )
                    })}
                    <button onClick={clearFilters} className="text-xs text-green-600 hover:text-green-800">
                        Clear All
                    </button>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                >
                                    {column.label}
                                </th>
                            ))}
                            {(editRoute || deleteRoute || viewRoute) && (
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                                >
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (editRoute || deleteRoute || viewRoute ? 1 : 0)}
                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                >
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <tr key={item.id || index} className="hover:bg-gray-50">
                                    {columns.map((column) => (
                                        <td key={column.key} className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {column.render ? column.render(item) : item[column.key]}
                                        </td>
                                    ))}
                                    {(editRoute || deleteRoute || viewRoute) && (
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                {viewRoute && (
                                                    <Link href={route(viewRoute, item.id)} className="text-green-600 hover:text-green-900">
                                                        View
                                                    </Link>
                                                )}
                                                {editRoute && (
                                                    <Link href={route(editRoute, item.id)} className="text-blue-600 hover:text-blue-900">
                                                        <FiEdit className="h-4 w-4" />
                                                    </Link>
                                                )}
                                                {deleteRoute && (
                                                    <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900">
                                                        <FiTrash className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{pagination.from}</span> to{" "}
                                <span className="font-medium">{pagination.to}</span> of{" "}
                                <span className="font-medium">{pagination.total}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                {pagination.meta.links.map((link, index) => {
                                    // Skip the "..." links
                                    if (link.label.includes("...")) {
                                        return (
                                            <span
                                                key={index}
                                                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700"
                                            >
                                                ...
                                            </span>
                                        )
                                    }

                                    // Previous link
                                    if (link.label === "&laquo; Previous") {
                                        return (
                                            <Link
                                                key={index}
                                                href={link.url || "#"}
                                                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-sm font-medium ${link.url ? "text-gray-500 hover:bg-gray-50" : "cursor-not-allowed text-gray-300"
                                                    }`}
                                                preserveScroll
                                            >
                                                <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                                            </Link>
                                        )
                                    }

                                    // Next link
                                    if (link.label === "Next &raquo;") {
                                        return (
                                            <Link
                                                key={index}
                                                href={link.url || "#"}
                                                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-sm font-medium ${link.url ? "text-gray-500 hover:bg-gray-50" : "cursor-not-allowed text-gray-300"
                                                    }`}
                                                preserveScroll
                                            >
                                                <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                                            </Link>
                                        )
                                    }

                                    // Number links
                                    return (
                                        <Link
                                            key={index}
                                            href={link.url || "#"}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${link.active ? "z-10 bg-green-50 text-green-600 focus:z-20" : "text-gray-500 hover:bg-gray-50"
                                                }`}
                                            preserveScroll
                                        >
                                            {link.label}
                                        </Link>
                                    )
                                })}
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

