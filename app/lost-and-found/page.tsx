'use client'
import React, { useState, useEffect } from 'react';
import { LostAndFoundDto } from '@/ds/lost.and.found.dto';
import { getAllLostAndFound, getStudentIdByStudent } from '@/service/StudentPortalService';
import { createLostAndFound } from "@/service/LostAndFoundService";
import { getLoggedInUser } from "@/service/AuthService";

export default function LostAndFoundPage() {
    const [lostAndFound, setLostAndFound] = useState<LostAndFoundDto[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        title: '',
        description: '',
        isFound: false,
    });
    // To store the selected file
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Function to fetch lost and found items
    const fetchLostAndFound = async () => {
        try {
            const res = await getAllLostAndFound();
            setLostAndFound(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchLostAndFound();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setNewItem(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            console.error("No file selected");
            return;
        }
        try {
            const studentName = getLoggedInUser();
            const response = await getStudentIdByStudent(studentName);
            const studentId = response.data.id;

            // Create FormData for multipart/form-data
            const formData = new FormData();
            formData.append("title", newItem.title);
            formData.append("description", newItem.description);
            formData.append("isFound", String(newItem.isFound));
            formData.append("image", selectedFile);

            // Create new lost and found item
            await createLostAndFound(formData, studentId);
            // Re-fetch lost and found items so the new item shows immediately
            fetchLostAndFound();
            // Close modal
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-blue-700">Lost &amp; Found</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    Add Item
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {lostAndFound && lostAndFound.length > 0 ? (
                    lostAndFound.map(item => (
                        <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="h-48 w-full relative">
                                {item.imageBase64 ? (
                                    <img
                                        src={`data:image/jpeg;base64,${item.imageBase64}`}
                                        alt={item.title}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="bg-gray-200 flex items-center justify-center h-full">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                                <p className="text-gray-600 mb-2">{item.description}</p>
                                <span className={`text-sm font-medium ${item.isFound ? 'text-green-500' : 'text-orange-500'}`}>
                                    {item.isFound ? 'Found' : 'Not Found Yet'}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        No items found.
                    </p>
                )}
            </div>

            {isModalOpen && (
                <>
                    {/* Modal overlay */}
                    <div
                        className="fixed inset-0 bg-gray-500 bg-opacity-50 z-40"
                        onClick={() => setIsModalOpen(false)}
                    ></div>
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                            <h2 className="text-2xl font-bold mb-4">Add Lost &amp; Found Item</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-1" htmlFor="title">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={newItem.title}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1" htmlFor="description">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={newItem.description}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        required
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1" htmlFor="image">
                                        Image
                                    </label>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        onChange={handleFileChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        required
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isFound"
                                        name="isFound"
                                        checked={newItem.isFound}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    <label htmlFor="isFound" className="text-gray-700">
                                        Item has been found
                                    </label>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
