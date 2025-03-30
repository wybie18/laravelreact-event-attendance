import { Head, Link } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { FaArrowLeft, FaEdit, FaTrashAlt, FaIdCard, FaEnvelope, FaGraduationCap, FaCreditCard } from "react-icons/fa"
import { useState } from "react"
import toast from "react-hot-toast"
import DeleteForm from "./Modal/DeleteForm"

export default function Show({ student }) {
    student = student?.data || null
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDeleteClick = () => {
        setDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Student: ${student.first_name} ${student.last_name}`} />

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
                        <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <h1 className="text-xl font-bold text-white sm:text-2xl">Student Details</h1>
                                <Link
                                    href={route("students.index")}
                                    className="flex items-center justify-center sm:justify-start gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    <FaArrowLeft className="text-xs" />
                                    <span>Back to List</span>
                                </Link>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6">
                            <div className="mb-8 text-center sm:mb-12">
                                <div className="flex justify-center">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600 sm:h-32 sm:w-32">
                                        <span className="text-3xl font-bold sm:text-5xl">
                                            {student.first_name[0]}
                                            {student.last_name[0]}
                                        </span>
                                    </div>
                                </div>
                                <h2 className="mt-4 text-xl font-bold sm:text-2xl">
                                    {student.first_name} {student.middle_name ? `${student.middle_name} ` : ""}
                                    {student.last_name}
                                </h2>
                                <p className="text-lg text-gray-600">Year {student.year_level} Student</p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="border-b border-gray-200 pb-2 text-lg font-medium text-green-700">
                                        Student Information
                                    </h3>

                                    <div className="group">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <FaIdCard className="text-green-600" />
                                            <span className="font-medium">Student ID:</span>
                                        </div>
                                        <p className="mt-1 pl-6 group-hover:text-green-700 transition-colors">{student.student_id}</p>
                                    </div>

                                    <div className="group">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <FaEnvelope className="text-green-600" />
                                            <span className="font-medium">Email Address:</span>
                                        </div>
                                        <p className="mt-1 pl-6 group-hover:text-green-700 transition-colors break-words">
                                            {student.email}
                                        </p>
                                    </div>

                                    <div className="group">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <FaGraduationCap className="text-green-600" />
                                            <span className="font-medium">Year Level:</span>
                                        </div>
                                        <p className="mt-1 pl-6 group-hover:text-green-700 transition-colors">
                                            {student.year_level === 1 && "First Year"}
                                            {student.year_level === 2 && "Second Year"}
                                            {student.year_level === 3 && "Third Year"}
                                            {student.year_level === 4 && "Fourth Year"}
                                            {student.year_level === 5 && "Fifth Year"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="border-b border-gray-200 pb-2 text-lg font-medium text-green-700">
                                        System Information
                                    </h3>

                                    <div className="group">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <FaCreditCard className="text-green-600" />
                                            <span className="font-medium">RFID UID:</span>
                                        </div>
                                        <p className="mt-1 pl-6 group-hover:text-green-700 transition-colors">{student.rfid_uid}</p>
                                    </div>

                                    <div className="group">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <span className="font-medium">Created:</span>
                                        </div>
                                        <p className="mt-1 pl-6 group-hover:text-green-700 transition-colors">
                                            {new Date(student.created_at).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="group">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <span className="font-medium">Last Updated:</span>
                                        </div>
                                        <p className="mt-1 pl-6 group-hover:text-green-700 transition-colors">
                                            {new Date(student.updated_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                                <button
                                    onClick={handleDeleteClick}
                                    disabled={isDeleting}
                                    className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                                    aria-label={`Delete ${student.first_name} ${student.last_name}`}
                                >
                                    <FaTrashAlt className="mr-2" />
                                    {isDeleting ? "Deleting..." : "Delete Student"}
                                </button>

                                <Link
                                    href={route("students.edit", student.id)}
                                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                    aria-label={`Edit ${student.first_name} ${student.last_name}`}
                                >
                                    <FaEdit className="mr-2" />
                                    Edit Student
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DeleteForm openModal={deleteModalOpen} closeModal={closeDeleteModal} student={student} />
        </AuthenticatedLayout>
    )
}

