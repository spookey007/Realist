import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Chip } from "@mui/material";
import axios from "axios";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

const Roles = () => {
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "status" ? Number(value) : value });
  };
  

  const handleSave = async () => {
    try {
      let response;
      if (editItem) {
        response = await axios.put(`${import.meta.env.VITE_API_URL}/api/roles/${editItem.id}`, formData);
        setData((prev) => prev.map((item) => (item.id === editItem.id ? response.data : item)));
        alertify.success("Updated successfully!");
      } else {
        response = await axios.post(`${import.meta.env.VITE_API_URL}/api/roles/createRoles`, formData);
        setData((prev) => [...prev, response.data]);
        alertify.success("Added successfully!");
      }
      setIsModalOpen(false);
    } catch (error) {
      alertify.error("Error saving data.");
    }
  };
  

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full max-w-[100%] mx-auto overflow-x-auto">
      <Button variant="contained" color="primary" onClick={() => openModal()}>
        Add Roles
      </Button>

      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="border-b bg-gray-200">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.description}</td>
              <td className="p-2">
                <Chip
                  label={
                    item.status === 0
                      ? "Pending"
                      : item.status === 1
                      ? "Activated"
                      : "Deactivated"
                  }
                  sx={{
                    backgroundColor:
                      item.status === 1
                        ? "#4CAF50"
                        : item.status === 2
                        ? "#F44336"
                        : "#FFC107",
                    color: "white",
                    fontWeight: "bold",
                  }}
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

export default Roles;
