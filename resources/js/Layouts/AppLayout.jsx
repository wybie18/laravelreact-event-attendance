import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Toaster } from 'react-hot-toast';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';

export default function AppLayout({ children }) {
    const { events } = usePage().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isToday = (date) => {
        const today = new Date();
        const eventDate = new Date(date);
        return (
            today.getDate() === eventDate.getDate() &&
            today.getMonth() === eventDate.getMonth() &&
            today.getFullYear() === eventDate.getFullYear()
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <nav className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href={route('user.attendances.index')} className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="/logo.png" className="h-8" alt="WebKnight Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap text-green-600 dark:text-green-400">WebKnight</span>
                    </Link>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-green-600"
                        aria-controls="navbar-default"
                        aria-expanded={isMenuOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>

                    <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto transition-all duration-300 ease-in-out`} id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-6 rtl:space-x-reverse md:mt-0 bg-white md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent">

                            {events.map((event) => (
                                <li key={event.id}>
                                    <Link
                                        href={isToday(event.date) ? route('user.attendances.create', event.id) : '#'}
                                        className={`
                      block px-3 py-2 rounded-md text-sm font-medium relative transition-all duration-200
                      ${route().current('user.attendances.create', { id: event.id })
                                                ? 'text-white bg-green-600 md:bg-green-600 md:text-white dark:bg-green-600'
                                                : 'text-gray-800 hover:bg-green-50 md:hover:bg-green-50 md:hover:text-green-700 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white'}
                      ${!isToday(event.date) ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                                    >
                                        {event.name}
                                        {isToday(event.date) && (
                                            <span className="absolute top-0 right-0 -mt-1 -mr-1">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                </span>
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>

            <Toaster
                position="top-right"
                toastOptions={{
                    className: "",
                    style: {
                        borderRadius: "8px",
                        background: "var(--toast-bg, #fff)",
                        color: "var(--toast-color, #333)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        padding: "16px",
                    },
                    success: {
                        style: {
                            borderLeft: "4px solid #10b981",
                        },
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        }
                    },
                    error: {
                        style: {
                            borderLeft: "4px solid #ef4444",
                        },
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        }
                    },
                }}
            />

            <main className="py-8">
                {children}
            </main>
        </div>
    );
}