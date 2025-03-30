import { Link } from "@inertiajs/react";

function mergeUrlWithQuery(url, queryParams) {
    if (!queryParams) return url;
    const filteredParams = { ...queryParams };
    delete filteredParams.page;
    
    const queryString = new URLSearchParams(filteredParams).toString();
    return queryString ? `${url}${url.includes('?') ? '&' : '?'}${queryString}` : url;
}


export default function Pagination({ pagination, queryParams }) {
    const { current_page, from, to, total, links, last_page } = pagination;

    const formatLabel = (label) => {
        return label
            .replace(/&laquo;/, '«')
            .replace(/&raquo;/, '»')
            .replace('Previous', 'Prev')
            .replace('Next', 'Next');
    };
    
    return (
        <div className="flex justify-between items-center px-4 py-3">
            <div className="text-sm text-gray-800">
                Showing <b>{from}-{to}</b> of {total}
            </div>
            
            <div className="flex space-x-1">
                {links.map((link, index) => (
                    <Link
                        preserveScroll
                        key={index}
                        href={link.url ? mergeUrlWithQuery(link.url, queryParams) : "#"}
                        className={`px-3 py-1 text-sm font-normal border rounded transition duration-200 ease ${
                            link.active 
                                ? 'text-white bg-green-600 border-green-600 hover:bg-green-700'
                                : 'text-green-600 bg-white border-green-200 hover:bg-green-50'
                        } ${
                            !link.url ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                        }`}
                        as="button"
                    >
                        <span dangerouslySetInnerHTML={{ __html: formatLabel(link.label) }} />
                    </Link>
                ))}
            </div>
        </div>
    );
}
