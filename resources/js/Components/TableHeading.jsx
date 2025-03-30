import { FaChevronDown, FaChevronUp } from "react-icons/fa";
export default function TableHeading({ fieldName, sortable = false, sortField = null, sortDirection = null, onSortChange = () => { }, children }) {
    const handleClick = () => {
        if (sortable) {
            onSortChange(fieldName);
        }
    };
    return (
        <th onClick={handleClick} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${sortable ? "cursor-pointer hover:bg-slate-100" : "pointer-events-none"}`}>
            <div className="flex items-center justify-between gap-2">
                {children}
                {sortable && (
                    <>
                        {sortDirection === "asc" && sortField === fieldName ? (
                            <FaChevronUp className="shrink-0" />
                        ) : (
                            <FaChevronDown className="shrink-0" />
                        )}
                    </>
                )}
            </div>
        </th>
    );
}