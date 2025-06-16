import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';


const Topbar = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [formData, setFormData] = useState({ ...user });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
    setEditMode(false);
    setFormData({ ...user });
    setSelectedFile(null);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    if (selectedFile) data.append("profilePicture", selectedFile);

    try {
      const res = await fetch(`${process.env.API_URL}/api/users/${user._id}/edit`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(result.user));
        setUser(result.user);
        setEditMode(false);
        // Show success notification
        Swal.fire({
          position: "center",
          icon: "success",
          title: 'Profile updated successfully!',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        toast.error(result.message || "Update failed!");
      }
    } catch (err) {
      toast.error("Update failed. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <header className="h-[10vh] px-6 p-4 flex items-center justify-between relative bg-gradient-to-r ">
      <h2 className="text-xl font-semibold text-white">Dashboard</h2>
      <div
        className="bg-white w-12 h-12 rounded-full cursor-pointer transition-transform duration-300 hover:scale-110 shadow-lg"
        onClick={togglePopup}
      >
        <img
          className="rounded-full border-2 border-white/50 w-full h-full object-cover"
          src={
            user?.profilePicture
              ? `${process.env.API_URL}/uploads/profiles/${user.profilePicture}`
              : "https://avatars.dicebear.com/api/initials/" + (user?.name || "User") + ".svg"
          }
          alt="profile"
        />
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl p-6 w-96 max-w-[90vw] relative shadow-xl animate-slideUp">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl transition-colors duration-200"
              onClick={togglePopup}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col items-center">
              {/* Profile image box */}
              <label htmlFor="profileUpload" className="cursor-pointer group relative">
                <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4 overflow-hidden shadow-md border-2 border-gray-200 group-hover:border-purple-500 transition-colors duration-300">
                  <img
                    src={
                      selectedFile
                        ? URL.createObjectURL(selectedFile)
                        : user?.profilePicture
                          ? `${process.env.API_URL}/uploads/profiles/${user.profilePicture}`
                          : "https://avatars.dicebear.com/api/initials/" + (user?.name || "User") + ".svg"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {editMode && (
                  <div className="absolute bottom-2 right-2 bg-purple-500 text-white p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                )}
              </label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="profileUpload"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />

              {editMode ? (
                <>
                  <div className="w-full space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        value={formData.phone || ""}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between w-full mt-6 space-x-4">
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      disabled={isLoading}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : "Save Changes"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="absolute top-4 left-4 text-purple-500 hover:text-purple-700 transition-colors duration-200"
                    title="Edit profile"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <div className="w-full space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs font-medium text-gray-500">Name</div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs font-medium text-gray-500">Email</div>
                      <div className="font-medium">{user.email}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs font-medium text-gray-500">Phone</div>
                      <div className="font-medium">{user.phone || "Not provided"}</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Topbar;