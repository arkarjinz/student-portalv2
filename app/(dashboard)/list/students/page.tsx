
import Pagination from "@/components/Pagination";

import Image from "next/image";


type Student = {
  id: number;
  studentId: string;
  name: string;
  photo: string;
  year: number;
  semester: string;
  club: string;
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
    header: "Year",
    accessor: "year",
  },
  {
    header: "Semester",
    accessor: "semester",
  },
  {
    header: "Club Participation",
    accessor: "club",
  },
];

const StudentListPage = () => {
  const renderRow = (item: Student) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-gray-10 text-sm hover:bg-green-50 hover:bg-opacity-10">
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
      <td>{item.year}</td>
      <td>{item.semester}</td>
      <td>{item.club}</td>
      <td>
        <div className="flex items-center gap-2">

        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-gray-10 p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold text-blue-70">All Students</h1> {/* Text color adjusted */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 self-end">

          </div>
        </div>
      </div>

        <h1>All Students==========================================</h1>
      <Pagination />
    </div>
  );
};

export default StudentListPage;
