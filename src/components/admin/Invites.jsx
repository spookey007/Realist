import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Chip } from "@mui/material";
import axios from "axios";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

const Invites = () => {
  const initialData = { name: "", description: "", status: 1 };
  const [data, setData] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/roles/getRoles`);
      setData(response.data.roles || []);
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const handleSave = async () => {
    try {
      if (editItem) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/roles/${editItem.id}`, formData);
        alertify.success("Updated successfully!");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/roles/createRoles`, formData);
        alertify.success("Added successfully!");
      }

      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      alertify.error("Error saving data.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full max-w-[100%] mx-auto overflow-x-auto">
      <Button variant="contained" color="primary" onClick={() => openModal()}>
        Invite
      </Button>

      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="border-b bg-gray-200">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-2">{item.name}</td>
              <td className="p-2">
                <Chip
                  label={["Pending", "Activated", "Deactivated"][item.status]}
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.status == 1 ? "bg-green-500 text-white" : item.status == 2 ? "bg-red-500 text-white" : "bg-yellow-500 text-black"
                  }`}
                />
              </td>
              <td className="p-2 flex space-x-2">
                <Button variant="contained" color="primary" size="small" onClick={() => openModal(item)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>{editItem ? `Update (ID: ${editItem.id})` : "Add New"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} margin="normal" multiline rows={3} />
          <TextField select fullWidth label="Status" name="status" value={formData.status} onChange={handleChange} margin="normal">
            <MenuItem value={0}>Pending</MenuItem>
            <MenuItem value={1}>Activated</MenuItem>
            <MenuItem value={2}>Deactivated</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editItem ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Invites;
