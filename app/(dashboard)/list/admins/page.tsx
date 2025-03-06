
import Image from "next/image";
import Pagination from "@/components/Pagination";

type Teacher = {
  id: number;
  adminId: string;
  name: string;
  email?: string;
  photo: string;
  phone: string;
  address: string;
};

const columns = [
  {
    header: "Photo",
    accessor: "photo",
  },
  {
    header: "Admin ID",
    accessor: "adminId",
    className: "hidden md:table-cell",
  },
  {
    header: "Name",
    accessor: "name",
  },
  {
    header: "Email",
    accessor: "email",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const AdminListPage = () => {
  const renderRow = (item: Teacher) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-gray-10 text-sm hover:bg-green-50 hover:bg-opacity-10"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.photo}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
      </td>
      <td className="hidden md:table-cell">{item.adminId}</td>
      <td>{item.name}</td>
      <td>{item.email}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
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
        <h1 className="hidden md:block text-lg font-semibold text-blue-70">All Admins</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 self-end">
            {/* Any other components or content can go here */}
          </div>
        </div>
      </div>
      {/* LIST */}
      {/*<Table columns={columns} renderRow={renderRow} data={adminsData} />*/}
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default AdminListPage;
