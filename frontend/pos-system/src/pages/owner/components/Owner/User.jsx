import React from 'react';
// import useUserController from "../../api/user_service/UserController.jsx"; // Commented for development
import LoadingWheel from "../../../shared/components/loadingWheel/LoadingWheel.jsx";

const User = () => {
  // Commented out for development - bypass API calls
  // const {
  //   users,
  //   roles,
  //   loading,
  //   statusOptions,
  //   searchTerm,
  //   setSearchTerm,
  //   statusFilter,
  //   setStatusFilter,
  //   roleFilter,
  //   setRoleFilter,
  //   filteredUsers,
  //   roleMap,
  //   handleEditClick,
  //   handleToggleStatus,
  //   handleUpdatePhone,
  //   handleUpdatePassword,
  //   handleUpdateStatus,
  //   isEditModalOpen,
  //   editingUser,
  //   newPhone,
  //   setNewPhone,
  //   newPassword,
  //   setNewPassword,
  //   editStatus,
  //   setEditStatus,
  //   setIsEditModalOpen,
  //   handleSaveStaff,
  //   isAddStaffModalOpen,
  //   setIsAddStaffModalOpen,
  //   newStaff,
  //   setNewStaff,
  // } = useUserController();

  // Mock data for development
  const loading = false;
  const users = [
    { userId: 1, username: "admin", role: "Owner", status: "Active" },
    { userId: 2, username: "manager", role: "Manager", status: "Active" },
    { userId: 3, username: "staff", role: "Staff", status: "Inactive" }
  ];

  if (loading) return <LoadingWheel />;

  return (
      <div className="p-4 bg-transparent rounded-lg shadow-md">
        <h1 className="text-3xl mb-4">User Management</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800">
            👥 User management functionality will be implemented here.
          </p>
          <p className="text-blue-600 text-sm mt-2">
            This component is currently a placeholder for development purposes.
          </p>
        </div>

        {/* Mock User Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.userId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default User;