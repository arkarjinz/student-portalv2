'use client'


import {useEffect, useState} from "react";
import {UserDto} from "@/ds/userprofile.dto";
import {getAllUserProfiles} from "@/service/StudentPortalService";

export default function UserProfile() {
    const [username, setUsername] = useState<string>('');
    const [userDtos,setUserDtos] = useState<UserDto[]>([]);

    useEffect(() => {
        getAllUserProfiles()
            .then(res => setUserDtos(res.data))
            .catch(e => console.log(e))

    }, []);

    console.log(userDtos);


    return (
        <>
        </>
    )
}