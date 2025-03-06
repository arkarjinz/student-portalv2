
import Pagination from "@/components/Pagination";
import Image from "next/image";
import Link from "next/link";

type Announcement = {
  announcementId: number;
  title: string;
  club: string;
  date: string;
  photo?: string;  // Optional photo field for each announcement
};

const columns = [
  {
    header: "Photo",
    accessor: "photo",
  },
  {
    header: "Title",
    accessor: "title",
  },
  {
    header: "Club",
    accessor: "club",
  },
  {
    header: "Date",
    accessor: "date",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const AnnouncementListPage = () => {
  const renderRow = (item: Announcement) => (
    <tr
      key={item.announcementId}
      className="border-b border-gray-200 even:bg-gray-10 text-sm hover:bg-green-50 hover:bg-opacity-10"
    >
      <td className="flex items-center gap-4 p-4">
        {item.photo && (
          <Image
            src={item.photo}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
      </td>
      <td>{item.title}</td>
      <td>{item.club}</td>
      <td className="hidden md:table-cell">{item.date}</td>
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
        <h1 className="hidden md:block text-lg font-semibold text-blue-70">All Announcements</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 self-end">
            
          </div>
        </div>
      </div>
      {/* LIST */}

      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default AnnouncementListPage;
