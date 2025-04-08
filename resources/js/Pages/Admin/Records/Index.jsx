import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { FiSearch, FiFilter, FiCheck, FiX, FiDownload } from 'react-icons/fi';

export default function Index({ records, semesterEvents, semesters, currentSemester, queryParams = null }) {
    queryParams = queryParams || {};
    const [showFilters, setShowFilters] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState(queryParams.semester || currentSemester?.id || '');

    const handleSemesterChange = (semesterId) => {
        setSelectedSemester(semesterId);
        searchFieldChanged('semester', semesterId);
    };

    const searchFieldChanged = (name, value) => {
        if (!value && !queryParams[name]) {
            return;
        }
        if (value) {
            queryParams[name] = value;
        }
        if (queryParams[name] && !value) {
            delete queryParams[name];
        }
        router.get(route('records'), queryParams);
    }

    const onKeyPress = (name, e) => {
        if (e.key !== 'Enter') return;
        searchFieldChanged(name, e.target.value);
    }

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    }

    const clearFilters = () => {
        setSelectedSemester(currentSemester?.id || '');
        router.get(route('records'), {});
    }

    const getActiveFiltersCount = () => {
        let count = 0;
        if (queryParams.search) count++;
        if (queryParams.year_level) count++;
        if (queryParams.semester && queryParams.semester !== currentSemester?.id) count++;
        return count;
    }

    const yearLevelOptions = [
        { value: '', label: 'All Year Levels' },
        { value: '1', label: '1st Year' },
        { value: '2', label: '2nd Year' },
        { value: '3', label: '3rd Year' },
        { value: '4', label: '4th Year' },
    ];

    const formatTime = (timeString) => {
        if (!timeString) return ""
        const [hours, minutes] = timeString.split(":")
        const time = new Date()
        time.setHours(Number.parseInt(hours, 10))
        time.setMinutes(Number.parseInt(minutes, 10))
        return time.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        })
    }

    const extractTime = (isoString) => {
        if (!isoString) return "";

        const timeMatch = isoString.match(/T(\d{2}:\d{2})/);
        return timeMatch ? timeMatch[1] : "";
    };

    const formatTimeSlotType = (type) => {
        return type
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    }

    const handleExport = () => {
        const params = new URLSearchParams();
        if (queryParams?.search) params.append('search', queryParams.search);
        if (queryParams?.year_level) params.append('year_level', queryParams.year_level);
        if (queryParams?.semester) params.append('semester', queryParams.semester);

        window.location.href = `${route('records.export')}?${params.toString()}`;
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Attendance Records
                </h2>
            }
        >
            <Head title="Attendance Records" />

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
                        <div className="p-4 sm:p-6 text-gray-900">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                <div>
                                    <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-green-600">
                                        Student Attendance Records
                                    </h5>
                                    <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                                        View all attendance records
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        onClick={toggleFilters}
                                        className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${showFilters ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                        aria-expanded={showFilters}
                                        aria-controls="filter-section"
                                    >
                                        <FiFilter className="mr-2 h-4 w-4" />
                                        Filters
                                        {getActiveFiltersCount() > 0 && (
                                            <span className="ml-2 rounded-full bg-green-500 px-2 py-0.5 text-xs text-white">
                                                {getActiveFiltersCount()}
                                            </span>
                                        )}
                                    </button>
                                    <div className="hidden sm:block h-8 w-px bg-gray-200"></div>
                                    <button
                                        onClick={handleExport}
                                        className="inline-flex items-center rounded-md border border-green-600 bg-white px-4 py-2 text-sm font-medium text-green-600 shadow-sm hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                    >
                                        <FiDownload className="mr-2 h-4 w-4" />
                                        <span className="hidden sm:inline">Export</span>
                                    </button>
                                </div>
                            </div>

                            {/* Filters Section */}
                            {showFilters && (
                                <div id="filter-section" className="mb-6 rounded-lg bg-green-50 p-4 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                        <h6 className="font-medium text-green-800 mb-2 sm:mb-0">Search Filters</h6>
                                        {getActiveFiltersCount() > 0 && (
                                            <button
                                                onClick={clearFilters}
                                                className="text-sm text-red-600 hover:text-red-800 transition-colors inline-flex items-center"
                                            >
                                                <FiX className="mr-1 h-4 w-4" />
                                                Clear All Filters
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4">
                                        <div className="relative w-full sm:w-64">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <FiSearch className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                                placeholder="Search by name or ID..."
                                                defaultValue={queryParams.search || ''}
                                                onBlur={e => searchFieldChanged('search', e.target.value)}
                                                onKeyUp={e => onKeyPress('search', e)}
                                                aria-label="Search records"
                                            />
                                        </div>

                                        <div className="w-full sm:w-48">
                                            <select
                                                className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                                value={queryParams.year_level || ''}
                                                onChange={e => searchFieldChanged('year_level', e.target.value)}
                                                aria-label="Filter by year level"
                                            >
                                                {yearLevelOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="w-full sm:w-48">
                                            <select
                                                className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                                value={selectedSemester}
                                                onChange={e => handleSemesterChange(e.target.value)}
                                                aria-label="Filter by semester"
                                            >
                                                {semesters.map(semester => (
                                                    <option key={semester.id} value={semester.id.toString()}>
                                                        {semester.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {semesterEvents.length > 0 ? (
                                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                                <tr className="bg-green-50">
                                                    <th
                                                        rowSpan="2"
                                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r"
                                                    >
                                                        Student
                                                    </th>
                                                    <th
                                                        rowSpan="2"
                                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r"
                                                    >
                                                        ID
                                                    </th>
                                                    <th
                                                        rowSpan="2"
                                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r"
                                                    >
                                                        Year
                                                    </th>

                                                    {semesterEvents.map(event => (
                                                        <th
                                                            key={event.id}
                                                            colSpan={event.time_slots.length}
                                                            className="px-4 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider border-b"
                                                        >
                                                            {event.name}
                                                        </th>
                                                    ))}
                                                </tr>

                                                <tr className="bg-green-50/70">
                                                    {semesterEvents.flatMap(event =>
                                                        event.time_slots.map(slot => (
                                                            <th
                                                                key={slot.id}
                                                                className="px-2 py-2 text-center text-xs font-medium text-gray-500 tracking-wider"
                                                            >
                                                                <span className="block font-medium">{formatTimeSlotType(slot.slot_type)}</span>
                                                                <span className="block text-xs font-normal mt-1">{extractTime(slot.start)} - {extractTime(slot.end)}</span>
                                                            </th>
                                                        ))
                                                    )}
                                                </tr>
                                            </thead>

                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {records.length > 0 ? (
                                                    records.map((record) => (
                                                        <tr key={record.student.id} className="hover:bg-green-50 transition-colors">
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                                                                {record.student.name}
                                                            </td>
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r">
                                                                {record.student.student_id}
                                                            </td>
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center border-r">
                                                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                                                    {record.student.year_level}
                                                                </span>
                                                            </td>

                                                            {record.attendances.map(attendance => (
                                                                <td
                                                                    key={`${record.student.id}-${attendance.event_id}-${attendance.slot_id}`}
                                                                    className="px-3 py-3 whitespace-nowrap text-sm text-center border-r"
                                                                >
                                                                    {attendance.timestamp ? (
                                                                        <span className="flex items-center justify-center text-green-600">
                                                                            <FiCheck className="h-5 w-5" />
                                                                        </span>
                                                                    ) : (
                                                                        <span className="flex items-center justify-center text-red-500"><FiX className="h-5 w-5" /></span>
                                                                    )}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={3 + semesterEvents.reduce((count, event) => count + event.time_slots.length, 0)} className="px-6 py-8 text-center text-sm text-gray-500">
                                                            <div className="flex flex-col items-center justify-center">
                                                                <svg className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <p className="font-medium text-gray-600">No records found</p>
                                                                <p className="text-gray-500 mt-1">Try adjusting your search filters or add new records</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 text-center rounded-lg border border-gray-200">
                                    <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="font-medium text-gray-600">No events found for selected semester</p>
                                    <p className="text-gray-500 mt-1">Try selecting a different semester or add events</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}