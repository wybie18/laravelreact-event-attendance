import React, { useState, useRef, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AppLayout from '@/Layouts/AppLayout';
import { FiClock, FiUserCheck, FiAlertCircle, FiLoader, FiUsers, FiCheckCircle} from 'react-icons/fi';

export default function Create() {
    const event = usePage().props.event.data;
    const [rfid, setRfid] = useState('');
    const [timeSlotId, setTimeSlotId] = useState(event.timeSlots[0]?.id || '');
    const [errorMessage, setErrorMessage] = useState('');
    const rfidInputRef = useRef(null);
    const [lastScannedUser, setLastScannedUser] = useState(null);
    const [stats, setStats] = useState({ total: 0, present: 0 });

    const THRESHOLD = 10;
    const [isProcessing, setIsProcessing] = useState(false);
    const [requestQueue, setRequestQueue] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(
                    route('user.attendances.stats', { time_slot_id: timeSlotId })
                );
                if (response.data) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch attendance stats', error);
            }
        };

        if (timeSlotId) {
            fetchStats();
        }
    }, [timeSlotId]);

    useEffect(() => {
        const processQueue = async () => {
            if (!isProcessing && requestQueue.length > 0) {
                setIsProcessing(true);
                const { rfid, timeSlotId } = requestQueue[0];

                try {
                    const response = await axios.post(
                        route('user.attendances.store'),
                        {
                            student_rfid_uid: rfid,
                            time_slot_id: timeSlotId
                        },
                    );

                    // Assuming the response includes student info
                    if (response.data?.student) {
                        setLastScannedUser(response.data.student);
                    }

                    // Update stats after successful attendance
                    setStats(prev => ({
                        ...prev,
                        present: prev.present + 1
                    }));

                    toast.success('Attendance recorded successfully');
                    setErrorMessage('');
                } catch (error) {
                    let message = 'An error occurred. Please try again.';

                    if (error.response) {
                        if (error.response.status === 403) {
                            message = error.response.data?.error || 'Attendance not allowed yet';
                        } else if (error.response.status === 404) {
                            message = 'Student not found with this RFID';
                        } else if (error.response.status === 409) {
                            message = 'Attendance already recorded';
                        }
                    }

                    setErrorMessage(message);
                    toast.error(message);
                } finally {
                    setIsProcessing(false);
                    setRequestQueue(prev => prev.slice(1));
                    setRfid('');
                    if (rfidInputRef.current) {
                        rfidInputRef.current.focus();
                    }
                }
            }
        };

        processQueue();
    }, [isProcessing, requestQueue]);

    const handleRfidChange = (e) => {
        const value = e.target.value;
        setRfid(value);

        if (value.length === THRESHOLD) {
            setRequestQueue(prev => [...prev, { rfid: value, timeSlotId }]);
            setRfid('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (rfid.length === THRESHOLD) {
            setRequestQueue(prev => [...prev, { rfid, timeSlotId }]);
            setRfid('');
        } else if (rfid.length > 0 && rfid.length < THRESHOLD) {
            toast.error(`RFID must be ${THRESHOLD} characters`);
        }
    };

    const handleTimeSlotChange = (e) => {
        const newTimeSlotId = e.target.value;
        setTimeSlotId(newTimeSlotId);

        const fetchStats = async () => {
            try {
                const response = await axios.get(
                    route('user.attendances.stats', { time_slot_id: newTimeSlotId })
                );
                if (response.data) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch attendance stats', error);
            }
        };

        fetchStats();
    };

    useEffect(() => {
        if (rfidInputRef.current) {
            rfidInputRef.current.focus();
        }
    }, []);

    const formatTime = (timeString) => {
        if (!timeString) return "";
        const [hours, minutes] = timeString.split(":");
        const time = new Date();
        time.setHours(Number.parseInt(hours, 10));
        time.setMinutes(Number.parseInt(minutes, 10));
        return time.toLocaleTimeString("en-US", {
            timeZone: 'Asia/Manila',
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <AppLayout>
            <Head title={event.name} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {event.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                <FiUserCheck className="mr-2 text-green-600 dark:text-green-400" size={20} />
                                Attendance Scanner
                            </h2>

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="mb-5">
                                    <label htmlFor="time_slot_id" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Select Time Slot
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="time_slot_id"
                                            name="time_slot_id"
                                            value={timeSlotId}
                                            onChange={handleTimeSlotChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                        >
                                            {event.timeSlots.map((timeSlot) => (
                                                <option key={timeSlot.id} value={timeSlot.id}>
                                                    {timeSlot.slot_type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} ({formatTime(timeSlot.start)} - {formatTime(timeSlot.end)})
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                                            <FiClock size={16} />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="rfid" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        RFID UID
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="student_rfid_uid"
                                            id="rfid"
                                            maxLength={THRESHOLD}
                                            className={`block w-full p-4 text-center text-lg border rounded-lg bg-gray-50 focus:ring-2 focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${errorMessage
                                                    ? 'border-red-500 focus:ring-red-200 dark:border-red-500 dark:focus:ring-red-800'
                                                    : 'border-gray-300 focus:ring-green-200 focus:border-green-500 dark:border-gray-600 dark:focus:ring-green-800 dark:focus:border-green-500'
                                                }`}
                                            placeholder="Scan RFID card"
                                            required
                                            autoFocus
                                            autoComplete="off"
                                            ref={rfidInputRef}
                                            value={rfid}
                                            onChange={handleRfidChange}
                                        />
                                        {isProcessing && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <FiLoader className="animate-spin text-green-600 dark:text-green-400" size={20} />
                                            </div>
                                        )}
                                    </div>

                                    {errorMessage && (
                                        <div className="mt-2 flex items-start text-sm text-red-600 dark:text-red-400">
                                            <FiAlertCircle size={16} className="mr-1 mt-0.5 flex-shrink-0" />
                                            <span>{errorMessage}</span>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                <FiCheckCircle className="mr-2 text-green-600 dark:text-green-400" size={20} />
                                Instructions
                            </h2>
                            <div className="space-y-3 text-gray-700 dark:text-gray-300">
                                <p className="flex items-start">
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mr-2">1</span>
                                    Select the appropriate time slot for attendance
                                </p>
                                <p className="flex items-start">
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mr-2">2</span>
                                    Have student scan their RFID card or enter the ID manually
                                </p>
                                <p className="flex items-start">
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mr-2">3</span>
                                    The system will automatically process attendance once an ID is scanned
                                </p>
                                <p className="flex items-start">
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mr-2">4</span>
                                    Successful attendance will show a confirmation message
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Last Scanned</h3>

                            {lastScannedUser ? (
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-3">
                                        <FiUserCheck size={24} className="text-green-600 dark:text-green-400" />
                                    </div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                        {lastScannedUser.name}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {lastScannedUser.id || "ID: " + lastScannedUser.rfid_uid}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {new Date().toLocaleTimeString()}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                                        <FiUserCheck size={24} className="text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No recent scans
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-green-50 dark:bg-gray-800 border border-green-100 dark:border-green-900 rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                <FiUsers className="mr-2 text-green-600 dark:text-green-400" size={20} />
                                Attendance Stats
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">Present:</span>
                                    <span className="font-medium text-green-600 dark:text-green-400">{stats.present}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">Total Students:</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{stats.total}</span>
                                </div>

                                <div className="relative pt-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold inline-block text-green-600 dark:text-green-400">
                                            {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}% Attendance
                                        </span>
                                    </div>
                                    <div className="overflow-hidden h-2 text-xs flex rounded bg-green-200 dark:bg-green-900">
                                        <div
                                            style={{ width: `${stats.total > 0 ? (stats.present / stats.total) * 100 : 0}%` }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 dark:bg-green-400"
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-green-100 dark:border-green-800">
                                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Current Session</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {event.timeSlots.find(slot => slot.id == timeSlotId)?.slot_type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {formatTime(event.timeSlots.find(slot => slot.id == timeSlotId)?.start)} - {formatTime(event.timeSlots.find(slot => slot.id == timeSlotId)?.end)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}