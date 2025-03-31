import Modal from "@/Components/Modal"
import { useForm } from "@inertiajs/react"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { FiX } from "react-icons/fi"

export default function EditForm({ openModal, closeModal, semester }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: "",
        start: "",
        end: "",
        active: false,
    })

    useEffect(() => {
        if (semester) {
            setData({
                name: semester.name || "",
                start: semester.start || "",
                end: semester.end || "",
                active: semester.active || false,
            })
        }
    }, [semester])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setData(name, type === "checkbox" ? checked : value)
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

        if (!semester) return

        put(route("semesters.update", semester.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Semester updated successfully!")
                closeModal()
            },
            onError: (errors) => handleErrors(errors),
        })
    }

    return (
        <Modal show={openModal} onClose={closeModal}>
            <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
                    <h2 className="text-lg font-medium text-gray-900">Edit Semester</h2>
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
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Semester Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={data.name}
                            onChange={handleChange}
                            className={`block w-full rounded-md border ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-green-500 focus:ring-green-500"} px-3 py-2 shadow-sm sm:text-sm`}
                            placeholder="e.g. Fall 2023"
                            required
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="start" className="block text-sm font-medium text-gray-700">
                            Start Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="start"
                            name="start"
                            type="date"
                            value={data.start}
                            onChange={handleChange}
                            className={`block w-full rounded-md border ${errors.start ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-green-500 focus:ring-green-500"} px-3 py-2 shadow-sm sm:text-sm`}
                            required
                        />
                        {errors.start && <p className="mt-1 text-xs text-red-500">{errors.start}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="end" className="block text-sm font-medium text-gray-700">
                            End Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="end"
                            name="end"
                            type="date"
                            value={data.end}
                            onChange={handleChange}
                            className={`block w-full rounded-md border ${errors.end ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-green-500 focus:ring-green-500"} px-3 py-2 shadow-sm sm:text-sm`}
                            required
                        />
                        {errors.end && <p className="mt-1 text-xs text-red-500">{errors.end}</p>}
                    </div>

                    <div className="flex items-center">
                        <input
                            id="active"
                            name="active"
                            type="checkbox"
                            checked={data.active}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <label htmlFor="active" className="ml-2 block text-sm font-medium text-gray-700">
                            Set as active semester
                        </label>
                    </div>
                    {errors.active && <p className="mt-1 text-xs text-red-500">{errors.active}</p>}

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
                                    Updating...
                                </>
                            ) : (
                                "Update Semester"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

