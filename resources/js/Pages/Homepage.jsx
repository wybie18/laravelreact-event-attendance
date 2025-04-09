import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { FiCalendar, FiClock, FiInfo, FiArrowRight } from 'react-icons/fi';

export default function Homepage() {
    const { events } = usePage().props;

    const isToday = (date) => {
        const today = new Date();
        const eventDate = new Date(date);
        return (
            today.getDate() === eventDate.getDate() &&
            today.getMonth() === eventDate.getMonth() &&
            today.getFullYear() === eventDate.getFullYear()
        );
    };

    // Group events by date
    const groupedEvents = events.reduce((groups, event) => {
        const date = new Date(event.date).toLocaleDateString('en-US');
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(event);
        return groups;
    }, {});

    // Sort by date
    const sortedDates = Object.keys(groupedEvents).sort((a, b) => new Date(a) - new Date(b));

    return (
        <AppLayout>
            <Head title="Attendance" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Event Dashboard</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Manage attendance for upcoming events</p>
                </header>

                {events.length > 0 ? (
                    <>
                        {/* Today's events highlight section */}
                        {sortedDates.some(date =>
                            groupedEvents[date].some(event => isToday(event.date))
                        ) && (
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                                        <FiClock size={20} className="mr-2 text-green-600 dark:text-green-400" />
                                        Today's Events
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {events
                                            .filter(event => isToday(event.date))
                                            .map((event) => (
                                                <div key={event.id} className="bg-white dark:bg-gray-800 border-l-4 border-green-500 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                                    <div className="p-5">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{event.name}</h3>
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                                Live Now
                                                            </span>
                                                        </div>

                                                        {event.description && (
                                                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                                                                {event.description}
                                                            </p>
                                                        )}

                                                        <Link
                                                            href={route('user.attendances.create', event.id)}
                                                            className="inline-flex items-center justify-center w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
                                                        >
                                                            Take Attendance
                                                            <FiArrowRight size={16} className="ml-2" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </section>
                            )}

                        {/* All events section */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                                <FiCalendar size={20} className="mr-2 text-green-600 dark:text-green-400" />
                                All Upcoming Events
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {events.map((event) => (
                                    <div
                                        key={event.id}
                                        className={`overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 
                      ${isToday(event.date)
                                                ? 'bg-green-50 dark:bg-gray-800 border border-green-200 dark:border-green-900'
                                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`
                                        }
                                    >
                                        <div className="p-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{event.name}</h3>
                                                {isToday(event.date) && (
                                                    <span className="flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 animate-pulse">
                                                        <span className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mr-1"></span>
                                                        Live
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                                                <FiCalendar size={16} className="mr-1" />
                                                {new Date(event.date).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>

                                            {event.description && (
                                                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                                                    {event.description}
                                                </p>
                                            )}

                                            <Link
                                                href={isToday(event.date) ? route('user.attendances.create', event.id) : '#'}
                                                className={`
                                                        inline-flex items-center justify-center w-full px-4 py-2 font-medium rounded-lg transition-colors duration-300
                                                        ${isToday(event.date)
                                                        ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800'
                                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'}
                                                `}
                                            >
                                                {isToday(event.date) ? 'Take Attendance' : 'Not Available Today'}
                                                {isToday(event.date) && <FiArrowRight size={16} className="ml-2" />}
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <FiInfo size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No events available</h3>
                        <p className="text-gray-500 dark:text-gray-400">There are no upcoming events scheduled at this time.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}