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
import * as Yup from "yup";

const Users = ({ apiUrl, rolesApi }) => {
  const initialData = { name: "", role: "", status: 1 };
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [editItem, setEditItem] = useState(null);
  const [password, setPassword] = useState({ newPassword: "", confirmPassword: "" });

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchRoles(); // ✅ Ensure roles are available first
      fetchData();        // ✅ Fetch users only after roles are ready
    };
  
    fetchAllData();
  }, []);
  
  

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
      setData(response.data.users || []);
    } catch (error) {
      alertify.error("Failed to fetch data.");
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/roles/getRoles`);
      setRoles(response.data.roles || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoles([]);
    }
  };


  const openModal = (item = null) => {
    setFormData(item ? { ...item } : initialData);
    setEditItem(item);
    setIsModalOpen(true);
  };
   
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[@$!%*?&]/, "Password must contain at least one special character")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),

  // captchaValue: Yup.string().required("Please complete the reCAPTCHA"),
});


  const handleSave = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
  
      if (editItem) {
        const updatedUser = {
          name: formData.name.trim(),
          status: parseInt(formData.status, 10),
          role: parseInt(formData.role, 10),
        };
        await axios.put(`${import.meta.env.VITE_API_URL}/api/users/update/${editItem.id}`, updatedUser);
        alertify.success("Updated successfully!");
      } else {
        const newUser = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
          status: parseInt(formData.status, 10),
          role: parseInt(formData.role, 10),
        };
        await axios.post(`${import.meta.env.VITE_API_URL}/api/users/admin`, newUser);
        alertify.success("Added successfully!");
      }
  
      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((err) => alertify.error(err.message));
      } else {
        alertify.error("Error saving data.");
      }
    }
  };
  
  

  const handleOpenPasswordModal = (item) => {
    setEditItem(item);
    setPassword({ newPassword: "", confirmPassword: "" });
    setPasswordModal(true);
  };

  const handleResetPassword = async () => {
    if (password.newPassword !== password.confirmPassword) {
      alertify.error("Passwords do not match!");
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/reset-password/${editItem.id}`, {
        password: password.newPassword,
      });

      alertify.success("Password reset successfully!");
      setPasswordModal(false);
    } catch (error) {
      alertify.error("Failed to reset password.");
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Avatar",
        accessorKey: "avatar",
        cell: (info) => <Avatar src={info.getValue() || "https://i.pravatar.cc/40"} alt="Avatar" />,
      },
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) => <Typography>{info.getValue()}</Typography>,
      },
      {
        header: "Role",
        accessorKey: "role_name",
        cell: (info) => {
          const role_name = info.getValue(); // Get the role ID from API response
          return <Typography>{role_name}</Typography>;
        },
      },
      
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const statusMap = {
            0: { label: "Pending", color: "#FFC107" }, // Yellow
            1: { label: "Activated", color: "#4CAF50" }, // Green
            2: { label: "Deactivated", color: "#F44336" }, // Red
          };
      
          const status = info.getValue();
      
          return (
            <Chip
              label={statusMap[status]?.label}
              sx={{
                backgroundColor: statusMap[status]?.color,
                color: "white",
                fontWeight: "bold",
              }}
            />
          );
        },
      },
      {
        header: "Actions",
        accessorKey: "actions",
        cell: (info) => {
          const rowItem = info.row.original;
          return (
            <div className="flex space-x-2">
              <Button variant="contained" color="primary" size="small" onClick={() => openModal(rowItem)}>
                Edit
              </Button>
              <Button variant="contained" color="secondary" size="small" onClick={() => handleOpenPasswordModal(rowItem)}>
                Reset Password
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full max-w-[100%] mx-auto overflow-x-auto">
      <button
          onClick={() => openModal()}
          className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]" 
        >
          Add User
      </button>

      <table className="w-full mt-4 border-collapse border border-gray-300">
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
                <td key={cell.id} className="p-2">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>{editItem ? `Update (ID: ${editItem.id})` : "Add New"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} margin="normal" />
          {!editItem && (
          <>
            <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} margin="normal" />
          </>
          )}
          <TextField select fullWidth label="Role" name="role" value={formData.role} onChange={handleChange} margin="normal">
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>
          

          <TextField select fullWidth label="Status" name="status" value={formData.status} onChange={handleChange} margin="normal">
            <MenuItem value={0}>Pending</MenuItem>
            <MenuItem value={1}>Activated</MenuItem>
            <MenuItem value={2}>Deactivated</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <button onClick={() => setIsModalOpen(false)} className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
            >
            Cancel
          </button>
          <button onClick={handleSave}
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
            >
            {editItem ? "Update" : "Save"}
          </button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={passwordModal} onClose={() => setPasswordModal(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="New Password" type="password" name="newPassword" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} margin="normal" />
          <TextField fullWidth label="Confirm Password" type="password" name="confirmPassword" value={password.confirmPassword} onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })} margin="normal" />
        </DialogContent>
        <DialogActions>
        <button onClick={() => setPasswordModal(false)} className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
          >
            Cancel
        </button>
          <button onClick={() => handleResetPassword(false)} className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
          >
            Reset Password
        </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;
