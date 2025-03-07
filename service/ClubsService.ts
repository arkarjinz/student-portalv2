import axios from "axios";
import { ClubInfo } from "@/ds/clubinfo.dto";
import { StudentDto } from "@/ds/student.dto";

const CLUB_URI = "http://localhost:8080/api/club";

export const getClubInfo = () =>
    axios.get<ClubInfo[]>(`${CLUB_URI}/club-info`);

export const getAllClubs = () =>
    axios.get<ClubInfo[]>(`${CLUB_URI}/`);

export const getClubMembers = (clubName: string) =>
    axios.get<StudentDto[]>(`${CLUB_URI}/members/${clubName}`);

// For joining a club
export const joinClub = (clubName: string, studentName: string, studentNumber: string) =>
    axios.post(`${CLUB_URI}/join`, {
        club_name: clubName,
        student_name: studentName,
        student_number: studentNumber,
    });

// For quitting a club
export const quitClub = (clubName: string, studentName: string) =>
    axios.post(`${CLUB_URI}/quit`, {
        club_name: clubName,
        student_name: studentName,
    });

// For creating a club (admin only)
export const createClub = (clubName: string, description: string, clubImage: string) =>
    axios.post(`${CLUB_URI}/create`, { clubName, description, clubImage });

// For updating a club (admin only)
export const updateClub = (clubName: string, newDescription: string, newClubImage: string) =>
    axios.put(`${CLUB_URI}/update/${clubName}`, { newDescription, newClubImage });

// For deleting a club (admin only)
export const deleteClub = (clubName: string) =>
    axios.delete(`${CLUB_URI}/delete/${clubName}`);
