import axios from "axios";
import {getToken} from "@/service/AuthService";
import {LostAndFoundDto} from "@/ds/lost.and.found.dto";


axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.headers["Authorization"]=getToken();
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

const LOST_AND_FOUND_URI = "http://localhost:8080/api/student-portal/lost-and-found";


export const createLostAndFound = (lostAndFoundDto:LostAndFoundDto,id:number) =>
    axios.post(`${LOST_AND_FOUND_URI}/${id}`,lostAndFoundDto);
