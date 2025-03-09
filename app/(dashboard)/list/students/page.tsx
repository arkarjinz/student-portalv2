'use client'
import { useEffect, useState } from "react";
import { getAllStudents } from "@/service/StudentPortalService";
import { StudentDto } from "@/ds/student.dto";
import Image from "next/image";

export default function StudentListPage() {
    const [studentData, setStudentData] = useState<StudentDto[]>([]);

    useEffect(() => {
        getAllStudents()
            .then(res => setStudentData(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className="p-8 max-w-6xl mx-auto min-h-screen">
            <h1 className="text-3xl font-bold text-gray-700 mb-6">Student Directory</h1>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-[#f0f4f3]">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Avatar</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Username</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Year</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student Number</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Semester</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Roses</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                    {studentData.map((student) => (
                        <tr key={student.id} className="hover:bg-[#fafcfb] transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    {student.profileImage ? (
                                        <div className="relative w-12 h-12">
                                            <Image
                                                src={`/${student.profileImage}`}
                                                alt={student.name || 'Student avatar'}
                                                fill
                                                sizes="(max-width: 768px) 48px, 48px"
                                                className="rounded-full object-cover border-2 border-white shadow-md"
                                                unoptimized
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-[#e0ece9] flex items-center justify-center">
                        <span className="text-[#2a6155] font-medium text-lg">
                          {student.name?.charAt(0) || student.username.charAt(0)}
                        </span>
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                {student.name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                @{student.username}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600 font-medium">
                                {student.year}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.studentNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600 font-medium">
                                {student.semester}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600 font-medium">
                                <div className="flex items-center justify-center space-x-1.5">
                                    <svg
                                        className="w-5 h-5 text-[#d74b64]"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 015.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-[#2a6155] font-medium">{student.roseCount}</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {studentData.length === 0 && (
                    <div className="text-center py-8 bg-gray-50">
                        <p className="text-gray-500">No student records found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
