
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import imageuser from "../../assets/imgs/WhatsApp Image 2025-04-20 at 3.24.26 PM.jpeg";
import { toast } from "react-hot-toast";

export default function GetUser() {
  const [image, setImage] = useState(null);
  const [notfound, setNotFound] = useState(false);
  const [role, setRole] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showTable, setShowTable] = useState(true);
  const [userData, setUserData] = useState(null);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  async function getAllusers() {
    try {
      const options = {
        url: `https://plans-plus.runasp.net/api/Admin/All?pageNumber=${currentPage}&pageSize=${itemsPerPage}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      };
      const { data } = await axios.request(options);
      if (data.succeeded === true) {
        setUsers(data.data.items || []);
        setTotalPages(data.data.totalPages || 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllusers();
  }, [currentPage]);

  const getUser = async (values) => {
    const response = await axios.get(
      `https://plans-plus.runasp.net/api/Admin/GetUserData?Email=${values.email}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    setImage(response.data.data.profilePic);
    setRole(response?.data.data.role);
    setSelectedUser(response.data.data);
    setUserData(response.data.data);
    setNotFound(false);
    setShowTable(false);
    return response;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: getUser,
    onError: () => {
      setNotFound(true);
      setShowTable(false);
      setUserData(null);
    },
  });

  const refetchUser = (email) => {
    if (email) {
      setNotFound(false);
      mutate({ email });
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setImage(user.profilePic);
    setRole(user.role);
    setUserData(user);
    setNotFound(false);
    setShowTable(false);
  };

  const handleBackToTable = () => {
    setSelectedUser(null);
    setImage(null);
    setRole(null);
    setUserData(null);
    setNotFound(false);
    setShowTable(true);
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const Formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setNotFound(false);
      mutate(values);
    },
  });

  useEffect(() => {
    if (Formik.values.email === "") {
      setSelectedUser(null);
      setImage(null);
      setRole(null);
      setNotFound(false);
      setUserData(null);
      setShowTable(true);
      if (users.length === 0) {
        setCurrentPage(1);
        getAllusers();
      }
    }
  }, [Formik.values.email, users.length]);

  const assignModerator = async (email) => {
    const loadingToast = toast.loading("Loading...");
    try {
      const { data } = await axios.put(
        `https://plans-plus.runasp.net/api/Admin/Assign-ModeratorRole?Email=${email}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (data.message === "Operation completed Successfully") {
        toast.success("User Assigned Successfully");
        setNotFound(false);
        refetchUser(email);
        getAllusers();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign moderator role");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const assignUser = async (email) => {
    const loadingToast = toast.loading("Loading...");
    try {
      const { data } = await axios.put(
        `https://plans-plus.runasp.net/api/Admin/Assign-UserRole?Email=${email}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (data.message === "Operation completed Successfully") {
        toast.success("User Assigned Successfully");
        setNotFound(false);
        refetchUser(email);
        getAllusers();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign user role");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Search for users and manage their roles
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <form onSubmit={Formik.handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="email"
              name="email"
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
              value={Formik.values.email}
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-mainColor focus:border-transparent"
              placeholder="Enter user email..."
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 text-white bg-mainColor hover:bg-[#1F2C43] rounded-r-lg transition-colors"
            >
              Search
            </button>
          </div>
          {Formik.errors.email && Formik.touched.email && (
            <p className="text-red-500 text-sm mt-1">{Formik.errors.email}</p>
          )}
        </form>
      </div>

      {isPending && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mainColor"></div>
        </div>
      )}

      {(selectedUser || userData) && !notfound && (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-10 transition-all hover:shadow-lg">
          <div className="relative h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <img
              className="h-full w-full object-cover"
              src={image || imageuser}
              alt="User profile"
              onError={(e) => (e.target.src = imageuser)}
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {selectedUser?.displayedName || userData?.displayedName}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedUser?.email || userData?.email}
                </p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-mainColor text-white bg-opacity-10 ">
                {selectedUser?.role || userData?.role}
              </span>
            </div>

            {(selectedUser?.bio || userData?.bio) && (
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {selectedUser?.bio || userData?.bio}
              </p>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => assignUser(selectedUser?.email || userData?.email)}
                disabled={role === "Admin" || role === "User"}
                className={`flex-1 py-2 px-4 rounded-lg ${
                  role === "Admin" || role === "User"
                    ? "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800"
                } transition-colors`}
              >
                Make User
              </button>
              <button
                onClick={() => assignModerator(selectedUser?.email || userData?.email)}
                disabled={role === "Admin" || role === "Moderator"}
                className={`flex-1 py-2 px-4 rounded-lg ${
                  role === "Admin" || role === "Moderator"
                    ? "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
                } transition-colors`}
              >
                Make Moderator
              </button>
            </div>

            <div className="mt-4">
              <button
                onClick={handleBackToTable}
                className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
              >
                Back to Users Table
              </button>
            </div>
          </div>
        </div>
      )}

      {!isPending && notfound && (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-100 dark:bg-red-900 rounded-full">
              <svg
                className="h-12 w-12 text-red-500 dark:text-red-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            User Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We couldn't find a user with that email address. Please check the
            spelling and try again.
          </p>
          <button
            onClick={() => {
              Formik.resetForm();
              setSelectedUser(null);
              setNotFound(false);
              setImage(null);
              setRole(null);
              setUserData(null);
              setShowTable(true);
              if (users.length === 0) {
                setCurrentPage(1);
                getAllusers();
              }
            }}
            className="px-6 py-2 bg-mainColor hover:bg-[#1F2C43] text-white rounded-lg transition-colors"
          >
            Try Another Search
          </button>
        </div>
      )}

      {showTable && !isPending && users.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.profilePic || imageuser}
                            alt=""
                            onError={(e) => (e.target.src = imageuser)}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.displayedName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {user.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, users.length)}
                  </span>{" "}
                  of <span className="font-medium">{users.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300 dark:text-gray-500 cursor-not-allowed"
                        : "text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? "z-10 bg-mainColor border-mainColor text-white"
                            : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300 dark:text-gray-500 cursor-not-allowed"
                        : "text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}