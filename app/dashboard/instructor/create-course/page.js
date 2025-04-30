"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CreateCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0.0);
  const [playlistId, setPlaylistId] = useState("");
  const [introVideoId, setIntroVideoId] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/courses/",
        {
          title,
          description,
          price,
          playlist_id: playlistId,
          intro_video_id: introVideoId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Assuming the token is stored in localStorage
          },
        }
      );
      setSuccess("Course created successfully!");
      setTimeout(() => {
        router.push("/dashboard/instructor");
      }, 1500);
    } catch (err) {
      setError("Failed to create course. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white shadow-md rounded-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Create Course</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2 text-gray-900"
          required
        />
        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2 text-gray-900"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2 text-gray-900"
          required
        />
        <input
          type="text"
          placeholder="YouTube Playlist ID (Optional)"
          value={playlistId}
          onChange={(e) => setPlaylistId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2 text-gray-900"
        />
        <input
          type="text"
          placeholder="Intro Video ID (Optional)"
          value={introVideoId}
          onChange={(e) => setIntroVideoId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 text-gray-900"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create Course
        </button>
      </form>
    </div>
  );
}
