'use client';

import { useRouter } from 'next/navigation';
import { register } from '@/service/AuthService';
import Image from "next/image";
import { useState } from "react";

export default function RegisterPage() {
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<string>('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [studentNumber, setStudentNumber] = useState('');
    const [year, setYear] = useState('');
    const [semester, setSemester] = useState('');
    const [errorStudentNumber, setErrorStudentNumber] = useState('');
    const [errorUserName,setErrorUserName] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const registerDto = {
            name,
            username,
            password,
            studentNumber,
            year,
            semester,
            profileImage: userProfile
        };

        register(registerDto)
            .then(() => {
                router.push('/login');
                router.refresh();
            })
            .catch((error) => {
                let msg = error.response.data;
                let errorMessage = msg.match(/"([^"]+)"/)?.[1];
               if(errorMessage ===  'Student number is already taken!'){
                   setErrorStudentNumber(errorMessage);
                   setErrorUserName('');
               }
               else{
                   setErrorUserName(errorMessage)
                   setErrorStudentNumber('');
               }
            });
    };

    const inputClass = "w-full p-2 border rounded-md placeholder:font-light placeholder:text-gray-500";
    const errorClass = "border-red-500";



    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
                {/* Left side */}
                <div className="flex flex-col justify-center p-8 md:p-14">
                    <span className="mb-3 text-4xl font-bold">Create an account</span>
                    <span className="font-light text-gray-400 mb-8">
                        Please fill in the details to create your account
                    </span>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name Field */}
                        <div>
                            <label className="mb-2 text-md block" htmlFor="name">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                className={`${inputClass}  'border-gray-300'}`}
                                required
                            />
                        </div>
                        {/* Username Field */}
                        <div>
                            <label className="mb-2 text-md block" htmlFor="username">
                                Username
                            </label>

                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Choose a username"
                                className={`${inputClass} ${errorUserName ? errorClass : 'border-gray-300'}`}
                                required
                            />
                            {
                                errorUserName && <span className="text-red-500 text-xs">{errorUserName}</span>
                            }
                        </div>
                        {/* Password Field */}
                        <div>
                            <label className="mb-2 text-md block" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a password"
                                className={`${inputClass} 'border-gray-300'}`}
                                required
                            />
                        </div>
                        {/* Student Number Field */}
                        <div>
                            <label className="mb-2 text-md block" htmlFor="studentNumber">
                                Student Number
                            </label>
                            <input
                                type="text"
                                id="studentNumber"
                                value={studentNumber}
                                onChange={(e) => setStudentNumber(e.target.value)}
                                placeholder="Your student ID"
                                className={`${inputClass} ${errorStudentNumber ? errorClass : 'border-gray-300'}`}
                                required
                            />
                            {
                                errorStudentNumber  && <span className="text-red-500 text-xs">{errorStudentNumber}</span>
                            }
                        </div>
                        {/* Profile Image Selection */}
                        <div>
                            <label className="mb-2 text-md block" htmlFor="profileImage">
                                Choose Profile
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                {['duke1.jpg', 'duke2.jpg', 'duke3.jpg'].map((image) => (
                                    <Image
                                        key={image}
                                        src={`/${image}`}
                                        alt={`Thumbnail ${image}`}
                                        width={50}
                                        height={50}
                                        onClick={() => setUserProfile(image)}
                                        style={{ width: '50px', height: '50px' }}
                                        className={`w-full h-auto rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:scale-105 hover:glow ${userProfile === image ? 'border-4 border-[#52681D]' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                        {/* Year Field */}
                        <div>
                            <label className="mb-2 text-md block" htmlFor="year">
                                Year
                            </label>
                            <select
                                id="year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className={`${inputClass} 'border-gray-300'}`}
                                required
                            >
                                <option value="" disabled>
                                    Select Year
                                </option>
                                <option value="1">Year 1</option>
                                <option value="2">Year 2</option>
                                <option value="3">Year 3</option>
                                <option value="4">Year 4</option>
                                <option value="5">Year 5</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 text-md block" htmlFor="semester">
                                Semester
                            </label>
                            <select
                                id="semester"
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                className={`${inputClass}  'border-gray-300'}`}
                                required
                            >
                                <option value="" disabled>
                                    Select Semester
                                </option>
                                <option value="1">Semester 1</option>
                                <option value="2">Semester 2</option>
                            </select>
                        </div>
                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300"
                        >
                            Register
                        </button>
                    </form>
                    <div className="text-center text-gray-400">
                        Already have an account?{' '}
                        <a href="/login" className="font-bold text-black">
                            Log in
                        </a>
                    </div>
                </div>
                {/* Right side */}
                <div className="relative">
                    <img
                        src="/image.jpg"
                        alt="Decorative"
                        className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
                    />
                    {/* Text on Image */}
                    <div className="absolute hidden bottom-10 right-6 p-6 bg-white bg-opacity-30 backdrop-blur-sm rounded drop-shadow-lg md:block">
                        <span className="text-white text-xl">
                            We’ve been using Untitled to kick-start every new project and can’t
                            imagine working without it.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}