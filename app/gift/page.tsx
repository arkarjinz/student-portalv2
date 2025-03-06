'use client';

import React, { useEffect, useState } from "react";
import { getLoggedInUser, isUserLoggedIn } from "@/service/AuthService";
import { redirect } from "next/navigation";
import { UserDto } from "@/ds/userprofile.dto";
import { getAllUserProfiles } from "@/service/StudentPortalService";
import Image from "next/image";
import { GiCottonFlower, GiRose } from "react-icons/gi";
import { FaSpinner } from "react-icons/fa";
import { giveRoseGift } from "@/service/RoseGiftService";

export default function Gift() {
    const [filteredStudent, setFilteredStudent] = useState<UserDto[]>([]);
    const [allUsers, setAllUsers] = useState<UserDto[]>([]);
    const [flowerCount, setFlowerCount] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [zeroQuantityNotice, setZeroQuantityNotice] = useState(false);

    function getAllUsers() {
        getAllUserProfiles()
            .then((res) => {
                setAllUsers(res.data);
                setFilteredStudent(res.data);
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        if (!isUserLoggedIn()) {
            redirect("/login");
        }
        getAllUsers();
    }, []);

    const searchNameFilterHandler = (name: string) => {
        const filtered = allUsers.filter((user: UserDto) =>
            user.username.toLowerCase().includes(name.toLowerCase())
        );
        setFilteredStudent(filtered);
    };

    const increaseFlowerCount = (username: string) => {
        setLoading((prev) => ({ ...prev, [username]: true }));
        setTimeout(() => {
            setFlowerCount((prev) => ({
                ...prev,
                [username]: (prev[username] || 0) + 1,
            }));
            setLoading((prev) => ({ ...prev, [username]: false }));
        }, 1000);
    };

    const resetFlowerCount = (username: string) => {
        setFlowerCount((prev) => ({ ...prev, [username]: 0 }));
    };

    const sendRoseGiftForUser = async (targetUsername: string) => {
        const sender = getLoggedInUser();
        const giftCount = flowerCount[targetUsername] || 0;
        return giveRoseGift(sender, targetUsername, giftCount)
            .then((res) => {
                getAllUsers();
                return res;
            })
            .catch((err) => console.log(err));
    };

    const handleConfirmSend = () => {
        if (!selectedUser) return;
        sendRoseGiftForUser(selectedUser).then(() => {
            setFlowerCount((prev) => ({ ...prev, [selectedUser]: 0 }));
            setIsSuccess(true);
            setTimeout(() => {
                setShowConfirmation(false);
                setIsSuccess(false);
                setSelectedUser(null);
            }, 2000);
        });
    };

    return (
        <div className="min-h-screen bg-white py-8">
            {/* Top Navigation/Header */}
            <header className="border-b border-gray-200 mb-8">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-gray-800">Gift a Rose</h1>
                    <input
                        type="text"
                        onChange={(e) => searchNameFilterHandler(e.target.value)}
                        placeholder="Search by username..."
                        className="w-full max-w-sm p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 transition"
                    />
                </div>
            </header>

            {/* Users List as a Table */}
            <div className="container mx-auto px-4">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-gray-300">
                        <th className="py-3 px-4 text-gray-700">Profile</th>
                        <th className="py-3 px-4 text-gray-700">Username</th>
                        <th className="py-3 px-4 text-gray-700">Current Roses</th>
                        <th className="py-3 px-4 text-gray-700">Add Gift</th>
                        <th className="py-3 px-4 text-gray-700">Gift Qty</th>
                        <th className="py-3 px-4 text-gray-700">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredStudent.map((user: UserDto) => (
                        <tr
                            key={user.username}
                            className="hover:bg-emerald-50 transition-colors border-b border-gray-200"
                        >
                            <td className="py-4 px-4">
                                <Image
                                    src={`/${user.profileImage}`}
                                    alt={user.username}
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                    unoptimized
                                />
                            </td>
                            <td className="py-4 px-4 text-gray-800 font-medium capitalize">
                                {user.username}
                            </td>
                            <td className="py-4 px-4 flex items-center space-x-2">
                                <GiRose size={22} className="text-red-500" />
                                <span className="font-semibold text-pink-600">{user.roseCount}</span>
                            </td>
                            <td className="py-4 px-4">
                                <button
                                    onClick={() => increaseFlowerCount(user.username)}
                                    disabled={loading[user.username]}
                                    className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-full p-2 transition"
                                >
                                    {loading[user.username] ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        <GiCottonFlower size={22} />
                                    )}
                                </button>
                            </td>
                            <td className="py-4 px-4">
                  <span className="font-medium text-gray-800">
                    {flowerCount[user.username] || 0}
                  </span>
                            </td>
                            <td className="py-4 px-4 space-x-4">
                                <button
                                    onClick={() => {
                                        if ((flowerCount[user.username] || 0) === 0) {
                                            setZeroQuantityNotice(true);
                                            setTimeout(() => setZeroQuantityNotice(false), 2000);
                                            return;
                                        }
                                        setSelectedUser(user.username);
                                        setShowConfirmation(true);
                                    }}
                                    className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded transition"
                                >
                                    Send
                                </button>
                                <button
                                    onClick={() => resetFlowerCount(user.username)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition"
                                >
                                    Reset
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full">
                        {isSuccess ? (
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-green-700 mb-4">Success!</h2>
                                <p className="text-green-600">
                                    Your rose gift has been sent.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-2xl font-bold text-green-700 mb-4">
                                    Confirm Gift
                                </h2>
                                <p className="text-gray-700 mb-6">
                                    Are you sure you want to send a gift to{" "}
                                    <span className="font-bold">{selectedUser}</span>?
                                </p>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => {
                                            setShowConfirmation(false);
                                            setSelectedUser(null);
                                        }}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmSend}
                                        className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded transition"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Zero Quantity Notice */}
            {zeroQuantityNotice && (
                <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg">
                    Gift quantity is zero!
                </div>
            )}
        </div>
    );
}
