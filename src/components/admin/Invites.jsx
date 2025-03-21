import React, { useEffect, useState } from "react";
import { useAuth } from '../../context/AuthContext';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
} from "@mui/material";
import axios from "axios";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

const Invites = () => {
  const { user } = useAuth();
  const initialData = { email: "", role: "" };
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    fetchInvites();
    fetchRoles();
  }, []);

  const fetchInvites = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user')); // or useAuth() if using context
  
      // Setup params conditionally
      const params = user.role !== 1 ? { user_id: user.id } : {};
  
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/invites/getInvites`,
        { params }
      );
  
      setData(response.data.invites || []);
    } catch (error) {
      console.error("Error fetching invites:", error);
    }
  };
  

  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/roles/getRoles`
      );
  
      let fetchedRoles = response.data.roles || [];
  
      // Assuming you have access to user.role in this scope
      const user = JSON.parse(localStorage.getItem('user'));
  
      // Apply filtering based on user's role
      if (user.role === 2 || user.role === 3) {
        fetchedRoles = fetchedRoles.filter(role => role.id === 3);
      }
      else if (user.role === 1){
        fetchedRoles = fetchedRoles.filter(role => role.id === 2);
      }
      setRoles(fetchedRoles);
    } catch (error) {
      console.error("Error fetching roles:", error);
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

  const ResendInvite = async (editItem) => {
    try {
      console.log(editItem)
      if (editItem) {
        const updateData = {
          email: editItem.email,
          role: editItem.role,
        };
        console.log(updateData)
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/invites/resendInvite/${editItem.id}`,
          updateData
        );
        alertify.success("Updated successfully!");
      }
      fetchInvites();
    } catch (error) {
      alertify.error("Error saving data.");
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.email) {
        alertify.error("Please type an email.");
        return;
      }
      if (!formData.role) {
        alertify.error("Please select a role.");
        return;
      }
  
      let response;
  
      if (editItem) {
        const updateData = {
          email: formData.email,
          role: formData.role,
        };
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/invites/updateInvite/${editItem.id}`,
          updateData
        );
      } else {
        const payload = {
          ...formData,
          created_by: user.id // Add user.id as created_by
        };
      
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/invites/createInvite`,
          payload
        );
      }
  
      // ✅ Display success message from API response
      if (response.data && response.data.message) {
        alertify.success(response.data.message);
      } else {
        alertify.success("Operation completed successfully.");
      }
  
      // Refresh invites and close modal
      fetchInvites();
      setIsModalOpen(false);
  
    } catch (error) {
      console.error(error);
      // ✅ Display error message from API response if available
      if (error.response && error.response.data && error.response.data.message) {
        alertify.error(error.response.data.message);
      } else {
        alertify.error("Something went wrong. Please try again.");
      }
    }
  };
  

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full max-w-[100%] mx-auto overflow-x-auto">
      <button
          onClick={() => openModal()}
          className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]" 
        >
          Add Invite
      </button>

      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="border-b bg-gray-200">
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-2">{item.email}</td>
              <td className="p-2">{item.role_name}</td>
              <td className="p-2">
                <Chip
                  label={item.status === 1 ? "Invited" : "Joined"}
                  sx={{
                    backgroundColor: item.status === 1 ? "#4CAF50" : "#FFC107",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              </td>
              <td className="p-2 flex space-x-2">
                {item.status === 1 && (
                  <>
                    <button
                      onClick={() => ResendInvite(item)}
                      className="group relative inline-flex h-8 items-center justify-center overflow-hidden rounded-md border border-green-500 bg-transparent px-3 font-medium text-green-600 transition-all duration-100 [box-shadow:5px_5px_rgb(34_197_94)] hover:bg-green-100 active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(34_197_94)]"
                    >
                      Resend
                    </button>
                    <button
                      onClick={() => openModal(item)}
                      className="group relative inline-flex h-8 items-center justify-center overflow-hidden rounded-md border border-blue-500 bg-transparent px-3 font-medium text-blue-600 transition-all duration-100 [box-shadow:5px_5px_rgb(59_130_246)] hover:bg-blue-100 active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(59_130_246)]"
                    >
                      Edit
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>{editItem ? `Update Invite` : "Send Invite"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <button
            onClick={() => setIsModalOpen(false)}
            className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border border-gray-300 bg-transparent px-4 font-medium text-gray-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] hover:bg-gray-200 active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border ${
              editItem
                ? "border-yellow-500 text-yellow-600 [box-shadow:5px_5px_rgb(234_179_8)] hover:bg-yellow-100"
                : "border-green-500 text-green-600 [box-shadow:5px_5px_rgb(34_197_94)] hover:bg-green-100"
            } px-4 font-medium transition-all duration-100 active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(34_197_94)]`}
          >
            {editItem ? "Update" : "Send Invite"}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Invites;
