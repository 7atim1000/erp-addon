import React, { useState } from 'react';
import { getAllUsers, updateUserRole } from "../https";
import { keepPreviousData, useQuery, useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { motion } from 'framer-motion';
import { 
  MdPerson, 
  MdEmail, 
  MdPhone, 
  MdAdminPanelSettings, 
  MdPointOfSale, 
  MdBlock, 
  MdEdit, 
  MdSave,
  MdClose,
  MdRefresh 
} from "react-icons/md";

const Users = () => {
  const [editingUserId, setEditingUserId] = useState(null);
  const [roleUpdate, setRoleUpdate] = useState('');
  
  // Fetch users data
  const { data: responseData, isError, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      return await getAllUsers();
    },
    placeholderData: keepPreviousData,
  });

  // Mutation for updating user role
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, newRole }) => updateUserRole(userId, newRole),
    onSuccess: (res) => {
      const { data } = res;
      enqueueSnackbar(data.message || 'User role updated successfully!', { variant: 'success' });
      setEditingUserId(null);
      setRoleUpdate('');
      refetch();
    },
    onError: (error) => {
      const { response } = error;
      enqueueSnackbar(response?.data?.message || 'Failed to update user role', { variant: 'error' });
    }
  });

  if (isError) {
    enqueueSnackbar('Something went wrong!', { variant: 'error' });
  }

  const handleEditRole = (userId, currentRole) => {
    setEditingUserId(userId);
    setRoleUpdate(currentRole);
  };

  const handleSaveRole = (userId) => {
    if (roleUpdate) {
      updateRoleMutation.mutate({ userId, newRole: roleUpdate });
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setRoleUpdate('');
  };

  const getRoleIcon = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin':
        return <MdAdminPanelSettings className="text-blue-600 w-4 h-4" />;
      case 'cashier':
        return <MdPointOfSale className="text-green-600 w-4 h-4" />;
      case 'reject':
      //case 'refuse':
        return <MdBlock className="text-red-600 w-4 h-4" />;
      default:
        return <MdPerson className="text-gray-600 w-4 h-4" />;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cashier':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'reject':
      //case 'refuse':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const roleOptions = [
    { value: 'admin', label: 'Admin', icon: <MdAdminPanelSettings className="w-4 h-4" /> },
    { value: 'cashier', label: 'Cashier', icon: <MdPointOfSale className="w-4 h-4" /> },
    { value: 'reject', label: 'Reject', icon: <MdBlock className="w-4 h-4" /> },
    // { value: 'refuse', label: 'Refuse', icon: <MdBlock className="w-4 h-4" /> }
  ];

  const users = responseData?.data?.data || responseData?.data || [];

  return (
    <div className="p-4 sm:p-6 w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage user accounts and permissions</p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg 
                     hover:from-blue-600 hover:to-blue-700 transition duration-200 cursor-pointer font-medium text-sm"
          >
            <MdRefresh className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh Users'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {['admin', 'cashier', 'reject'].map((role) => {
            const count = users.filter(user => 
              user?.role?.toLowerCase() === role.toLowerCase()
            ).length;
            
            return (
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{role.charAt(0).toUpperCase() + role.slice(1)} Users</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{count}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${getRoleBadgeClass(role)}`}>
                    {getRoleIcon(role)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 sm:px-6 py-4 border-b border-blue-200">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3 sm:col-span-4 font-semibold text-blue-700 text-sm">User Details</div>
            <div className="col-span-3 font-semibold text-blue-700 text-sm">Email</div>
            <div className="col-span-3 font-semibold text-blue-700 text-sm">Phone</div>
            <div className="col-span-3 sm:col-span-2 font-semibold text-blue-700 text-sm">Role & Actions</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-blue-100">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
              <p className="text-gray-600 font-medium">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <MdPerson className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-gray-600 font-medium">No users found</p>
              <p className="text-gray-400 text-sm mt-1">Add new users to get started</p>
            </div>
          ) : (
            users.map((user, index) => (
              <motion.div
                key={user._id || index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="px-4 sm:px-6 py-4 hover:bg-blue-50/50 transition-colors duration-150"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* User Details */}
                  <div className="col-span-3 sm:col-span-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <MdPerson className="text-blue-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">ID: {user._id?.substring(0, 8) || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <MdEmail className="text-blue-500 w-4 h-4" />
                      <p className="text-sm text-gray-700 truncate">{user.email || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <MdPhone className="text-blue-500 w-4 h-4" />
                      <p className="text-sm text-gray-700">{user.phone || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Role & Actions */}
                  <div className="col-span-3 sm:col-span-2">
                    {editingUserId === user._id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={roleUpdate}
                          onChange={(e) => setRoleUpdate(e.target.value)}
                          className="flex-1 px-2 py-1.5 bg-white border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {roleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleSaveRole(user._id)}
                          disabled={updateRoleMutation.isPending}
                          className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition duration-200"
                        >
                          <MdSave className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition duration-200"
                        >
                          <MdClose className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getRoleBadgeClass(user.role)}`}>
                            <div className="flex items-center gap-1">
                              {getRoleIcon(user.role)}
                              {user.role || 'N/A'}
                            </div>
                          </span>
                        </div>
                        <button
                          onClick={() => handleEditRole(user._id, user.role)}
                          className="p-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition duration-200"
                          title="Edit Role"
                        >
                          <MdEdit className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-700">
              Total Users: <span className="font-semibold text-blue-700">{users.length}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Click the edit icon to change user roles. Changes take effect immediately.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-100 rounded-full border border-blue-300"></div>
              <span className="text-xs text-gray-600">Admin</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 rounded-full border border-green-300"></div>
              <span className="text-xs text-gray-600">Cashier</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-100 rounded-full border border-red-300"></div>
              <span className="text-xs text-gray-600">Reject/Refuse</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;

// import React from 'react' ;
// import { getUserData } from "../https";
// import { keepPreviousData, useQuery } from '@tanstack/react-query'
// const Users = () => {
    
//     const [loading, setLoading] = useState(false);
//     const{ data: responseData, IsError } = useQuery({

//         queryKey: ['users'],

//         queryFn: async () => {
//             return await getUserData();
//         },

//         placeholderData: keepPreviousData,

//     });

//     if (IsError) {
//         enqueueSnackbar('Something went wrong!', { variant: 'error' });
//     }

//     return (
//         <>
//         </>
//     );
// }


// export default Users ;