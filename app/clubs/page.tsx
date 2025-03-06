'use client';
import React, { useEffect, useState } from "react";
import { ClubInfo } from "@/ds/clubinfo.dto";
import { StudentDto } from "@/ds/student.dto";
import {
    getAllClubs,
    getClubMembers,
    joinClub,
    quitClub,
    updateClub,
    deleteClub,
    createClub,
} from "@/service/ClubsService";
import { getLoggedInUerRole, getLoggedInUser, getLoggedInUserTnt } from "@/service/AuthService";

export default function Clubs() {
    const [clubs, setClubs] = useState<ClubInfo[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [updateMode, setUpdateMode] = useState(false);
    const [createMode, setCreateMode] = useState(false);
    const [selectedClub, setSelectedClub] = useState<ClubInfo | null>(null);

    // Update mode states (admin)
    const [updateDescription, setUpdateDescription] = useState("");
    const [updateClubImage, setUpdateClubImage] = useState("");

    // Create mode states (admin)
    const [createClubName, setCreateClubName] = useState("");
    const [createDescription, setCreateDescription] = useState("");
    const [createClubImage, setCreateClubImage] = useState("");

    const [members, setMembers] = useState<StudentDto[]>([]);
    const [showMembers, setShowMembers] = useState(false);
    // Instead of one global hasJoined, we maintain a list of club names the student has joined.
    const [joinedClubNames, setJoinedClubNames] = useState<string[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);

    // Determine logged-in user's role on mount
    useEffect(() => {
        const role = getLoggedInUerRole();
        setIsAdmin(role?.trim() === "ROLE_ADMIN");
    }, []);

    // Fetch all clubs on mount
    useEffect(() => {
        fetchAllClubs();
    }, []);

    const fetchAllClubs = () => {
        getAllClubs()
            .then((res) => setClubs(res.data))
            .catch((err) => console.error(err));
    };

    // When opening the join modal for a club, check if the student is a member.
    const openJoinModal = (club: ClubInfo) => {
        setSelectedClub(club);
        setModalIsOpen(true);
        setUpdateMode(false);
        setCreateMode(false);
        const username = getLoggedInUser();
        getClubMembers(club.clubName)
            .then((res) => {
                const clubMembers: StudentDto[] = res.data;
                const alreadyJoined = clubMembers.some((m) => m.username === username);
                if (alreadyJoined && !joinedClubNames.includes(club.clubName)) {
                    setJoinedClubNames((prev) => [...prev, club.clubName]);
                }
            })
            .catch((err) => console.error(err));
    };

    // Open update modal (admin)
    const openUpdateModal = (club: ClubInfo) => {
        setSelectedClub(club);
        setUpdateDescription(club.description);
        setUpdateClubImage(club.clubImage);
        setModalIsOpen(true);
        setUpdateMode(true);
        setCreateMode(false);
    };

    // Open create modal (admin)
    const openCreateModal = () => {
        setSelectedClub(null);
        setCreateClubName("");
        setCreateDescription("");
        setCreateClubImage("");
        setModalIsOpen(true);
        setCreateMode(true);
        setUpdateMode(false);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedClub(null);
        setUpdateDescription("");
        setUpdateClubImage("");
        setCreateClubName("");
        setCreateDescription("");
        setCreateClubImage("");
        setShowMembers(false);
        setMembers([]);
        setCreateMode(false);
        setUpdateMode(false);
    };

    // Join handler: automatically uses logged-in user's details.
    const handleJoin = () => {
        if (selectedClub) {
            const username = getLoggedInUser();
            const studentTnt = getLoggedInUserTnt();
            joinClub(selectedClub.clubName, username, studentTnt)
                .then((res) => {
                    if (res.data === "already joined") {
                        alert("You have already joined this club.");
                    } else {
                        alert("Joined successfully");
                        setJoinedClubNames((prev) => [...prev, selectedClub.clubName]);
                        fetchAllClubs();
                    }
                })
                .catch((err) => console.error(err));
        }
    };

    // Quit handler: remove membership
    const handleQuit = () => {
        if (selectedClub) {
            const username = getLoggedInUser();
            quitClub(selectedClub.clubName, username)
                .then((res) => {
                    if (res.data === "not a member") {
                        alert("You are not a member of this club.");
                    } else {
                        alert("Quit club successfully");
                        setJoinedClubNames((prev) =>
                            prev.filter((clubName) => clubName !== selectedClub.clubName)
                        );
                        fetchAllClubs();
                    }
                })
                .catch((err) => console.error(err));
        }
    };

    const handleUpdate = () => {
        if (selectedClub) {
            updateClub(selectedClub.clubName, updateDescription, updateClubImage)
                .then(() => {
                    alert("Club updated successfully");
                    closeModal();
                    fetchAllClubs();
                })
                .catch((err) => console.error(err));
        }
    };

    const handleDelete = () => {
        if (selectedClub && confirm(`Are you sure you want to delete ${selectedClub.clubName}?`)) {
            deleteClub(selectedClub.clubName)
                .then(() => {
                    alert("Club deleted successfully");
                    fetchAllClubs();
                })
                .catch((err) => console.error(err));
        }
    };

    const handleCreate = () => {
        createClub(createClubName, createDescription, createClubImage)
            .then(() => {
                alert("Club created successfully");
                closeModal();
                fetchAllClubs();
            })
            .catch((err) => console.error(err));
    };

    const fetchMembers = () => {
        if (selectedClub) {
            getClubMembers(selectedClub.clubName)
                .then((res) => {
                    setMembers(res.data);
                    setShowMembers(true);
                })
                .catch((err) => console.error(err));
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Clubs</h1>
            {isAdmin && (
                <div className="mb-4">
                    <button
                        className="bg-purple-600 text-white px-4 py-2 rounded"
                        onClick={openCreateModal}
                    >
                        Create Club
                    </button>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clubs.map((club) => (
                    <div key={club.clubName} className="relative border rounded p-4 shadow">
                        <img
                            src={club.clubImage || "/defaultClub.png"}
                            alt={club.clubName}
                            className="w-full h-32 object-cover rounded mb-2"
                        />
                        <h2 className="text-xl font-semibold">{club.clubName}</h2>
                        <p className="text-gray-600">{club.description}</p>
                        <p>Total Members: {club.studentCount}</p>
                        {/* Show "Joined" badge only if the club is in the joinedClubNames set */}
                        {joinedClubNames.includes(club.clubName) && (
                            <span className="absolute top-2 right-2 text-xs bg-green-200 text-green-800 px-1 rounded">
                Joined
              </span>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded"
                                onClick={() => openJoinModal(club)}
                            >
                                {joinedClubNames.includes(club.clubName) ? "Join / Quit" : "Join / Quit"}
                            </button>
                            {isAdmin && (
                                <>
                                    <button
                                        className="bg-blue-600 text-white px-4 py-2 rounded"
                                        onClick={() => openUpdateModal(club)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="bg-red-600 text-white px-4 py-2 rounded"
                                        onClick={() => handleDelete()}
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {modalIsOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {createMode ? (
                            // Create Mode (admin)
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Create New Club</h2>
                                <form className="mt-4 space-y-4">
                                    <div>
                                        <label className="block mb-1">Club Name:</label>
                                        <input
                                            type="text"
                                            value={createClubName}
                                            onChange={(e) => setCreateClubName(e.target.value)}
                                            className="border p-2 rounded w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Description:</label>
                                        <textarea
                                            value={createDescription}
                                            onChange={(e) => setCreateDescription(e.target.value)}
                                            className="border p-2 rounded w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Club Image URL:</label>
                                        <input
                                            type="text"
                                            value={createClubImage}
                                            onChange={(e) => setCreateClubImage(e.target.value)}
                                            className="border p-2 rounded w-full"
                                        />
                                    </div>
                                </form>
                                <div className="mt-4 flex gap-4">
                                    <button
                                        onClick={handleCreate}
                                        className="bg-purple-600 text-white px-4 py-2 rounded"
                                    >
                                        Create Club
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="bg-red-600 text-white px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : updateMode && selectedClub ? (
                            // Update Mode (admin)
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Update Club</h2>
                                <form className="mt-4 space-y-4">
                                    <div>
                                        <label className="block mb-1">New Description:</label>
                                        <textarea
                                            value={updateDescription}
                                            onChange={(e) => setUpdateDescription(e.target.value)}
                                            className="border p-2 rounded w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">New Club Image URL:</label>
                                        <input
                                            type="text"
                                            value={updateClubImage}
                                            onChange={(e) => setUpdateClubImage(e.target.value)}
                                            className="border p-2 rounded w-full"
                                        />
                                    </div>
                                </form>
                                <div className="mt-4 flex gap-4">
                                    <button
                                        onClick={handleUpdate}
                                        className="bg-blue-600 text-white px-4 py-2 rounded"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="bg-red-600 text-white px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Join / Quit Mode: Confirmation using logged-in user's details.
                            <div>
                                <h2 className="text-2xl font-bold mb-2">{selectedClub?.clubName}</h2>
                                <p className="text-gray-600">{selectedClub?.description}</p>
                                <p>Total Members: {selectedClub?.studentCount}</p>
                                <div className="mt-4 flex gap-4">
                                    {joinedClubNames.includes(selectedClub?.clubName || "") ? (
                                        <button
                                            onClick={handleQuit}
                                            className="bg-orange-600 text-white px-3 py-1 rounded text-xs"
                                        >
                                            Quit Club
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleJoin}
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                                        >
                                            Join Club
                                        </button>
                                    )}
                                    <button
                                        onClick={fetchMembers}
                                        className="bg-gray-600 text-white px-4 py-2 rounded"
                                    >
                                        See All Members
                                    </button>
                                </div>
                            </div>
                        )}
                        {showMembers && (
                            <div className="mt-4">
                                <h3 className="text-xl font-bold">Members</h3>
                                <ul className="space-y-2">
                                    {members.map((member) => (
                                        <li key={member.id} className="flex items-center gap-2">
                                            <img
                                                src={member.profileImage || "/default.png"}
                                                alt={member.username}
                                                width={30}
                                                height={30}
                                                className="rounded-full"
                                            />
                                            <span>
                        {member.username} - {member.studentNumber}
                      </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <button
                            onClick={closeModal}
                            className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
