import axios from "axios";
import { getToken } from "@/service/AuthService";
import { Post } from "@/ds/post.dto";

// Add token to each request
axios.interceptors.request.use(
    (config) => {
        config.headers["Authorization"] = getToken();
        return config;
    },
    (error) => Promise.reject(error)
);

const POST_BACKEND_URL = "http://localhost:8080/api/student-portal/post";

export const createPost = (postDto: Post) =>
    axios.post(`${POST_BACKEND_URL}`, postDto);

export const deletePost = (postId: number, postOwner: string) =>
    axios.delete(`${POST_BACKEND_URL}/${postId}?postOwner=${postOwner}`);

export const updatePost = (postId: number, postOwner: string, newContent: string) =>
    axios.put(`${POST_BACKEND_URL}/${postId}?postOwner=${postOwner}`, { content: newContent });
