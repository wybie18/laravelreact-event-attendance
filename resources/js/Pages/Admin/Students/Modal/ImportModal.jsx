import { useState } from "react";
import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { FiUpload, FiDownload, FiFile, FiX } from "react-icons/fi";

export default function ImportModal({ openModal, closeModal }) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
    });

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (file) => {
        setData('file', file);
        setSelectedFile(file);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("students.import"), {
            onSuccess: () => {
                toast.success("Students imported successfully!");
                setSelectedFile(null);
                reset();
                closeModal();
            },
            onError: (errors) => {
                toast.error("An error occurred during import.");
                console.error(errors);
            }
        });
    };

    const downloadTemplate = () => {
        window.location.href = route('excel.template');
    };

    const clearFileSelection = () => {
        setSelectedFile(null);
    };

    return (
        <Modal show={openModal} onClose={closeModal}>
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
                    <h2 className="text-lg font-medium text-gray-900">Import Students</h2>
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
                    <div>
                        <p className="text-sm text-gray-600 mb-4">
                            Upload an Excel file (.xlsx or .xls) with student data. Make sure your file follows the template format.
                        </p>

                        <button
                            type="button"
                            onClick={downloadTemplate}
                            className="inline-flex items-center rounded-md border border-green-600 bg-white px-4 py-2 text-sm font-medium text-green-600 shadow-sm hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors w-full justify-center mb-4"
                        >
                            <FiDownload className="mr-2 h-4 w-4" />
                            Download Template
                        </button>

                        {!selectedFile ? (
                            <div
                                className={`border-2 border-dashed ${dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'} rounded-lg p-6 text-center`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <FiUpload className="h-10 w-10 text-gray-400 mb-3" />
                                    <p className="text-gray-600 mb-1">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Excel files only (.xlsx, .xls)
                                    </p>
                                    <input
                                        id="fileInput"
                                        type="file"
                                        className="hidden"
                                        accept=".csv,.xlsx,.xls"
                                        onChange={handleFileChange}
                                    />
                                    <button
                                        onClick={() => document.getElementById('fileInput').click()}
                                        type="button"
                                        className="mt-4 inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                    >
                                        Select File
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="bg-green-100 rounded-full p-2 mr-3">
                                            <FiFile className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 truncate" title={selectedFile.name}>
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {(selectedFile.size / 1024).toFixed(2)} KB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={clearFileSelection}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                        <FiX className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        )}
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
                            onClick={handleSubmit}
                            disabled={processing || !selectedFile}
                            className={`w-full sm:w-auto inline-flex justify-center items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${selectedFile ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-gray-400 cursor-not-allowed'}`}
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
                                    Importing...
                                </>
                            ) : (
                                "Import Students"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}