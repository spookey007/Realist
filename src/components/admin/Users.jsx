import React, { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import axios from "axios";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import "preline";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [passwordModal, setPasswordModal] = useState(false);
  const [password, setPassword] = useState({ newPassword: "", confirmPassword: "" });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
      setUsers(response.data.users);
    } catch (error) {
      alertify.error("Failed to fetch users.");
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user-roles`);
      setRoles(response.data.roles);
    } catch (error) {
      alertify.error("Failed to fetch roles.");
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
  };

  const handleSaveUser = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/update/${editUser.id}`, editUser);
      alertify.success("User updated successfully!");
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      alertify.error("Failed to update user.");
    }
  };

  const handleOpenPasswordModal = (user) => {
    setEditUser(user);
    setPasswordModal(true);
  };

  const handleResetPassword = async () => {
    if (password.newPassword !== password.confirmPassword) {
      alertify.error("Passwords do not match!");
      return;
    }
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/reset-password/${editUser.id}`, {
        password: password.newPassword,
      });
      alertify.success("Password reset successfully!");
      setPasswordModal(false);
      setPassword({ newPassword: "", confirmPassword: "" });
    } catch (error) {
      alertify.error("Failed to reset password.");
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Avatar",
        accessorKey: "avatar",
        cell: (info) => <Avatar src={info.getValue() || "https://i.pravatar.cc/40"} alt="User Avatar" />,
        size: 80,
      },
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) =>
          editUser?.id === info.row.original.id ? (
            <TextField
              value={editUser.name}
              onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
              size="small"
              fullWidth
            />
          ) : (
            <Typography>{info.getValue()}</Typography>
          ),
      },
      {
        header: "Role",
        accessorKey: "role",
        cell: (info) =>
          editUser?.id === info.row.original.id ? (
            <TextField
              select
              value={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
              size="small"
              fullWidth
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <Typography>{info.getValue()}</Typography>
          ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) =>
          editUser?.id === info.row.original.id ? (
            <TextField
              select
              value={editUser.status}
              onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
              size="small"
              fullWidth
            >
              <MenuItem value={0}>Pending</MenuItem>
              <MenuItem value={1}>Activated</MenuItem>
              <MenuItem value={2}>Deactivated</MenuItem>
            </TextField>
          ) : (
            <Chip label={["Pending", "Activated", "Deactivated"][info.getValue()]} />
          ),
      },
      {
        header: "Actions",
        accessorKey: "actions",
        cell: (info) => {
          const rowUser = info.row.original;
          return (
            <div className="flex space-x-2">
              {editUser?.id === rowUser.id ? (
                <Button variant="contained" color="success" size="small" onClick={handleSaveUser}>
                  Save
                </Button>
              ) : (
                <Button variant="contained" color="primary" size="small" onClick={() => handleEditUser(rowUser)}>
                  Edit
                </Button>
              )}
              <Button variant="contained" color="secondary" size="small" onClick={() => handleOpenPasswordModal(rowUser)}>
                Reset Password
              </Button>
            </div>
          );
        },
      },
    ],
    [editUser, roles]
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col flex-1 transition-all duration-300 p-6 md:p-8 lg:p-10 bg-gray-100 min-h-screen mt-[64px] ml-[250px] w-full">
      <Typography variant="h4" className="font-bold mb-4">
        Users Management
      </Typography>
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-[100%] mx-auto overflow-x-auto">
      <table className="w-full border-collapse min-w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b bg-gray-200">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-2 text-left">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
