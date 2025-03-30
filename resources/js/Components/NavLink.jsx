import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'w-full inline-flex items-center gap-x-3 rounded-md px-1 py-2 font-semibold leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'text-green-700 bg-gray-200 focus:bg-gray-200'
                    : 'text-gray-500 hover:text-green-700 hover:bg-gray-200 focus:text-green-700 focus:bg-gray-200') +
                className
            }
        >
            {children}
        </Link>
    );
}
