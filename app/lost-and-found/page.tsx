'use client'
import React, { useState, useEffect } from 'react'
import { LostAndFoundDto } from '@/ds/lost.and.found.dto'
import {getAllLostAndFound, getStudentIdByStudent} from '@/service/StudentPortalService'
import Image from 'next/image'
import {createLostAndFound} from "@/service/LostAndFoundService";
import {getLoggedInUser} from "@/service/AuthService";
/*
 record LostAndFoundRequest(String title,
                               String description,
                               String image,
                               boolean isFound){}
 */
export default function LostAndFoundPage() {
    const [lostAndFound, setLostAndFound] = useState<LostAndFoundDto[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newItem, setNewItem] = useState({
        title: '',
        description: '',
        image:'',
        isFound: false,
    })

    useEffect(() => {
        getAllLostAndFound()
            .then(res => setLostAndFound(res.data))
            .catch(err => console.error(err))
    }, [])

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement
        setNewItem(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))

    }

    console.log(lostAndFound);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setNewItem(prev => ({
                ...prev,
                image: e.target.value,
            }))
    }

    const handleSubmit =async (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Implement submission logic (upload image & send form data)

        console.log(newItem);
        const studentName = getLoggedInUser();
        const lostAndFoundDto:LostAndFoundDto={
            title:newItem.title,
            description:newItem.description,
            image:newItem.image,
            isFound:newItem.isFound,
        }
       // console.log(lostAndFoundDto);
        const response=await getStudentIdByStudent(studentName);

        createLostAndFound(lostAndFoundDto,response.data.id)
            .then(res => console.log(res))
            .catch(err => console.log(err));
        setIsModalOpen(false)
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-blue-70">Lost &amp; Found</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-50 text-white px-4 py-2 rounded hover:bg-green-90 transition"
                >
                    Add Item
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {lostAndFound && lostAndFound.length > 0 ? (
                    lostAndFound.map(item => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden"
                        >
                            <div className="h-48 w-full relative">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="bg-gray-10 flex items-center justify-center h-full">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                                <p className="text-gray-50 mb-2">{item.description}</p>
                                <span
                                    className={`text-sm font-medium ${
                                        item.isFound ? 'text-green-50' : 'text-orange-50'
                                    }`}
                                >
                  {item.isFound ? 'Found' : 'Not Found Yet'}
                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-30">
                        No items found.
                    </p>
                )}
            </div>

            {/* Modal for adding a new item */}
            {isModalOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-gray-10 bg-opacity-50 z-40"
                        onClick={() => setIsModalOpen(false)}
                    ></div>
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                            <h2 className="text-2xl font-bold mb-4">Add Lost &amp; Found Item</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-50 mb-1" htmlFor="title">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={newItem.title}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-20 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-50 mb-1" htmlFor="description">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={newItem.description}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-20 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-50"
                                        required
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-gray-50 mb-1" htmlFor="image">
                                        Image
                                    </label>
                                    <input
                                        type="text"
                                        value={newItem.image}
                                        onChange={handleImageChange}
                                        className="w-full border border-gray-20 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-50"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="found"
                                        name="found"
                                        checked={newItem.isFound}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    <label htmlFor="found" className="text-gray-50">
                                        Item has been found
                                    </label>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-30 text-white px-4 py-2 rounded hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-50 text-white px-4 py-2 rounded hover:bg-green-90 transition"
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
    )
}
