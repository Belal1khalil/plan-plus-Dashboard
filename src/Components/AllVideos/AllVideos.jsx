import axios from "axios";
import React, { useEffect, useState } from "react";
import DeleteAlert from "../DeleteAlert/DeleteAlert";
import { Link } from "react-router-dom";

export default function AllVideos() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null); // ← تم التعديل هنا
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getAllVideos();
  }, [currentPage]);

  async function getAllVideos() {
    try {
      const response = await axios.get(
        `https://plans-plus.runasp.net/api/Video/All?pageNumber=${currentPage}&pageSize=${itemsPerPage}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      if (response?.data?.succeeded) {
        setVideos(response.data.data.items);
        setTotalPages(response.data.data.totalPages || 1);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteVideo(videoId) {
    try {
      const response = await axios.delete(
        `https://plans-plus.runasp.net/api/Video/${videoId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      getAllVideos();
      console.log("deleted");
    } catch (error) {
      console.error(error);
    }
  }

  console.log(videos);

  return (
    <div className="h-screen">
      <div className="flex justify-center">
        <h1 className="text-2xl text-center mt-10 mb-4 px-8 text-gray-100 py-2 rounded-lg bg-mainColor inline">
          All Videos
        </h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Card Grid for Videos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos?.map((video, index) => (
            <div
              key={index}
              className="bg-mainColor border rounded-xl space-y-2 shadow-md p-4"
            >
                <Link to={`/Dashboard/ShowVideo/${video.streamId}`}>
              <img
                src={`https://khetatplusstream.b-cdn.net//${video.streamId}/thumbnail.jpg`}
                className="w-full h-48 object-cover rounded-lg mb-4"
                alt="Video Thumbnail"
                />
                </Link>
              <h3 className="text-lg font-semibold text-gray-100">
                <span className="font-bold">Title : </span> {video.title}
              </h3>
              <p className="text-sm text-gray-100">
                <span className="font-bold">Publisher : </span>
                {video.publisherName}
              </p>
              <p className="text-sm text-gray-100">
                <span className="font-bold">Upload Date : </span>
                {new Date(video.uploadDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}{" "}
                at{" "}
                {new Date(video.uploadDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setSelectedVideoId(video.id)}
                  className="bg-red-600 hover:bg-red-700 transition-all text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>

              {selectedVideoId === video.id && (
                <DeleteAlert
                  onConfirm={() => {
                    deleteVideo(video.id);
                    setSelectedVideoId(null);
                  }}
                  onClose={() => setSelectedVideoId(null)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
