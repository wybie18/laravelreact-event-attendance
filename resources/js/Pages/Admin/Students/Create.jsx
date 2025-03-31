import { Head, useForm, Link } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { FaArrowLeft, FaUserPlus, FaIdCard, FaEnvelope, FaGraduationCap } from "react-icons/fa"
import { HiOutlineIdentification } from "react-icons/hi"
import { FiUser, FiUsers } from "react-icons/fi"
import toast from "react-hot-toast"
import { useState } from "react"

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        rfid_uid: "",
        student_id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        year_level: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setData(name, value)
    }

    const handleErrors = (errors) => {
        if (errors) {
            let delay = 0
            for (const key in errors) {
                if (errors.hasOwnProperty(key)) {
                    setTimeout(() => {
                        toast.error(errors[key])
                    }, delay)
                }
                delay += 150
            }
        }
    }

    const onSubmit = (e) => {
        e.preventDefault()

        post(route("students.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset()
                toast.success("Student successfully added!")
            },
            onError: (errors) => {
                handleErrors(errors)
            },
        })
    }

    return (
        <AuthenticatedLayout>
            <Head title="Add New Student" />

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <h1 className="text-xl font-bold text-white sm:text-2xl">Add New Student</h1>
                                <Link
                                    href={route("students.index")}
                                    className="flex items-center justify-center sm:justify-start gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    <FaArrowLeft className="text-xs" />
                                    <span>Back to List</span>
                                </Link>
                            </div>
                        </div>

                        {/* Form Container */}
                        <div className="p-4 sm:p-6">
                            {/* Info Banner */}
                            <div className="mb-6 rounded-lg bg-green-50 p-4 border-l-4 border-green-500">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <FiUsers className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="ml-3">
                                        <h2 className="text-sm font-medium text-green-800">Student Registration</h2>
                                        <p className="mt-1 text-sm text-green-700">
                                            Fill in the student details below. Fields marked with an asterisk (*) are required.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={onSubmit} className="space-y-8">
                                {/* Form Sections */}
                                <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:gap-x-8">
                                    {/* Personal Information Section */}
                                    <div className="space-y-6">
                                        <div className="border-b border-gray-200 pb-2">
                                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                                <FiUser className="mr-2 text-green-600" />
                                                Personal Information
                                            </h3>
                                        </div>

                                        {/* First Name */}
                                        <div className="space-y-2">
                                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                                First Name <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    id="first_name"
                                                    name="first_name"
                                                    value={data.first_name}
                                                    onChange={handleChange}
                                                    className={`block w-full rounded-md border ${errors.first_name
                                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                            : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                        } px-3 py-2 shadow-sm sm:text-sm`}
                                                    placeholder="Enter first name"
                                                />
                                            </div>
                                            {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>}
                                        </div>

                                        {/* Middle Name */}
                                        <div className="space-y-2">
                                            <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700">
                                                Middle Name <span className="text-gray-400">(Optional)</span>
                                            </label>
                                            <div className="relative rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    id="middle_name"
                                                    name="middle_name"
                                                    value={data.middle_name}
                                                    onChange={handleChange}
                                                    className={`block w-full rounded-md border ${errors.middle_name
                                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                            : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                        } px-3 py-2 shadow-sm sm:text-sm`}
                                                    placeholder="Enter middle name"
                                                />
                                            </div>
                                            {errors.middle_name && <p className="mt-1 text-xs text-red-500">{errors.middle_name}</p>}
                                        </div>

                                        {/* Last Name */}
                                        <div className="space-y-2">
                                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                                Last Name <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    id="last_name"
                                                    name="last_name"
                                                    value={data.last_name}
                                                    onChange={handleChange}
                                                    className={`block w-full rounded-md border ${errors.last_name
                                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                            : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                        } px-3 py-2 shadow-sm sm:text-sm`}
                                                    placeholder="Enter last name"
                                                />
                                            </div>
                                            {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>}
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <FaEnvelope className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={data.email}
                                                    onChange={handleChange}
                                                    className={`block w-full rounded-md border ${errors.email
                                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                            : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                        } pl-10 px-3 py-2 shadow-sm sm:text-sm`}
                                                    placeholder="student@example.com"
                                                />
                                            </div>
                                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                        </div>
                                    </div>

                                    {/* Academic Information Section */}
                                    <div className="space-y-6">
                                        <div className="border-b border-gray-200 pb-2">
                                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                                <FaGraduationCap className="mr-2 text-green-600" />
                                                Academic Information
                                            </h3>
                                        </div>

                                        {/* Student ID */}
                                        <div className="space-y-2">
                                            <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">
                                                Student ID <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <FaIdCard className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="student_id"
                                                    name="student_id"
                                                    value={data.student_id}
                                                    onChange={handleChange}
                                                    className={`block w-full rounded-md border ${errors.student_id
                                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                            : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                        } pl-10 px-3 py-2 shadow-sm sm:text-sm`}
                                                    placeholder="Enter student ID"
                                                />
                                            </div>
                                            {errors.student_id && <p className="mt-1 text-xs text-red-500">{errors.student_id}</p>}
                                        </div>

                                        {/* RFID UID */}
                                        <div className="space-y-2">
                                            <label htmlFor="rfid_uid" className="block text-sm font-medium text-gray-700">
                                                RFID UID <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <HiOutlineIdentification className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="rfid_uid"
                                                    name="rfid_uid"
                                                    value={data.rfid_uid}
                                                    onChange={handleChange}
                                                    className={`block w-full rounded-md border ${errors.rfid_uid
                                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                            : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                        } pl-10 px-3 py-2 shadow-sm sm:text-sm`}
                                                    placeholder="Enter RFID UID"
                                                />
                                            </div>
                                            {errors.rfid_uid && <p className="mt-1 text-xs text-red-500">{errors.rfid_uid}</p>}
                                        </div>

                                        {/* Year Level */}
                                        <div className="space-y-2">
                                            <label htmlFor="year_level" className="block text-sm font-medium text-gray-700">
                                                Year Level <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative rounded-md shadow-sm">
                                                <select
                                                    id="year_level"
                                                    name="year_level"
                                                    value={data.year_level}
                                                    onChange={handleChange}
                                                    className={`block w-full rounded-md border ${errors.year_level
                                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                            : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                        } px-3 py-2 shadow-sm sm:text-sm bg-white`}
                                                >
                                                    <option value="">Select Year Level</option>
                                                    <option value="1">First Year</option>
                                                    <option value="2">Second Year</option>
                                                    <option value="3">Third Year</option>
                                                    <option value="4">Fourth Year</option>
                                                    <option value="5">Fifth Year</option>
                                                </select>
                                            </div>
                                            {errors.year_level && <p className="mt-1 text-xs text-red-500">{errors.year_level}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex flex-col-reverse sm:flex-row sm:justify-end pt-6 gap-3 border-t border-gray-200">
                                    <Link
                                        href={route("students.index")}
                                        className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                        disabled={processing}
                                    >
                                        <FaUserPlus className="mr-2" />
                                        {processing ? "Saving..." : "Add Student"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

