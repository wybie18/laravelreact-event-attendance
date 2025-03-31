import { useState, useEffect, useRef } from "react"
import Modal from "@/Components/Modal"
import { useForm, usePage } from "@inertiajs/react"
import toast from "react-hot-toast"
import { FiX, FiUserCheck, FiSearch, FiCalendar, FiClock } from "react-icons/fi"
import { router } from "@inertiajs/react"

export default function CreateForm({ openModal, closeModal }) {
    const { students, events } = usePage().props

    const { data, setData, post, processing, errors, reset } = useForm({
        student_rfid_uid: "",
        time_slot_id: "",
    })

    const [studentSearchTerm, setStudentSearchTerm] = useState("")
    const [timeSlotSearchTerm, setTimeSlotSearchTerm] = useState("")
    const [filteredStudents, setFilteredStudents] = useState([])
    const [filteredTimeSlots, setFilteredTimeSlots] = useState([])
    const [showStudentDropdown, setShowStudentDropdown] = useState(false)
    const [showTimeSlotDropdown, setShowTimeSlotDropdown] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)

    const studentRef = useRef(null)
    const timeSlotRef = useRef(null)

    useEffect(() => {
        if (students?.data) {
            setFilteredStudents(students.data)
        }
        if (events?.data) {
            setFilteredTimeSlots(events.data)
        }
    }, [students, events])

    useEffect(() => {
        if (!students?.data) return

        if (studentSearchTerm.trim() === "") {
            setFilteredStudents(students.data)
        } else {
            const searchTermLower = studentSearchTerm.toLowerCase()
            const filtered = students.data.filter(
                (student) =>
                    (student.first_name && student.first_name.toLowerCase().includes(searchTermLower)) ||
                    (student.last_name && student.last_name.toLowerCase().includes(searchTermLower)) ||
                    (student.middle_name && student.middle_name.toLowerCase().includes(searchTermLower)) ||
                    (student.student_id && student.student_id.toLowerCase().includes(searchTermLower)),
            )
            setFilteredStudents(filtered)
        }
    }, [studentSearchTerm, students])

    useEffect(() => {
        if (!events?.data) return

        if (timeSlotSearchTerm.trim() === "") {
            setFilteredTimeSlots(events.data)
        } else {
            const searchTermLower = timeSlotSearchTerm.toLowerCase()
            const filtered = events.data.filter(
                (timeSlot) =>
                    (timeSlot.id && timeSlot.id.toString().includes(searchTermLower)) ||
                    (timeSlot.event && timeSlot.event.name && timeSlot.event.name.toLowerCase().includes(searchTermLower)) ||
                    (timeSlot.slot_type && timeSlot.slot_type.toLowerCase().includes(searchTermLower)),
            )
            setFilteredTimeSlots(filtered)
        }
    }, [timeSlotSearchTerm, events])

    useEffect(() => {
        function handleClickOutside(event) {
            if (studentRef.current && !studentRef.current.contains(event.target)) {
                setShowStudentDropdown(false)
            }
            if (timeSlotRef.current && !timeSlotRef.current.contains(event.target)) {
                setShowTimeSlotDropdown(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (!openModal) {
            reset()
            setStudentSearchTerm("")
            setTimeSlotSearchTerm("")
            setSelectedStudent(null)
            setSelectedTimeSlot(null)
        }
    }, [openModal, reset])

    const handleStudentSelect = (student) => {
        setData("student_rfid_uid", student.rfid_uid)
        setSelectedStudent(student)
        setStudentSearchTerm(`${student.first_name} ${student.last_name} (${student.student_id})`)
        setShowStudentDropdown(false)
    }

    const handleTimeSlotSelect = (timeSlot) => {
        setData("time_slot_id", timeSlot.id)
        setSelectedTimeSlot(timeSlot)

        const eventName = timeSlot.event?.name || "Unknown Event"
        const slotType = timeSlot.slot_type ? formatTimeSlotType(timeSlot.slot_type) : ""
        const timeRange = formatTimeRange(timeSlot)

        setTimeSlotSearchTerm(`${eventName} - ${slotType} ${timeRange ? `(${timeRange})` : ""}`)
        setShowTimeSlotDropdown(false)
    }

    const formatTimeSlotType = (type) => {
        if (!type) return ""
        return type
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    }

    const formatTimeRange = (timeSlot) => {
        if (!timeSlot) return ""

        const formatTime = (timeString) => {
            if (!timeString) return ""

            if (timeString.includes("T")) {
                const date = new Date(timeString)
                return date.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                })
            }
            return timeString
        }

        const start = formatTime(timeSlot.start)
        const end = formatTime(timeSlot.end)

        if (start && end) {
            return `${start} - ${end}`
        }

        return ""
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

        if (!data.student_rfid_uid) {
            toast.error("Please select a student")
            return
        }

        if (!data.time_slot_id) {
            toast.error("Please select a time slot")
            return
        }

        router.post(route("attendances.store"), data, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Attendance recorded successfully!")
                reset()
                setStudentSearchTerm("")
                setTimeSlotSearchTerm("")
                setSelectedStudent(null)
                setSelectedTimeSlot(null)
                closeModal()
            },
            onError: (errors) => handleErrors(errors),
        })
    }

    return (
        <Modal show={openModal} onClose={closeModal}>
            <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
                    <h2 className="text-lg font-medium text-gray-900">Record Attendance</h2>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full p-1"
                        aria-label="Close"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="student_search" className="block text-sm font-medium text-gray-700">
                            Student <span className="text-red-500">*</span>
                        </label>
                        <div className="relative" ref={studentRef}>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                id="student_search"
                                type="text"
                                value={studentSearchTerm}
                                onChange={(e) => {
                                    setStudentSearchTerm(e.target.value)
                                    setShowStudentDropdown(true)
                                }}
                                onFocus={() => setShowStudentDropdown(true)}
                                className={`block w-full rounded-md border ${errors.student_rfid_uid
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                    } pl-10 pr-3 py-2 shadow-sm sm:text-sm`}
                                placeholder="Search student by name, ID or RFID..."
                            />
                            <input type="hidden" name="student_rfid_uid" value={data.student_rfid_uid} />

                            {showStudentDropdown && (
                                <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-48 rounded-md py-1 text-sm ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                                    {filteredStudents && filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => (
                                            <div
                                                key={student.id}
                                                onClick={() => handleStudentSelect(student)}
                                                className="cursor-pointer px-4 py-2 hover:bg-green-50 flex items-center justify-between"
                                            >
                                                <div>
                                                    <span className="font-medium">
                                                        {student.first_name} {student.middle_name ? `${student.middle_name} ` : ""}
                                                        {student.last_name}
                                                    </span>
                                                    <p className="text-xs text-gray-500">
                                                        ID: {student.student_id} | RFID: {student.rfid_uid}
                                                    </p>
                                                </div>
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                    Year {student.year_level}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-sm text-gray-500">No students found</div>
                                    )}
                                </div>
                            )}
                        </div>
                        {errors.student_rfid_uid && <p className="mt-1 text-xs text-red-500">{errors.student_rfid_uid}</p>}

                        {selectedStudent && (
                            <div className="mt-2 p-2 bg-green-50 rounded-md border border-green-100">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-green-800">
                                            {selectedStudent.first_name} {selectedStudent.last_name}
                                        </p>
                                        <p className="text-xs text-green-600">Student ID: {selectedStudent.student_id}</p>
                                    </div>
                                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                                        Year {selectedStudent.year_level}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="timeslot_search" className="block text-sm font-medium text-gray-700">
                            Event Time Slot <span className="text-red-500">*</span>
                        </label>
                        <div className="relative" ref={timeSlotRef}>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiCalendar className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                id="timeslot_search"
                                type="text"
                                value={timeSlotSearchTerm}
                                onChange={(e) => {
                                    setTimeSlotSearchTerm(e.target.value)
                                    setShowTimeSlotDropdown(true)
                                }}
                                onFocus={() => setShowTimeSlotDropdown(true)}
                                className={`block w-full rounded-md border ${errors.time_slot_id
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                    } pl-10 pr-3 py-2 shadow-sm sm:text-sm`}
                                placeholder="Search event by name or time..."
                            />
                            <input type="hidden" name="time_slot_id" value={data.time_slot_id} />

                            {showTimeSlotDropdown && (
                                <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-48 rounded-md py-1 text-sm ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                                    {filteredTimeSlots && filteredTimeSlots.length > 0 ? (
                                        filteredTimeSlots.map((timeSlot) => (
                                            <div
                                                key={timeSlot.id}
                                                onClick={() => handleTimeSlotSelect(timeSlot)}
                                                className="cursor-pointer px-4 py-2 hover:bg-green-50"
                                            >
                                                <div className="font-medium">{timeSlot.event?.name || "Unknown Event"}</div>
                                                <div className="text-xs text-gray-500 flex justify-between mt-1">
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                        {formatTimeSlotType(timeSlot.slot_type)}
                                                    </span>
                                                    <span className="text-green-600 flex items-center">
                                                        <FiClock className="mr-1 h-3 w-3" />
                                                        {formatTimeRange(timeSlot)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-sm text-gray-500">No time slots found</div>
                                    )}
                                </div>
                            )}
                        </div>
                        {errors.time_slot_id && <p className="mt-1 text-xs text-red-500">{errors.time_slot_id}</p>}

                        {selectedTimeSlot && (
                            <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-100">
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-medium text-blue-800">
                                            {selectedTimeSlot.event?.name || "Unknown Event"}
                                        </p>
                                        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                                            {formatTimeSlotType(selectedTimeSlot.slot_type)}
                                        </span>
                                    </div>
                                    <div className="flex items-center mt-1 text-xs text-blue-600">
                                        <FiClock className="mr-1 h-3 w-3" />
                                        <span>{formatTimeRange(selectedTimeSlot)}</span>
                                        {selectedTimeSlot.event?.date && (
                                            <span className="ml-2">• {new Date(selectedTimeSlot.event.date).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end pt-5 gap-3 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={processing}
                            className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto inline-flex justify-center items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                        >
                            {processing ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Recording...
                                </>
                            ) : (
                                <>
                                    <FiUserCheck className="mr-2 h-4 w-4" />
                                    Record Attendance
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

