import Pagination from '@/Components/Pagination';
import TableHeading from '@/Components/TableHeading';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { FiSearch, FiFilter, FiCalendar, FiTrash2, FiEdit, FiX, FiCheck, FiPlus } from 'react-icons/fi';
import CreateForm from './Modal/CreateForm';
import EditForm from './Modal/EditForm';
import DeleteForm from './Modal/DeleteForm';

export default function Index({ semesters, queryParams = null }) {
    queryParams = queryParams || {};
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const openCreateModal = () => {
        setCreateModalOpen(true);
    }

    const closeCreateModal = () => {
        setCreateModalOpen(false);
    };

    const openEditModal = (semester) => {
        setSelectedSemester(semester);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedSemester(null);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedSemester(null);
    };

    const handleDeleteClick = (semester) => {
        setSelectedSemester(semester);
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
        router.get(route('semesters.index'), queryParams);
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
        router.get(route('semesters.index'), queryParams);
    }

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    }

    const clearFilters = () => {
        router.get(route('semesters.index'), {});
    }

    const getActiveFiltersCount = () => {
        let count = 0;
        if (queryParams.search) count++;
        return count;
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Semesters" />

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
                        <div className="p-4 sm:p-6 text-gray-900">
                            {/* Header Section */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                <div>
                                    <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-green-600">
                                        Semester Management
                                    </h5>
                                    <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                                        Manage academic semesters and set active periods
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
                                            className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                            onClick={openCreateModal}
                                        >
                                            <FiPlus className="mr-2 h-4 w-4" />
                                            <span>Add Semester</span>
                                        </button>
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
                                                placeholder="Search by semester name..."
                                                defaultValue={queryParams.search || ''}
                                                onBlur={e => searchFieldChanged('search', e.target.value)}
                                                onKeyUp={e => onKeyPress('search', e)}
                                                aria-label="Search semesters"
                                            />
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
                                                <TableHeading fieldName="name" sortable={true} sortField={queryParams.sort_field} sortDirection={queryParams.sort_direction} onSortChange={onSortChange}>
                                                    Name
                                                </TableHeading>
                                                <TableHeading fieldName="start" sortable={true} sortField={queryParams.sort_field} sortDirection={queryParams.sort_direction} onSortChange={onSortChange}>
                                                    Start Date
                                                </TableHeading>
                                                <TableHeading fieldName="end" sortable={true} sortField={queryParams.sort_field} sortDirection={queryParams.sort_direction} onSortChange={onSortChange}>
                                                    End Date
                                                </TableHeading>
                                                <TableHeading>
                                                    Status
                                                </TableHeading>
                                                <TableHeading>
                                                    Actions
                                                </TableHeading>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {semesters.data.length > 0 ? (
                                                semesters.data.map((semester, index) => (
                                                    <tr key={index} className="hover:bg-green-50 transition-colors">
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 font-medium">
                                                            #{semester.id}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 font-medium">
                                                            {semester.name}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                            {formatDate(semester.start)}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                            {formatDate(semester.end)}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                                            {semester.active ? (
                                                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                                    <FiCheck className="mr-1 h-3 w-3" />
                                                                    Active
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                                                    Inactive
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium">
                                                            <div className="flex justify-end space-x-2">
                                                                <button
                                                                    onClick={() => openEditModal(semester)}
                                                                    className="inline-flex items-center rounded-md bg-green-50 p-2 text-green-600 hover:bg-green-100 transition-colors"
                                                                    title="Edit Semester"
                                                                    aria-label={`Edit ${semester.name}`}
                                                                >
                                                                    <FiEdit className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteClick(semester)}
                                                                    type="button"
                                                                    className="inline-flex items-center rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors"
                                                                    title="Delete Semester"
                                                                    aria-label={`Delete ${semester.name}`}
                                                                >
                                                                    <FiTrash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <FiCalendar className="h-12 w-12 text-gray-300 mb-3" />
                                                            <p className="font-medium text-gray-600">No semesters found</p>
                                                            <p className="text-gray-500 mt-1">Try adjusting your search filters or add a new semester</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="border-t border-gray-200 px-4 py-3">
                                    <Pagination pagination={semesters.meta} queryParams={queryParams} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CreateForm openModal={createModalOpen} closeModal={closeCreateModal} />
            <EditForm openModal={editModalOpen} closeModal={closeEditModal} semester={selectedSemester} />
            <DeleteForm openModal={deleteModalOpen} closeModal={closeDeleteModal} semester={selectedSemester} />
        </AuthenticatedLayout>
    );
}
