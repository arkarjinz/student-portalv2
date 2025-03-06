'use client'
import {useRouter} from "next/navigation";
import {getLoggedInUerRole} from "@/service/AuthService";
import {useCallback, useEffect} from "react";


const AdminPage = () => {
    const router = useRouter();
    const loggedInUserRole =getLoggedInUerRole();
    const checkLoginStatus = useCallback(() => {

        if (loggedInUserRole.trim() !== 'ROLE_ADMIN') {
            router.replace('/');
            router.refresh();
        }
    }, [router]);

    console.log(loggedInUserRole);

    useEffect(() => {
        checkLoginStatus();
    },[checkLoginStatus])
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">

        </div>       
      </div>
  
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">

      </div>
    </div>
  );
};

export default AdminPage;
