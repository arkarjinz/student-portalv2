
import Pagination from "@/components/Pagination";

import Image from "next/image";
import Link from "next/link";

type Student = {
  id: number;
  clubId: string;
  name: string;
  photo: string;
  member: number;
};

const columns = [
  {
    header: "Photo",
    accessor: "photo",
  },
  {
    header: "Club ID",
    accessor: "clubId",
  },
  {
    header: "Name",
    accessor: "name",
  },
  {
    header: "Member",
    accessor: "member",
  },
];

const ClubListPage = () => {
  const renderRow = (item: Student) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-gray-10 text-sm hover:bg-green-50 hover:bg-opacity-10">
      <td className="p-4">
        <Image
          src={item.photo}
          alt="Club Photo"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
      </td>
      <td>{item.clubId}</td>
      <td>{item.name}</td>
      <td>{item.member}</td>
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
        <h1 className="hidden md:block text-lg font-semibold text-blue-70">All Clubs</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 self-end">
            
          </div>
        </div>
      </div>
      {/* LIST */}
      {/*<Table columns={columns} renderRow={renderRow} data={clubsData} />*/}
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default ClubListPage;
