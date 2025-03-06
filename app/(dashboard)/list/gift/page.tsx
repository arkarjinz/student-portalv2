"use client";


import Pagination from "@/components/Pagination";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";


type Student = {
  studentId: number;
  name: string;
  photo: string;
  flower_receive: string;
  flower_own: string;
};

const columns = [
  {
    header: "Photo",
    accessor: "photo",
  },
  {
    header: "Student ID",
    accessor: "studentId",
  },
  {
    header: "Name",
    accessor: "name",
  },
  {
    header: "Flower (Own)",
    accessor: "flower_own",
  },
  {
    header: "Flower (Receive)",
    accessor: "flower_receive",
  },
  {
    header: "Add Flowers",
    accessor: "actions",
  },
];

const GiftListPage = () => {
  const [flowerCount, setFlowerCount] = useState<{ [key: number]: string }>({});

  const handleInputChange = (studentId: number, value: string) => {
    setFlowerCount((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleAddFlower = (studentId: number) => {
    const count = flowerCount[studentId] || "0";
    console.log(`Adding ${count} flowers to student ID ${studentId}`);
  };

  const renderRow = (item: Student) => (
    <tr key={item.studentId} className="border-b border-gray-200 even:bg-gray-10 text-sm hover:bg-green-50 hover:bg-opacity-10">
      <td className="p-4">
        <Image
          src={item.photo}
          alt="Student Photo"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
      </td>
      <td>{item.studentId}</td>
      <td>{item.name}</td>
      <td>{item.flower_own}</td>
      <td>{item.flower_receive}</td>
      <td>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="border rounded-md p-1 w-16"
            value={flowerCount[item.studentId] || ""}
            onChange={(e) => handleInputChange(item.studentId, e.target.value)}
          />
          <button className="p-1.5 rounded-full border-none bg-green-50 text-white hover:bg-green-50 hover:bg-opacity-80">
          <Image src="/gift.svg" alt="Gift" width={20} height={20} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-gray-10 p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold text-blue-70">All Students and Their Flowers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 self-end"></div>
        </div>
      </div>
      {/* LIST */}
      {/*<Table columns={columns} renderRow={renderRow} data={studentsData} />*/}
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default GiftListPage;
