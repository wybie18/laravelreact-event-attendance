import Modal from "@/Components/Modal"
import { useForm } from "@inertiajs/react"
import toast from "react-hot-toast"
import { FaExclamationTriangle } from "react-icons/fa"

export default function DeleteForm({ openModal, closeModal, student }) {
    const { delete: destroy, processing, reset } = useForm()

    const handleDelete = (e) => {
        e.preventDefault()

        destroy(route("students.destroy", student?.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Student deleted successfully!")
                reset()
                closeModal()
            },
            onError: (errors) => {
                toast.error("An error occurred while deleting the student.")
                console.error(errors)
            },
        })
    }

    return (
        <Modal show={openModal} onClose={closeModal}>
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
                    <h2 className="text-lg font-medium text-gray-900">Delete Student</h2>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full p-1"
                        aria-label="Close"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-4">
                        <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
                            <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="text-sm text-gray-600">
                            <p className="mb-2">
                                Are you sure you want to delete this student:
                                <span className="font-semibold text-gray-800 block sm:inline sm:ml-1">
                                    {student?.first_name} {student?.last_name}
                                </span>
                                ?
                            </p>
                            <p className="text-red-600 font-medium">This action cannot be undone.</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={processing}
                            className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={processing}
                            className="w-full sm:w-auto inline-flex justify-center items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
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
                                    Deleting...
                                </>
                            ) : (
                                "Delete Student"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

