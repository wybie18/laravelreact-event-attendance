import { Link } from "@inertiajs/react"

export default function NavLink({ active = false, className = "", children, ...props }) {
    return (
        <Link
            {...props}
            className={
                "w-full inline-flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none " +
                (active
                    ? "text-green-700 bg-green-50 focus:bg-green-50 font-semibold"
                    : "text-gray-600 hover:text-green-700 hover:bg-gray-100 focus:text-green-700 focus:bg-gray-100") +
                " " +
                className
            }
        >
            {children}
        </Link>
    )
}

