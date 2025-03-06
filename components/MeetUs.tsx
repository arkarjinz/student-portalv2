'use client'
import {useEffect, useState} from "react";
import Image from "next/image";
import {motion} from "framer-motion";
import {fadeIn} from "@/variant";

const MeetUs = () => {
    const meetus = [
        {
            quote:
                "Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver.",
            name: "Arkar Moe",
            title: "Fullstack",
            image: "/chillguy.png",
        },
        {
            quote:
                "Money makes your life easier. If you're lucky to have it, you're lucky.",
            name: "Steve Mark",
            title: "Founder & Leader",
            image: "/user2.png",
        },
        {
            quote:
                "It is usually people in the money business, finance, and international trade that are really rich.",
            name: "Kenn Gallagher",
            title: "Founder & Leader",
            image: "/user3.png",
        },
        {
            quote: "Success is not the key to happiness. Happiness is the key to success.",
            name: "Linda Doe",
            title: "Entrepreneur",
            image: "/user4.png",
        },
        {
            quote: "Strive not to be a success, but rather to be of value.",
            name: "Alan Smith",
            title: "Business Coach",
            image: "/user5.png",
        },
    ];

    const [startIndex, setStartIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStartIndex((prevIndex) => (prevIndex + 1) % meetus.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [meetus.length]);

    const visibleTestimonials = [
        meetus[startIndex],
        meetus[(startIndex + 1) % meetus.length],
        meetus[(startIndex + 2) % meetus.length],
    ];

    return (
        <motion.section className="bg-white py-16 px-6 "
                         variants={fadeIn('down', 0.3)} initial="hidden" whileInView={'show'} viewport={{once: false, amount: 0.2}}>
            <div className=" max-container padding-container">
                <h2 className="bold-20 lg:bold-32 mt-5 text-center mb-6 text-gray-900">
                    Meet Our Team
                </h2>
                <p className="regular-16 text-center text-gray-600 mb-12">
                    Discover the talented individuals who make it all happen.
                </p>

                <div className="flex justify-center gap-6 overflow-hidden">
                    {visibleTestimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-green-100 rounded-lg shadow-lg w-[300px] flex-shrink-0 flex flex-col items-center p-6"
                            style={{
                                animation: "slideIn 1s ease-in-out",
                            }}
                        >
                            <Image
                                src={testimonial.image}
                                alt={testimonial.name}
                                width={100}
                                height={100}
                                className="rounded-full mb-4"
                            />
                            <div className="text-center">
                                <h4 className="bold-16 text-green-700 mb-2">{testimonial.name}</h4>
                                <p className="regular-14 text-gray-600 mb-4">{testimonial.title}</p>
                                <p className="italic text-green-800">"{testimonial.quote}"</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </motion.section>
    );
};

export default MeetUs;
