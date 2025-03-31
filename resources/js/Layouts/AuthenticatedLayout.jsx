"use client"

import ApplicationLogo from "@/Components/ApplicationLogo"
import Dropdown from "@/Components/Dropdown"
import NavLink from "@/Components/NavLink"
import { Link, usePage } from "@inertiajs/react"
import { useState } from "react"
import { Toaster } from "react-hot-toast"
import {
    FiUsers,
    FiSettings,
    FiCalendar,
    FiClipboard,
    FiFileText,
    FiBarChart,
    FiClock,
    FiMenu,
    FiX,
    FiChevronDown,
    FiUser,
} from "react-icons/fi"

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="border-b border-gray-200 bg-white w-full fixed z-50 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-green-600" />
                                </Link>
                            </div>

                            <div className="ml-4 flex items-center sm:hidden">
                                <button
                                    onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-green-600 focus:bg-gray-100 focus:text-green-600 focus:outline-none"
                                    aria-expanded={showingNavigationDropdown}
                                    aria-controls="mobile-menu"
                                >
                                    <span className="sr-only">Open main menu</span>
                                    {showingNavigationDropdown ? (
                                        <FiX className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <FiMenu className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="ms-6 flex items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-600 transition duration-150 ease-in-out hover:text-green-600 focus:outline-none"
                                            >
                                                <FiUser className="mr-2 h-4 w-4" />
                                                {user.name}
                                                <FiChevronDown className="ml-2 h-4 w-4" />
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route("profile.edit")}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route("logout")} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <aside
                id="sidebar"
                className={`fixed top-16 z-40 w-64 h-screen transition-transform duration-300 ease-in-out ${showingNavigationDropdown ? "translate-x-0" : "-translate-x-full"
                    } sm:translate-x-0`}
            >
                <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r border-gray-200 shadow-sm">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <NavLink
                                href={route("dashboard")}
                                active={route().current("dashboard")}
                            >
                                <FiBarChart className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-green-600" />
                                <span className="ms-3">Dashboard</span>
                            </NavLink>
                        </li>

                        <li className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink mx-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Management
                            </span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </li>

                        <li>
                            <NavLink
                                href={route("students.index")}
                                active={route().current("students.*")}
                            >
                                <FiUsers className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-green-600" />
                                <span className="ms-3">Students</span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                href={route("semesters.index")}
                                active={route().current("semesters.*")}
                            >
                                <FiClipboard className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-green-600" />
                                <span className="ms-3">Semesters</span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                href={route("events.index")}
                                active={route().current("events.*")}
                            >
                                <FiCalendar className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-green-600" />
                                <span className="ms-3">Events</span>
                            </NavLink>
                        </li>

                        <li className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink mx-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Records
                            </span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </li>

                        <li>
                            <NavLink
                                href={route("attendances.index")}
                                active={route().current("attendances.*")}
                            >
                                <FiClock className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-green-600" />
                                <span className="ms-3">Attendances</span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                href={route("records")}
                                active={route().current("records")}
                            >
                                <FiFileText className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-green-600" />
                                <span className="ms-3">Records</span>
                            </NavLink>
                        </li>

                        <li className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink mx-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Settings
                            </span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </li>

                        <li>
                            <NavLink
                                href={route("profile.edit")}
                                active={route().current("profile.edit")}
                            >
                                <FiSettings className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-green-600" />
                                <span className="ms-3">My Profile</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </aside>

            <Toaster
                position="top-right"
                toastOptions={{
                    className: "",
                    style: {
                        borderRadius: "8px",
                        background: "#fff",
                        color: "#333",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        padding: "16px",
                    },
                    success: {
                        style: {
                            borderLeft: "4px solid #10b981",
                        },
                    },
                    error: {
                        style: {
                            borderLeft: "4px solid #ef4444",
                        },
                    },
                }}
            />

            <main className="sm:pl-64 pt-16 min-h-screen">{children}</main>
        </div>
    )
}

