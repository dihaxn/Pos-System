import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import LogoutButton from "./buttons/LogoutButton";
import SliderNavButton from "./buttons/IconNavButton";
import { motion } from "framer-motion";
// import AuthContext from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Assuming Swal is imported for error handling
import config from "../../../config/environment";
import { useAuth } from "../../../contexts/AuthContext";

const Sidebar = ({ isOpen, toggleSidebar, navItemList = [], sliderExpandWidth, sliderNotExpandWidth, user }) => {
  // Commented out for development - bypass authentication
  // const { logoutUser, outletId } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, logout } = useAuth();
  const [outletName, setOutletName] = useState();
  const [loading, setLoading] = useState(false); // Added loading state
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/login');
    }
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      // Here you would typically make an API call to update user data
      // For now, we'll just show a success message
      Swal.fire({
        title: 'Profile Updated',
        text: 'Your profile has been updated successfully.',
        icon: 'success',
        confirmButtonColor: '#10B981',
        timer: 2000,
        showConfirmButton: false
      });
      setShowProfileModal(false);
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to update profile. Please try again.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const navItems = navItemList;



  useEffect(() => {
    const fetchOutletData = async () => {
      setLoading(true); // Start loading
      // Commented out for development - bypass authentication
      // if(outletId != -1){
      try {
        const response = await axios.get(`${config.OUTLET_API_URL}${config.ENDPOINTS.OUTLET.GET_BY_ID}`, {
          params: { "outlet-id": 1 },
        });

        if (response.data && response.data.data.outletName) {
          setOutletName(response.data.data.outletName); // Set the outlet name
          console.log(response.data.data); // Display the fetched data
        } 
      } catch (error) {
        console.error("Error fetching outlet data:", error);
        // Swal.fire("Error", "Failed to load outlet data", "error");
      } finally {
        setLoading(false); // End loading
      }
      // }
      setLoading(false); // End loading
    };
    fetchOutletData();
  }, []); // Removed outletId dependency for development

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 25, duration: 0.8 }} // Increased duration here
      className={`sidebar-scroll fixed top-0 left-0 h-full bg-gradient-to-r from-purple-50 to-pink-100 text-black shadow-lg transition-all duration-300 ease-in-out overflow-y-auto ${
        isOpen ? `w-${sliderExpandWidth}` : `w-${sliderNotExpandWidth}`
      }`}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#ec4899 #f3e8ff'
      }}
    >
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: #f3e8ff;
          border-radius: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #ec4899, #be185d);
          border-radius: 4px;
          border: 1px solid #f3e8ff;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #be185d, #9d174d);
        }
      `}</style>
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-pink-300">
        {isOpen && <h2 className="text-2xl font-bold text-pink-800 opacity-65">Little Lanka Pvt Ltd</h2>}
        <button
          onClick={toggleSidebar}
          aria-expanded={isOpen}
          aria-label="Toggle sidebar"
          className="p-2 rounded-full bg-pink-200 hover:bg-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-md transition transform hover:scale-110"
        >
          {isOpen ? (
            <ChevronLeftIcon className="h-6 w-6 text-pink-600" />
          ) : (
            <ChevronRightIcon className="h-6 w-6 text-pink-600" />
          )}
        </button>
      </div>

      {/* Profile Section */}
      {isOpen && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-purple-100 via-pink-100 to-pink-200 rounded-lg shadow-xl m-5 space-y-4"
        >
          {/* Profile Photo - Clickable */}
          <motion.div 
            className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-300 mb-4 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleProfileClick}
            title="Click to change profile picture"
          >
            <img
              src="src/assets/profileImages/mathara.jpg"
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* User Details */}
          <div className="text-center space-y-2">
            {/* User Name */}
            <h1 className="text-xl font-semibold text-pink-700 opacity-90">
              {authUser?.name || user || 'User'}
            </h1>
            
            {/* User Role */}
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">
                {authUser?.role === 'owner' ? '👑' : 
                 authUser?.role === 'factory_staff' ? '🏭' : 
                 authUser?.role === 'outlet_staff' ? '🏪' : '👤'}
              </span>
              <span className="text-sm font-medium text-pink-600 capitalize">
                {authUser?.role?.replace('_', ' ') || 'Role'}
              </span>
            </div>
            
            {/* Outlet Name */}
            <h2 className="text-lg font-medium text-pink-500 opacity-80">
              {outletName || authUser?.outletName || 'Main Outlet'}
            </h2>

            {/* User ID */}
            <p className="text-xs text-pink-400">
              ID: {authUser?.id || 'N/A'}
            </p>
          </div>

          {/* Edit Profile Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleProfileClick}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
          >
            Edit Profile
          </motion.button>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-full">
          <span className="text-pink-600 text-lg"></span>
        </div>
      )}

      {/* Navigation */}
      <nav className={`mt-6 pb-8 ${isOpen ? "px-4" : "px-2"}`}>
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.nameBtn} className="flex items-center">
              {!isOpen && (
                <div className="w-8 h-8 flex justify-center items-center hover:bg-pink-400 bg-pink-200 rounded-md shadow-md transition transform hover:scale-110 ml-3">
                  <img
                    src={item.iconUrl}
                    alt={`${item.nameBtn} icon`}
                    className="w-6 h-6"
                    onClick={item.fun}
                  />
                </div>
              )}
              {isOpen && (
                <SliderNavButton
                  onClick={item.fun}
                  icon={item.iconUrl}
                  isSliderBtn={true}
                  isSelected={true}
                  isActive={item.isActive}
                >
                  {item.nameBtn}
                </SliderNavButton>
              )}
            </li>
          ))}
          {isOpen && (
            <li>
              <LogoutButton
                onClick={handleLogout}
                className="hover:bg-pink-300 text-pink-800 transition duration-200 transform hover:scale-105"
              >
                Logout
              </LogoutButton>
            </li>
          )}
        </ul>
      </nav>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white rounded-lg p-6 w-96 max-w-md mx-4"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const updatedData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                profilePicture: formData.get('profilePicture')
              };
              handleProfileUpdate(updatedData);
            }}>
              <div className="space-y-4">
                {/* Profile Picture Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={authUser?.name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={authUser?.email || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={authUser?.phone || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* Role Display (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={authUser?.role?.replace('_', ' ').toUpperCase() || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                    readOnly
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
};

export default Sidebar;
