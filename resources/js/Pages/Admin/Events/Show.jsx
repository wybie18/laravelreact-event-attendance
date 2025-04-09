import { Head, Link } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { FaArrowLeft, FaEdit, FaTrashAlt, FaCalendarAlt, FaUserCheck } from "react-icons/fa"
import { FiCalendar, FiClock, FiInfo, FiUser } from "react-icons/fi"
import { useState } from "react"
import DeleteForm from "./Modal/DeleteForm"

export default function Show({ event }) {
    event = event?.data || null;
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDeleteClick = () => {
        setDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
    }

    const formatDate = (dateString) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatTime = (timeString) => {
        if (!timeString) return ""
        const [hours, minutes] = timeString.split(":")
        const time = new Date()
        time.setHours(Number.parseInt(hours, 10))
        time.setMinutes(Number.parseInt(minutes, 10))
        return time.toLocaleTimeString("en-US", {
            timeZone:'Asia/Manila',
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        })
    }

    const formatTimeSlotType = (type) => {
        return type
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    }

    const getTimeSlotColor = (slotType) => {
        const colors = {
            "morning-in": "bg-blue-100 text-blue-800",
            "morning-out": "bg-blue-100 text-blue-800",
            "afternoon-in": "bg-amber-100 text-amber-800",
            "afternoon-out": "bg-amber-100 text-amber-800",
            "evening-in": "bg-purple-100 text-purple-800",
            "evening-out": "bg-purple-100 text-purple-800",
        }
        return colors[slotType] || "bg-gray-100 text-gray-800"
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Event: ${event.name}`} />

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <h1 className="text-xl font-bold text-white sm:text-2xl">Event Details</h1>
                                <Link
                                    href={route("events.index")}
                                    className="flex items-center justify-center sm:justify-start gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    <FaArrowLeft className="text-xs" />
                                    <span>Back to Events</span>
                                </Link>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6">
                            {/* Event Profile */}
                            <div className="mb-8 text-center sm:mb-12">
                                <div className="flex justify-center">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600 sm:h-32 sm:w-32">
                                        <FaCalendarAlt className="h-12 w-12 sm:h-16 sm:w-16" />
                                    </div>
                                </div>
                                <h2 className="mt-4 text-xl font-bold sm:text-2xl">{event.name}</h2>
                                <p className="text-lg text-gray-600">{event.semester.name}</p>
                                <p className="mt-2 text-gray-500">
                                    <FiCalendar className="inline-block mr-1" />
                                    {formatDate(event.date)}
                                </p>
                            </div>

                            {/* Event Information Cards */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="border-b border-gray-200 pb-2 text-lg font-medium text-green-700">
                                        Event Information
                                    </h3>

                                    {event.description && (
                                        <div className="group">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <FiInfo className="text-green-600" />
                                                <span className="font-medium">Description:</span>
                                            </div>
                                            <p className="mt-1 pl-6 group-hover:text-green-700 transition-colors">{event.description}</p>
                                        </div>
                                    )}

                                    <div className="group">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <FiCalendar className="text-green-600" />
                                            <span className="font-medium">Date:</span>
                                        </div>
                                        <p className="mt-1 pl-6 group-hover:text-green-700 transition-colors">{formatDate(event.date)}</p>
                                    </div>

                                    <div className="group">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <FiUser className="text-green-600" />
                                            <span className="font-medium">Semester:</span>
                                        </div>
                                        <p className="mt-1 pl-6 group-hover:text-green-700 transition-colors">{event.semester.name}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="border-b border-gray-200 pb-2 text-lg font-medium text-green-700">Time Slots</h3>

                                    {event.timeSlots.length > 0 ? (
                                        <div className="space-y-3">
                                            {event.timeSlots.map((slot) => (
                                                <div
                                                    key={slot.id}
                                                    className="rounded-md border border-gray-200 bg-white p-3 hover:shadow-sm transition-shadow"
                                                >
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTimeSlotColor(slot.slot_type)}`}
                                                        >
                                                            {formatTimeSlotType(slot.slot_type)}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            <FiClock className="inline-block mr-1" />
                                                            {formatTime(slot.start)} - {formatTime(slot.end)}
                                                        </span>
                                                    </div>

                                                    {slot.attendances && slot.attendances.length > 0 && (
                                                        <div className="mt-2 pt-2 border-t border-gray-100">
                                                            <p className="text-xs text-gray-500 mb-1 flex items-center">
                                                                <FaUserCheck className="mr-1 text-green-500" />
                                                                {slot.attendances.length} Attendances
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm italic">No time slots defined for this event.</p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                                <button
                                    onClick={handleDeleteClick}
                                    disabled={isDeleting}
                                    className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                                    aria-label={`Delete ${event.name}`}
                                >
                                    <FaTrashAlt className="mr-2" />
                                    {isDeleting ? "Deleting..." : "Delete Event"}
                                </button>

                                <Link
                                    href={route("events.edit", event.id)}
                                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                    aria-label={`Edit ${event.name}`}
                                >
                                    <FaEdit className="mr-2" />
                                    Edit Event
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DeleteForm openModal={deleteModalOpen} closeModal={closeDeleteModal} event={event} />
        </AuthenticatedLayout>
    )
}