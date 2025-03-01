import React, { useEffect, useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import axios from 'axios';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import 'preline'; // ✅ Preline CSS Added
import { Button, MenuItem, Select, TextField, Chip } from '@mui/material';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [editUser, setEditUser] = useState(null);

  // Fetch roles from API
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/roles/getRoles`);
      if (Array.isArray(response.data)) {
        setRoles(response.data);
      } else if (response.data.roles && Array.isArray(response.data.roles)) {
        setRoles(response.data.roles);
      } else {
        console.error('Unexpected API response format:', response.data);
        setRoles([]);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles([]);
    }
  };

  // Handle status change
  const handleStatusChange = (e) => {
    setEditUser((prev) => ({ ...prev, status: e.target.value }));
  };

  // Save the edited role
  const handleSaveEdit = async () => {
    if (!editUser) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/roles/${editUser.id}`, editUser);
      alertify.success('Role updated successfully');
      setEditUser(null);
      fetchRoles();
    } catch (error) {
      console.error('Error updating role:', error);
      alertify.error('Failed to update role');
    }
  };

  // Delete role
  const handleDeleteRole = async (id) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/roles/${id}`);
      alertify.success('Role deleted successfully');
      fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      alertify.error('Failed to delete role');
    }
  };
  
  // Define Table Columns
  const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Role Name' },
    { accessorKey: 'description', header: 'Description' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) =>
        console.log(row.original.status) ||
        editUser?.id === row.original.id ? (
          <Select
            value={editUser?.status}
            onChange={handleStatusChange}
            size="small"
            className="preline-select border rounded-md"
          >
            <MenuItem value={0}>Pending</MenuItem>
            <MenuItem value={1}>Activated</MenuItem>
            <MenuItem value={2}>Deactivated</MenuItem>
          </Select>
        ) : (
        <Chip
          label={['Pending', 'Activated', 'Deactivated'][row.original.status]}
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.original.status == 1
              ? 'bg-green-500 text-white'
              : row.original.status == 2
              ? 'bg-red-500 text-white'
              : 'bg-yellow-500 text-black'
          }`}
        />
        ),
    },
    { accessorKey: 'createdAt', header: 'Created At' },
    { accessorKey: 'updatedAt', header: 'Updated At' },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {editUser?.id === row.original.id ? (
            <button
              className="hs-button bg-green-500 hover:bg-green-600 text-white rounded-md px-3 py-1"
              onClick={handleSaveEdit}
            >
              Save
            </button>
          ) : (
            <button
              className="hs-button bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-1"
              onClick={() => setEditUser(row.original)}
            >
              Edit
            </button>
          )}
          <button
            className="hs-button bg-red-500 hover:bg-red-600 text-white rounded-md px-3 py-1"
            onClick={() => handleDeleteRole(row.original.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  // Initialize Table
  const table = useReactTable({
    data: roles,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Roles</h1>
      <p className="text-gray-600 mb-6">Manage roles. View, edit, or delete roles.</p>

      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="hs-table w-full border border-gray-200">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border p-2 text-left text-sm font-semibold">
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
                  <td key={cell.id} className="border p-2 text-sm">
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

export default Roles;
