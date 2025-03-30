import Pagination from '@/Components/Pagination';
import TableHeading from '@/Components/TableHeading';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { FiSearch, FiDownload, FiUpload, FiFilter, FiUser, FiTrash2, FiEdit, FiEye, FiX } from 'react-icons/fi';
import DeleteForm from './Modal/DeleteForm';

export default function Index({ students, queryParams = null }) {
    queryParams = queryParams || {};
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // Year level options for filter
    const yearLevelOptions = [
        { value: '', label: 'All Year Levels' },
        { value: '1', label: 'First Year' },
        { value: '2', label: 'Second Year' },
        { value: '3', label: 'Third Year' },
        { value: '4', label: 'Fourth Year' }
    ];

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedStudent(null);
    };

    const handleDeleteClick = (student) => {
        setSelectedStudent(student);
        setDeleteModalOpen(true);
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
        router.get(route('students.index'), queryParams);
    }

    const onKeyPress = (name, e) => {
        if (e.key !== 'Enter') return;
        searchFieldChanged(name, e.target.value);
    }

    const onSortChange = (name) => {
        if (name === queryParams.sort_field) {
            if (queryParams.sort_direction === 'asc') {
                queryParams.sort_direction = 'desc';
            }
            else {
                queryParams.sort_direction = 'asc';
            }
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = 'asc';
        }
        router.get(route('students.index'), queryParams);
    }

    const handleExportStudents = () => {
        window.location.href = route('students.export', queryParams);
    }

    const handleImportClick = () => {
        document.getElementById('importFileInput').click();
    }

    const handleFileImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        router.post(route('students.import'), formData, {
            onSuccess: () => {
                e.target.value = '';
            }
        });
    }

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    }

    const clearFilters = () => {
        router.get(route('students.index'), {});
    }

    const getActiveFiltersCount = () => {
        let count = 0;
        if (queryParams.search) count++;
        if (queryParams.year_level) count++;
        return count;
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Students Management
                </h2>
            }
        >
            <Head title="Students" />

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
                        <div className="p-4 sm:p-6 text-gray-900">
                            {/* Header Section */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                <div>
                                    <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-green-600">
                                        Student Registry
                                    </h5>
                                    <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                                        Manage and view all student records in the system
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

                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            onClick={handleImportClick}
                                            className="inline-flex items-center rounded-md border border-green-600 bg-white px-4 py-2 text-sm font-medium text-green-600 shadow-sm hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                        >
                                            <FiUpload className="mr-2 h-4 w-4" />
                                            <span className="hidden sm:inline">Import</span>
                                        </button>
                                        <input
                                            id="importFileInput"
                                            type="file"
                                            accept=".csv,.xlsx,.xls"
                                            className="hidden"
                                            onChange={handleFileImport}
                                        />

                                        <button
                                            onClick={handleExportStudents}
                                            className="inline-flex items-center rounded-md border border-green-600 bg-white px-4 py-2 text-sm font-medium text-green-600 shadow-sm hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                        >
                                            <FiDownload className="mr-2 h-4 w-4" />
                                            <span className="hidden sm:inline">Export</span>
                                        </button>

                                        <Link
                                            href={route('students.create')}
                                            className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                        >
                                            <FiUser className="mr-2 h-4 w-4" />
                                            <span className="hidden sm:inline">Add Student</span>
                                        </Link>
                                    </div>
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
                                                aria-label="Search students"
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
                                    </div>
                                </div>
                            )}

                            {/* Table Section */}
                            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-green-50">
                                            <tr>
                                                <TableHeading fieldName="id" sortable={true} sortField={queryParams.sort_field} sortDirection={queryParams.sort_direction} onSortChange={onSortChange}>
                                                    ID
                                                </TableHeading>
                                                <TableHeading fieldName="rfid_uid">
                                                    RFID
                                                </TableHeading>
                                                <TableHeading fieldName="last_name" sortable={true} sortField={queryParams.sort_field} sortDirection={queryParams.sort_direction} onSortChange={onSortChange}>
                                                    Lastname
                                                </TableHeading>
                                                <TableHeading fieldName="first_name" sortable={true} sortField={queryParams.sort_field} sortDirection={queryParams.sort_direction} onSortChange={onSortChange}>
                                                    Firstname
                                                </TableHeading>
                                                <TableHeading fieldName="year_level" sortable={true} sortField={queryParams.sort_field} sortDirection={queryParams.sort_direction} onSortChange={onSortChange}>
                                                    Year Level
                                                </TableHeading>
                                                <TableHeading>
                                                    Actions
                                                </TableHeading>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {students.data.length > 0 ? (
                                                students.data.map((student, index) => (
                                                    <tr key={index} className="hover:bg-green-50 transition-colors">
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 font-medium">
                                                            #{student.id}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                                            {student.rfid_uid}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 font-medium">
                                                            {student.last_name}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                                                            {student.first_name}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                                {yearLevelOptions.find(option => option.value === student.year_level.toString())?.label || student.year_level}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium">
                                                            <div className="flex justify-end space-x-2">
                                                                <Link
                                                                    href={route('students.show', student.id)}
                                                                    className="inline-flex items-center rounded-md bg-amber-50 p-2 text-amber-600 hover:bg-amber-100 transition-colors"
                                                                    title="View Student"
                                                                    aria-label={`View details for ${student.first_name} ${student.last_name}`}
                                                                >
                                                                    <FiEye className="h-4 w-4" />
                                                                </Link>
                                                                <Link
                                                                    href={route('students.edit', student.id)}
                                                                    className="inline-flex items-center rounded-md bg-green-50 p-2 text-green-600 hover:bg-green-100 transition-colors"
                                                                    title="Edit Student"
                                                                    aria-label={`Edit ${student.first_name} ${student.last_name}`}
                                                                >
                                                                    <FiEdit className="h-4 w-4" />
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDeleteClick(student)}
                                                                    type="button"
                                                                    className="inline-flex items-center rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors"
                                                                    title="Delete Student"
                                                                    aria-label={`Delete ${student.first_name} ${student.last_name}`}
                                                                >
                                                                    <FiTrash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <svg className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <p className="font-medium text-gray-600">No students found</p>
                                                            <p className="text-gray-500 mt-1">Try adjusting your search filters or add a new student</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="border-t border-gray-200 px-4 py-3">
                                    <Pagination pagination={students.meta} queryParams={queryParams} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteForm openModal={deleteModalOpen} closeModal={closeDeleteModal} student={selectedStudent} />
        </AuthenticatedLayout>
    );
}
