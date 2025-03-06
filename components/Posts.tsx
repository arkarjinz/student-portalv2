'use client';
import React, { useEffect, useState, useRef } from "react";
import { getLoggedInUser, isUserLoggedIn } from "@/service/AuthService";
import { redirect } from "next/navigation";
import { Post } from "@/ds/post.dto";
import { getAllPosts } from "@/service/StudentPortalService";
import { createPost, deletePost, updatePost } from "@/service/PostService";
import Image from "next/image";
import { GiRose } from "react-icons/gi";

// Helper function to escape special characters in a regex
function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [newPost, setNewPost] = useState("");
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // State for rude word detection & blocking (for posting)
    const [rudeAttempts, setRudeAttempts] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockTimer, setBlockTimer] = useState(60);
    const [rudeNotice, setRudeNotice] = useState("");

    // New state to control warning video display
    const [showWarningVideo, setShowWarningVideo] = useState(false);

    // For live relative time display of createdAt
    const [now, setNow] = useState(new Date());
    const loggedInUser = getLoggedInUser();

    // State for inline editing/updating a post
    const [editingPostId, setEditingPostId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState("");

    // State for update-specific inappropriate attempt counter
    const [updateAttempts, setUpdateAttempts] = useState(0);

    // State for confirmation modal (update/delete)
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmModalType, setConfirmModalType] = useState(""); // "delete" or "update"
    const [confirmModalPostId, setConfirmModalPostId] = useState<number | null>(null);

    // List of prohibited words
    const rudeWords = `
wtf
wuss
wuzzie
xtc
xxx
yankee
yellowman
zigabo
zipperhead
`.split("\n")
        .map(word => word.trim())
        .filter(word => word.length > 0);

    useEffect(() => {
        if (!isUserLoggedIn()) {
            redirect("/login");
        }
        fetchPosts();
    }, [page]);

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    // When rudeNotice changes and user is not blocked, show the warning video.
    useEffect(() => {
        if (rudeNotice && !isBlocked) {
            setShowWarningVideo(true);
        }
    }, [rudeNotice, isBlocked]);

    useEffect(() => {
        if (isBlocked) {
            setRudeNotice(`You are blocked from posting. Please wait ${blockTimer} seconds.`);
        }
    }, [blockTimer, isBlocked]);

    function getRandomNumber() {
        return Math.floor(Math.random() * 10000000) + 1;
    }

    const fetchPosts = () => {
        setLoading(true);
        getAllPosts()
            .then((res) => {
                const parsedPosts = res.data.map((post: Post) => ({
                    ...post,
                    createdAt: post.createdAt,
                }));
                setPosts((prevPosts) => [...prevPosts, ...parsedPosts]);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1.0 }
        );
        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }
        return () => observerRef.current?.disconnect();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isBlocked) {
            interval = setInterval(() => {
                setBlockTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsBlocked(false);
                        setRudeAttempts(0);
                        setRudeNotice("");
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => interval && clearInterval(interval);
    }, [isBlocked]);

    const timeSince = (dateStr: string) => {
        const created = new Date(dateStr);
        let seconds = Math.floor((now.getTime() - created.getTime()) / 1000);
        if (seconds < 0) seconds = 0;
        if (seconds < 5) return "just now";
        let interval = seconds / 31536000;
        if (interval >= 1) return `${Math.floor(interval)} year${Math.floor(interval) > 1 ? "s" : ""} ago`;
        interval = seconds / 2592000;
        if (interval >= 1) return `${Math.floor(interval)} month${Math.floor(interval) > 1 ? "s" : ""} ago`;
        interval = seconds / 86400;
        if (interval >= 1) return `${Math.floor(interval)} day${Math.floor(interval) > 1 ? "s" : ""} ago`;
        interval = seconds / 3600;
        if (interval >= 1) return `${Math.floor(interval)} hour${Math.floor(interval) > 1 ? "s" : ""} ago`;
        interval = seconds / 60;
        if (interval >= 1) return `${Math.floor(interval)} minute${Math.floor(interval) > 1 ? "s" : ""} ago`;
        return `${Math.floor(seconds)} second${Math.floor(seconds) > 1 ? "s" : ""} ago`;
    };

    const findRudeWords = (text: string) => {
        const lowerText = text.toLowerCase();
        const foundWords: string[] = [];
        rudeWords.forEach((word) => {
            const pattern = new RegExp(`\\b${escapeRegExp(word)}\\b`, "g");
            if (pattern.test(lowerText)) {
                foundWords.push(word);
            }
        });
        return Array.from(new Set(foundWords));
    };

    const handleCreatePost = () => {
        if (!newPost.trim()) return;
        if (isBlocked) {
            setRudeNotice(`You are blocked from posting. Please wait ${blockTimer} seconds.`);
            return;
        }
        const foundRudeWords = findRudeWords(newPost);
        if (foundRudeWords.length > 0) {
            const newAttempts = rudeAttempts + 1;
            setRudeAttempts(newAttempts);
            if (newAttempts >= 5) {
                setIsBlocked(true);
                setBlockTimer(60);
                setRudeNotice("Too many inappropriate attempts. You are blocked for 60 seconds.");
            } else {
                setRudeNotice(
                    `Your post contains inappropriate word(s): "${foundRudeWords.join('", "')}". Please remove them.`
                );
            }
            return;
        }
        setRudeNotice("");
        const loggedInUser = getLoggedInUser();
        const newPostObj: Post = {
            id: getRandomNumber(),
            postOwner: loggedInUser,
            content: newPost,
            title: "New Post",
            createdAt: new Date().toISOString(),
        };
        createPost(newPostObj)
            .then(() => {
                setPosts([]);
                setPage(1);
            })
            .catch((err) => {
                console.error(err);
            });
        setNewPost("");
    };

    // Render a smaller warning video (ohmygah.mp4) under the warning message in a container.
    const renderWarningVideo = () => (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white p-2 rounded shadow">
                <video
                    src="/ohmygah.mp4"
                    autoPlay
                    controls={false}
                    className="w-80"
                    onEnded={() => setShowWarningVideo(false)}
                />
            </div>
        </div>
    );

    // Render a smaller ban video (angry.mp4) with countdown in a container.
    const renderBanVideo = () => (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white p-2 rounded shadow">
                <video src="/angry.mp4" autoPlay loop controls={false} className="w-80" />
                <p className="mt-2 text-black text-center">You are banned for {blockTimer} seconds</p>
            </div>
        </div>
    );

    // --- Confirmation modal and editing functions (unchanged) ---
    const openConfirmModal = (actionType: string, postId: number) => {
        setConfirmModalType(actionType);
        setConfirmModalPostId(postId);
        setConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setConfirmModalOpen(false);
        setConfirmModalType("");
        setConfirmModalPostId(null);
    };

    const confirmDelete = () => {
        if (confirmModalPostId === null) return;
        deletePost(confirmModalPostId, loggedInUser)
            .then(() => {
                setPosts((prevPosts) =>
                    prevPosts.filter((post) => post.id !== confirmModalPostId)
                );
            })
            .catch((err) => {
                console.error(err);
            });
        closeConfirmModal();
    };

    const handleEditPost = (postId: number, currentContent: string) => {
        setEditingPostId(postId);
        setEditingContent(currentContent);
        setUpdateAttempts(0);
    };

    const cancelEdit = () => {
        setEditingPostId(null);
        setEditingContent("");
        setUpdateAttempts(0);
    };

    const confirmUpdate = () => {
        if (confirmModalPostId === null) return;
        const foundRude = findRudeWords(editingContent);
        if (foundRude.length > 0) {
            setUpdateAttempts((prev) => prev + 1);
            if (updateAttempts + 1 >= 5) {
                deletePost(confirmModalPostId, loggedInUser)
                    .then(() => {
                        alert("Your post has been automatically deleted due to repeated inappropriate update attempts.");
                        setPosts((prevPosts) =>
                            prevPosts.filter((post) => post.id !== confirmModalPostId)
                        );
                    })
                    .catch((err) => {
                        console.error(err);
                    });
                closeConfirmModal();
                setEditingPostId(null);
                setEditingContent("");
                setUpdateAttempts(0);
                return;
            } else {
                setRudeNotice(
                    `Your update contains inappropriate word(s): "${foundRude.join('", "')}". Please remove them.`
                );
                closeConfirmModal();
                return;
            }
        }
        let updatedContent = editingContent;
        if (!updatedContent.endsWith(" (edited)")) {
            updatedContent += " (edited)";
        }
        updatePost(confirmModalPostId, loggedInUser, updatedContent)
            .then(() => {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.id === confirmModalPostId ? { ...post, content: updatedContent } : post
                    )
                );
                setEditingPostId(null);
                setEditingContent("");
                setUpdateAttempts(0);
            })
            .catch((err) => {
                console.error(err);
            });
        closeConfirmModal();
    };

    const handleUpdatePost = (postId: number) => {
        openConfirmModal("update", postId);
    };

    const handleDeletePost = (postId: number) => {
        openConfirmModal("delete", postId);
    };

    // --- End of confirmation/edit functions ---

    return (
        <div className="container mx-auto grid grid-cols-12 gap-4 p-5">
            {isBlocked && renderBanVideo()}
            {!isBlocked && rudeNotice && showWarningVideo && renderWarningVideo()}
            {/* Confirmation Modal */}
            {confirmModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white p-6 rounded shadow-lg z-10">
                        {confirmModalType === "delete" ? (
                            <p className="mb-4">Are you sure you want to delete this post?</p>
                        ) : (
                            <p className="mb-4">Are you sure you want to update this post?</p>
                        )}
                        <div className="flex justify-end gap-4">
                            <button onClick={closeConfirmModal} className="px-4 py-2 bg-gray-200 rounded">
                                Cancel
                            </button>
                            {confirmModalType === "delete" ? (
                                <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded">
                                    Confirm
                                </button>
                            ) : (
                                <button onClick={confirmUpdate} className="px-4 py-2 bg-green-500 text-white rounded">
                                    Confirm
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Left: Downloadable Files */}
            <aside className="col-span-12 md:col-span-3 flex flex-col gap-4">
                <div className="bg-white rounded-xl shadow-md p-5">
                    <h2 className="text-2xl font-bold mb-3 text-green-800">UIT Academic System Rules</h2>
                    <a href="/UIT-Academic-Rules.pdf" download className="text-blue-500 hover:underline">
                        Download PDF
                    </a>
                </div>
                <div className="bg-white rounded-xl shadow-md p-5">
                    <h2 className="text-2xl font-bold mb-3 text-green-800">UIT Curriculum (2022-2023)</h2>
                    <a href="/UIT-Curriculum.pdf" download className="text-blue-500 hover:underline">
                        Download PDF
                    </a>
                </div>
                <div className="bg-white rounded-xl shadow-md p-5">
                    <h2 className="text-2xl font-bold mb-3 text-green-800">MALC Guide</h2>
                    <a href="/MALC.pdf" download className="text-blue-500 hover:underline">
                        Download PDF
                    </a>
                </div>
            </aside>

            {/* Center: Main Content (Feed) */}
            <main className="col-span-12 md:col-span-6">
                <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
                    <div className="flex items-center space-x-4">
                        <Image src="/girl.png" alt="User" width={60} height={60} className="rounded-full" />
                        <input
                            type="text"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="Share something amazing..."
                            className="w-full border border-gray-200 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-green-800 transition duration-300"
                        />
                    </div>
                    {rudeNotice && (
                        <div className="mt-4 p-3 bg-red-100 text-red-600 rounded-lg flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {rudeNotice}
                        </div>
                    )}
                    <div className="flex justify-end mt-4">
                        {!isBlocked && (
                            <button
                                onClick={handleCreatePost}
                                className="bg-green-800 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full transition duration-300"
                            >
                                Post
                            </button>
                        )}
                    </div>
                </div>
                {posts.length > 0 ? (
                    posts.map((post: Post, index: number) => (
                        <div
                            key={`${post.id}-${index}`}
                            className={`bg-white shadow-md rounded-xl p-5 mb-5 transition-shadow duration-300 hover:shadow-lg ${
                                post.postOwner === loggedInUser ? "bg-blue-50 border border-blue-200" : ""
                            }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <Image
                                        src={`/${post.profileImage || "default.png"}`}
                                        alt="profileImage"
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                    />
                                    <div className="flex items-center">
                                        <p className="font-bold capitalize">{post.postOwner}</p>
                                        <GiRose size={25} className="ms-3 text-red-500" />
                                        <span className="text-pink-500 font-bold bg-pink-100 rounded px-2 py-1 ml-2">
                      {post.roseCount || 0}
                    </span>
                                    </div>
                                </div>
                                {post.postOwner === loggedInUser && (
                                    <div className="flex items-center gap-3">
                                        {editingPostId !== post.id ? (
                                            <>
                                                <button onClick={() => handleEditPost(post.id, post.content)}>
                                                    <Image src="/update.svg" alt="update" width={20} height={20} />
                                                </button>
                                                <button onClick={() => handleDeletePost(post.id)}>
                                                    <Image src="/delete.svg" alt="delete" width={20} height={20} />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleUpdatePost(post.id)}>
                                                    <Image src="/update.svg" alt="save" width={20} height={20} />
                                                </button>
                                                <button onClick={cancelEdit} className="text-gray-500">
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-400 mb-2">
                                {timeSince(post.createdAt)}
                                {post.content.endsWith(" (edited)") && <span className="ml-2 text-xs text-gray-500">(edited)</span>}
                            </p>
                            {editingPostId === post.id ? (
                                <textarea
                                    value={editingContent}
                                    onChange={(e) => setEditingContent(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            ) : (
                                <p className="text-gray-700">{post.content}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No posts available</p>
                )}
                <div ref={loadMoreRef} className="h-10"></div>
                {loading && <p className="text-center text-gray-500">Loading more posts...</p>}
            </main>

            {/* Right: Announcements Section */}
            <aside className="col-span-12 md:col-span-3">
                <div className="bg-gradient-to-r from-green-50 to-green-90 rounded-xl p-6 text-white shadow-lg">
                    <h2 className="text-2xl font-bold mb-3">Announcements</h2>
                    <ul className="space-y-3">
                        <li className="flex items-center">
                            <span className="mr-2">📅</span>
                            Don’t forget the Friday Community Meetup at 6 PM.
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2">📝</span>
                            Exam Schedule updated for next month—check your portal.
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2">🏖️</span>
                            Holiday next Monday (campus closed).
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2">📚</span>
                            New library hours: 8 AM - 10 PM on weekdays.
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    );
}



