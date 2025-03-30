import { Head, useForm, Link } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { FaArrowLeft, FaUserPlus } from "react-icons/fa"
import toast from "react-hot-toast"

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
            let delay = 0;
            for (const key in errors) {
                if (errors.hasOwnProperty(key)) {
                    setTimeout(() => {
                        toast.error(errors[key]);
                    }, delay);
                }
                delay += 150;
            }
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("students.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success("Student successfully added!");
            },
            onError: (errors) => handleErrors(errors),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add New Student" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
                        <div className="bg-green-600 p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <h1 className="text-xl font-bold text-white sm:text-2xl">
                                    Add New Student
                                </h1>
                                <Link
                                    href={route("students.index")}
                                    className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-green-600 transition hover:bg-green-50"
                                >
                                    <FaArrowLeft className="text-xs" />
                                    <span>Back to List</span>
                                </Link>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6">
                            <form onSubmit={onSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* RFID UID */}
                                    <div>
                                        <label htmlFor="rfid_uid" className="block text-sm font-medium text-gray-700">
                                            RFID UID
                                        </label>
                                        <input
                                            type="text"
                                            id="rfid_uid"
                                            name="rfid_uid"
                                            value={data.rfid_uid}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${errors.rfid_uid ? "border-red-500" : ""
                                                }`}
                                            placeholder="Enter RFID UID"
                                        />
                                        {errors.rfid_uid && (
                                            <p className="mt-1 text-xs text-red-500">{errors.rfid_uid}</p>
                                        )}
                                    </div>

                                    {/* Student ID */}
                                    <div>
                                        <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">
                                            Student ID
                                        </label>
                                        <input
                                            type="text"
                                            id="student_id"
                                            name="student_id"
                                            value={data.student_id}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${errors.student_id ? "border-red-500" : ""
                                                }`}
                                            placeholder="Enter Student ID"
                                        />
                                        {errors.student_id && (
                                            <p className="mt-1 text-xs text-red-500">{errors.student_id}</p>
                                        )}
                                    </div>

                                    {/* First Name */}
                                    <div>
                                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="first_name"
                                            name="first_name"
                                            value={data.first_name}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${errors.first_name ? "border-red-500" : ""
                                                }`}
                                            placeholder="Enter First Name"
                                        />
                                        {errors.first_name && (
                                            <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>
                                        )}
                                    </div>

                                    {/* Middle Name */}
                                    <div>
                                        <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700">
                                            Middle Name (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            id="middle_name"
                                            name="middle_name"
                                            value={data.middle_name}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${errors.middle_name ? "border-red-500" : ""
                                                }`}
                                            placeholder="Enter Middle Name"
                                        />
                                        {errors.middle_name && (
                                            <p className="mt-1 text-xs text-red-500">{errors.middle_name}</p>
                                        )}
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="last_name"
                                            name="last_name"
                                            value={data.last_name}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${errors.last_name ? "border-red-500" : ""
                                                }`}
                                            placeholder="Enter Last Name"
                                        />
                                        {errors.last_name && (
                                            <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={data.email}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${errors.email ? "border-red-500" : ""
                                                }`}
                                            placeholder="Enter Email Address"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Year Level */}
                                    <div>
                                        <label htmlFor="year_level" className="block text-sm font-medium text-gray-700">
                                            Year Level
                                        </label>
                                        <select
                                            id="year_level"
                                            name="year_level"
                                            value={data.year_level}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${errors.year_level ? "border-red-500" : ""
                                                }`}
                                        >
                                            <option value="">Select Year Level</option>
                                            <option value="1">First Year</option>
                                            <option value="2">Second Year</option>
                                            <option value="3">Third Year</option>
                                            <option value="4">Fourth Year</option>
                                        </select>
                                        {errors.year_level && (
                                            <p className="mt-1 text-xs text-red-500">{errors.year_level}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="button"
                                        onClick={() => reset()}
                                        className="mr-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                        disabled={processing}
                                    >
                                        Clear Form
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                        disabled={processing}
                                    >
                                        <FaUserPlus className="-ml-1 mr-2" />
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