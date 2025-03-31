import { Head, useForm, Link } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { FaArrowLeft, FaCalendarPlus, FaCalendarAlt, FaClock } from "react-icons/fa"
import { FiInfo, FiCalendar, FiClock, FiPlus, FiTrash2 } from "react-icons/fi"
import toast from "react-hot-toast"
import { useState } from "react"

export default function Create({ semesters, timeSlotTypes }) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { data, setData, post, processing, errors } = useForm({
        semester_id: "",
        name: "",
        date: "",
        description: "",
        time_slots: [{ slot_type: "", start: "", end: "" }],
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setData(name, value)
    }

    const handleTimeSlotChange = (index, field, value) => {
        const updatedTimeSlots = [...data.time_slots]
        updatedTimeSlots[index][field] = value
        setData("time_slots", updatedTimeSlots)
    }

    const addTimeSlot = () => {
        setData("time_slots", [...data.time_slots, { slot_type: "", start: "", end: "" }])
    }

    const removeTimeSlot = (index) => {
        if (data.time_slots.length === 1) {
            toast.error("At least one time slot is required")
            return
        }

        const updatedTimeSlots = [...data.time_slots]
        updatedTimeSlots.splice(index, 1)
        setData("time_slots", updatedTimeSlots)
    }

    const formatTimeSlotType = (type) => {
        return type
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
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
        setIsSubmitting(true)

        post(route("events.store"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Event successfully created!")
                setIsSubmitting(false)
            },
            onError: (errors) => {
                handleErrors(errors)
                setIsSubmitting(false)
            },
        })
    }

    return (
        <AuthenticatedLayout>
            <Head title="Create New Event" />

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <h1 className="text-xl font-bold text-white sm:text-2xl">Create New Event</h1>
                                <Link
                                    href={route("events.index")}
                                    className="flex items-center justify-center sm:justify-start gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    <FaArrowLeft className="text-xs" />
                                    <span>Back to Events</span>
                                </Link>
                            </div>
                        </div>

                        {/* Form Container */}
                        <div className="p-4 sm:p-6">
                            {/* Info Banner */}
                            <div className="mb-6 rounded-lg bg-green-50 p-4 border-l-4 border-green-500">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <FiCalendar className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="ml-3">
                                        <h2 className="text-sm font-medium text-green-800">Event Registration</h2>
                                        <p className="mt-1 text-sm text-green-700">
                                            Fill in the event details below. Fields marked with an asterisk (*) are required.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={onSubmit} className="space-y-8">
                                {/* Event Details Section */}
                                <div className="space-y-6">
                                    <div className="border-b border-gray-200 pb-2">
                                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                            <FaCalendarAlt className="mr-2 text-green-600" />
                                            Event Details
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                                        {/* Event Name */}
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                Event Name <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={data.name}
                                                    onChange={handleChange}
                                                    className={`block w-full rounded-md border ${errors.name
                                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                            : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                        } px-3 py-2 shadow-sm sm:text-sm`}
                                                    placeholder="Enter event name"
                                                />
                                            </div>
                                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                        </div>

                                        {/* Semester */}
                                        <div className="space-y-2">
                                            <label htmlFor="semester_id" className="block text-sm font-medium text-gray-700">
                                                Semester <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative rounded-md shadow-sm">
                                                <select
                                                    id="semester_id"
                                                    name="semester_id"
                                                    value={data.semester_id}
                                                    onChange={handleChange}
                                                    className={`block w-full rounded-md border ${errors.semester_id
                                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                            : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                        } px-3 py-2 shadow-sm sm:text-sm bg-white`}
                                                >
                                                    <option value="">Select Semester</option>
                                                    {semesters.map((semester) => (
                                                        <option key={semester.id} value={semester.id}>
                                                            {semester.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {errors.semester_id && <p className="mt-1 text-xs text-red-500">{errors.semester_id}</p>}
                                        </div>

                                        {/* Event Date */}
                                        <div className="space-y-2">
                                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                                Event Date <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <FiCalendar className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    type="date"
                                                    id="date"
                                                    name="date"
                                                    value={data.date}
                                                    onChange={handleChange}
                                                    className={`block w-full rounded-md border ${errors.date
                                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                            : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                        } pl-10 px-3 py-2 shadow-sm sm:text-sm`}
                                                />
                                            </div>
                                            {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2 sm:col-span-2">
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                                Description <span className="text-gray-400">(Optional)</span>
                                            </label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <FiInfo className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    value={data.description || ""}
                                                    onChange={handleChange}
                                                    rows={3}
                                                    className={`block w-full rounded-md border ${errors.description
                                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                            : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                        } pl-10 px-3 py-2 shadow-sm sm:text-sm`}
                                                    placeholder="Enter event description"
                                                />
                                            </div>
                                            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Time Slots Section */}
                                <div className="space-y-6">
                                    <div className="border-b border-gray-200 pb-2 flex justify-between items-center">
                                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                            <FaClock className="mr-2 text-green-600" />
                                            Time Slots
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={addTimeSlot}
                                            className="inline-flex items-center rounded-md border border-transparent bg-green-100 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                        >
                                            <FiPlus className="mr-1 h-4 w-4" />
                                            Add Time Slot
                                        </button>
                                    </div>

                                    {errors.time_slots && <p className="mt-1 text-xs text-red-500">{errors.time_slots}</p>}

                                    {data.time_slots.map((timeSlot, index) => (
                                        <div key={index} className="rounded-lg border border-gray-200 p-4 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-sm font-medium text-gray-700">Time Slot #{index + 1}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => removeTimeSlot(index)}
                                                    className="inline-flex items-center text-sm text-red-600 hover:text-red-800"
                                                >
                                                    <FiTrash2 className="mr-1 h-4 w-4" />
                                                    Remove
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-3">
                                                {/* Slot Type */}
                                                <div className="space-y-2">
                                                    <label
                                                        htmlFor={`time_slot_${index}_type`}
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        Slot Type <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative rounded-md shadow-sm">
                                                        <select
                                                            id={`time_slot_${index}_type`}
                                                            value={timeSlot.slot_type}
                                                            onChange={(e) => handleTimeSlotChange(index, "slot_type", e.target.value)}
                                                            className={`block w-full rounded-md border ${errors[`time_slots.${index}.slot_type`]
                                                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                                    : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                                } px-3 py-2 shadow-sm sm:text-sm bg-white`}
                                                        >
                                                            <option value="">Select Slot Type</option>
                                                            {timeSlotTypes.map((type) => (
                                                                <option key={type} value={type}>
                                                                    {formatTimeSlotType(type)}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    {errors[`time_slots.${index}.slot_type`] && (
                                                        <p className="mt-1 text-xs text-red-500">{errors[`time_slots.${index}.slot_type`]}</p>
                                                    )}
                                                </div>

                                                {/* Start Time */}
                                                <div className="space-y-2">
                                                    <label
                                                        htmlFor={`time_slot_${index}_start`}
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        Start Time <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative rounded-md shadow-sm">
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <FiClock className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="time"
                                                            id={`time_slot_${index}_start`}
                                                            value={timeSlot.start}
                                                            onChange={(e) => handleTimeSlotChange(index, "start", e.target.value)}
                                                            className={`block w-full rounded-md border ${errors[`time_slots.${index}.start`]
                                                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                                    : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                                } pl-10 px-3 py-2 shadow-sm sm:text-sm`}
                                                        />
                                                    </div>
                                                    {errors[`time_slots.${index}.start`] && (
                                                        <p className="mt-1 text-xs text-red-500">{errors[`time_slots.${index}.start`]}</p>
                                                    )}
                                                </div>

                                                {/* End Time */}
                                                <div className="space-y-2">
                                                    <label htmlFor={`time_slot_${index}_end`} className="block text-sm font-medium text-gray-700">
                                                        End Time <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative rounded-md shadow-sm">
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <FiClock className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="time"
                                                            id={`time_slot_${index}_end`}
                                                            value={timeSlot.end}
                                                            onChange={(e) => handleTimeSlotChange(index, "end", e.target.value)}
                                                            className={`block w-full rounded-md border ${errors[`time_slots.${index}.end`]
                                                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                                    : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                                } pl-10 px-3 py-2 shadow-sm sm:text-sm`}
                                                        />
                                                    </div>
                                                    {errors[`time_slots.${index}.end`] && (
                                                        <p className="mt-1 text-xs text-red-500">{errors[`time_slots.${index}.end`]}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Form Actions */}
                                <div className="flex flex-col-reverse sm:flex-row sm:justify-end pt-6 gap-3 border-t border-gray-200">
                                    <Link
                                        href={route("events.index")}
                                        className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                        disabled={processing || isSubmitting}
                                    >
                                        <FaCalendarPlus className="mr-2" />
                                        {processing || isSubmitting ? "Creating..." : "Create Event"}
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

