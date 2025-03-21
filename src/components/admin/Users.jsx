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
import ReviewModal from "./ReviewModal.jsx";  // ✅ Fix: Use default import


const Users = ({ apiUrl, rolesApi }) => {
  const initialData = { name: "", role: "", status: 1 };
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [editItem, setEditItem] = useState(null);
  const [password, setPassword] = useState({ newPassword: "", confirmPassword: "" });

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState("view");  // ✅ Track mode here
  
  
  const openViewModal = (mode, user) => {
    setSelectedUser(user);
    setViewMode(mode);   // ✅ Set mode dynamically
    setViewModalOpen(true);
  };
  
  const closeViewModal = () => {
    setViewModalOpen(false);
  };
  
  
  const openModal = (item = null) => {
    setFormData(item ? { ...item } : initialData);
    setEditItem(item);
    setIsModalOpen(true);
  };

  const openReviewModal = (user) => {
    setSelectedUser(user);
    setReviewModalOpen(true);
  };
  
  const closeReviewModal = () => {
    setReviewModalOpen(false);
  };

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




  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  
  const handleApprove = async (userId) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/update/${userId}`, { status: 1 });
  
      if (response.status === 200) {
        fetchData();
        alertify.success("User Approved!");
        closeViewModal();
      } else {
        alertify.error("Failed to approve user.");
      }
    } catch (error) {
      console.error("Error approving user:", error);
      alertify.error("An error occurred while approving the user.");
    }
  };
  
  const handleReject = async (userId) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/update/${userId}`, { status: 2 });
  
      if (response.status === 200) {
        fetchData();
        alertify.error("User Rejected!");
        closeViewModal();
      } else {
        alertify.error("Failed to reject user.");
      }
    } catch (error) {
      console.error("Error rejecting user:", error);
      alertify.error("An error occurred while rejecting the user.");
    }
  };
  

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  password: Yup.string()
    .when([], {
      is: () => !editItem, // Only validate if it's a new user
      then: (schema) =>
        schema
          .min(8, "Password must be at least 8 characters")
          .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
          .matches(/[a-z]/, "Password must contain at least one lowercase letter")
          .matches(/[0-9]/, "Password must contain at least one number")
          .matches(/[@$!%*?&]/, "Password must contain at least one special character")
          .required("Password is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  confirmPassword: Yup.string()
    .when("password", {
      is: (password) => !!password, // Only validate if password is provided
      then: (schema) => schema.oneOf([Yup.ref("password")], "Passwords must match"),
      otherwise: (schema) => schema.notRequired(),
    }),

  // captchaValue: Yup.string().required("Please complete the reCAPTCHA"),
});


  const handleSave = async () => {
    try {

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
          const status = rowItem.status;
          
          return (
            <div className="flex space-x-2">
              {status === 1 && (
                <>
                  <button
                    onClick={() => openModal(rowItem)}
                    className="group relative inline-flexh-8 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-3 font-medium text-blue-600 transition-all duration-100 [box-shadow:5px_5px_rgb(59_130_246)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(59_130_246)]"
                  >
                    Edit
                  </button>
          
                  <button
                    onClick={() => handleOpenPasswordModal(rowItem)}
                    className="group relative inline-flexh-8 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-3 font-medium text-red-600 transition-all duration-100 [box-shadow:5px_5px_rgb(239_68_68)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(239_68_68)]"
                  >
                    Reset Password
                  </button>
          
                  <button
                    onClick={() => openViewModal('view', rowItem)}
                    className="group relative inline-flexh-8 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-3 font-medium text-cyan-600 transition-all duration-100 [box-shadow:5px_5px_rgb(6_182_212)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(6_182_212)]"
                  >
                    View
                  </button>
                </>
              )}
              
              {(status === 0 || status === 2) && (
                <button
                  onClick={() => openViewModal('review', rowItem)}
                  className="group relative inline-flex h-8 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-3 font-medium text-yellow-600 transition-all duration-100 [box-shadow:5px_5px_rgb(234_179_8)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(234_179_8)]"
                >
                  Review
                </button>
              )}
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

      {/* {Review Modal} */}
      {viewModalOpen && selectedUser && (
        <ReviewModal 
          open={viewModalOpen} 
          onClose={closeViewModal} 
          user={selectedUser} 
          mode={viewMode}
          handleApprove={handleApprove}
          handleReject={handleReject} 
        />
      )}
    </div>
  );
};

export default Users;
