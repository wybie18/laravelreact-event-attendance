import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import {
    FiUsers,
    FiSettings,
    FiCalendar,
    FiClipboard,
    FiFileText,
    FiBarChart,
    FiClock,
} from "react-icons/fi"

export default function AdminLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white w-full fixed z-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>


                            <div className="ml-2 flex items-center sm:hidden">
                                <button
                                    onClick={() =>
                                        setShowingNavigationDropdown(
                                            (previousState) => !previousState,
                                        )
                                    }
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            className={
                                                !showingNavigationDropdown
                                                    ? 'inline-flex'
                                                    : 'hidden'
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={
                                                showingNavigationDropdown
                                                    ? 'inline-flex'
                                                    : 'hidden'
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
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
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <aside className={(showingNavigationDropdown ? 'translate-x-0' : '-translate-x-full') + " fixed top-16 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"}>
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-100 mt-5">
                    <ul className="space-y-2 font-bold">
                        <li>
                            <NavLink
                                href={route('dashboard')}
                                active={route().current('dashboard')}
                            >
                                <FiBarChart className='text-2xl' />
                                Dashboard
                            </NavLink>
                        </li>
                        <li className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-400"></div>
                            <span className="flex-shrink mx-4 text-gray-400">Management</span>
                            <div className="flex-grow border-t border-gray-400"></div>
                        </li>
                        <li>
                            <NavLink
                                href={route('students.index')}
                                active={route().current('students.*')}
                            >
                                <FiUsers className='text-2xl' />
                                Students
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                            >
                                <FiClipboard className='text-2xl' />
                                Semesters
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                            >
                                <FiCalendar className='text-2xl' />
                                Events
                            </NavLink>
                        </li>
                        <li className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-400"></div>
                            <span className="flex-shrink mx-4 text-gray-400">Records</span>
                            <div className="flex-grow border-t border-gray-400"></div>
                        </li>
                        <li>
                            <NavLink
                            >
                                <FiClock className='text-2xl' />
                                Attendances
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                            >
                                <FiFileText className='text-2xl' />
                                Records
                            </NavLink>
                        </li>
                        <li className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-400"></div>
                            <span className="flex-shrink mx-4 text-gray-400">Settings</span>
                            <div className="flex-grow border-t border-gray-400"></div>
                        </li>
                        <li>
                            <NavLink
                                href={route('profile.edit')}
                                active={route().current('profile.edit')}
                            >
                                <FiSettings className='text-2xl' />
                                My Profile
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </aside>
            <Toaster position="top-right" toastOptions={{
                className: '',
                style: {
                    borderRadius: '8px',
                    background: '#fff',
                    color: '#333',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '16px',
                }
            }} />
            <main className='sm:pl-64 pt-16'>{children}</main>
        </div>
    );
}
