




import {getToken} from "@/service/AuthService";
import {Post} from "@/ds/post.dto";
import {LostAndFoundDto} from "@/ds/lost.and.found.dto";
import {UserDto} from "@/ds/userprofile.dto";
import axios from "axios";

axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.headers["Authorization"]=getToken();
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

const STUDENT_PORTAL_URI = "http://localhost:8080/api/student-portal";

export const getAllStudents =  () =>
    axios.get(`${STUDENT_PORTAL_URI}/students`);
//http://localhost:8080/api/student-portal/id/name
export const getStudentIdByStudent = (username: string) =>
    axios.get(`${STUDENT_PORTAL_URI}/id/${username}`);

export const getAllPosts = () =>
    axios.get<Post[]>(`${STUDENT_PORTAL_URI}/posts`);

export const getAllLostAndFound = () => axios.get<LostAndFoundDto[]>(`${STUDENT_PORTAL_URI}/lost-and-found`);

export const getAllUserProfiles = () =>
    axios.get<UserDto[]>(`${STUDENT_PORTAL_URI}/students`);

export const getStudentByUsername = (username: string) => axios.get<UserDto>(`${STUDENT_PORTAL_URI}/student/${username}`);

export const getProfileImageByStudentUserName = (username:string) => axios.get(`${STUDENT_PORTAL_URI}/profile-image/${username}`);