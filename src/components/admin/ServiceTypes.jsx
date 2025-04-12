import React, { useEffect, useState } from "react"; 
import { useAuth } from '../../context/AuthContext';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import axios from "axios";
import { useDevice } from "../../context/DeviceContext";

const ServiceTypes = () => {
  const { user } = useAuth();
  const initialData = { service_type_name: "", status: 1 };
  const [data, setData] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const { isMobile } = useDevice();

  useEffect(() => {
    fetchStypes();
  }, []);

  const fetchStypes = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/servicestypes/service-types`
      );
      setData(response.data || []);
    } catch (error) {
      console.error("Error fetching service types:", error);
    }
  };

  const openModal = (item = null) => {
    setFormData(item ? { ...item } : initialData);
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    // console.log(e.target.value)
    // console.log(e.target.name)
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (!formData.service_type_name) {
        alertify.error("Please enter a service type name.");
        return;
      }

      let response;

      if (editItem) {
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/servicestypes/service-types/${editItem.id}`,
          formData
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/servicestypes/service-types`,
          formData
        );
      }

      if (response.data && response.data.message) {
        alertify.success(response.data.message);
      } else {
        alertify.success(response.data.message);
      }

      fetchStypes();
      setIsModalOpen(false);

    } catch (error) {
      console.error(error);
      alertify.error(error.response.data.error);
    }
  };

  const MobileTable = ({ data, openModal }) => (
    <div className="md:hidden mt-4 space-y-4">
      {data.map((item) => (
        <div key={item.id} className="p-4 border rounded-lg shadow-sm bg-white">
          <div className="flex justify-between py-1 text-sm">
            <span className="font-semibold text-gray-500">Service:</span>
            <span>{item.service_type_name}</span>
          </div>
          <div className="flex justify-between py-1 text-sm">
            <span className="font-semibold text-gray-500">Status:</span>
            <span>{item.status === 1 ? "Active" : "Inactive"}</span>
          </div>
          <div className="mt-3 text-right space-x-2">
            <button
              onClick={() => openModal(item)}
              className="group relative inline-flex h-8 items-center justify-center overflow-hidden rounded-md border border-blue-500 bg-transparent px-3 font-medium text-blue-600 transition-all duration-100 [box-shadow:5px_5px_rgb(59_130_246)] hover:bg-blue-100 active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(59_130_246)]"
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const DesktopTable = ({ data, openModal }) => (
    <div className="hidden md:block">
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="border-b bg-gray-200">
            <th className="p-2 text-left">Service</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-2">{item.service_type_name}</td>
              <td className="p-2">
                <Chip
                  label={item.status === 1 ? "Active" : "Inactive"}
                  sx={{
                    backgroundColor: item.status === 1 ? "#4CAF50" : "#FFC107",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              </td>
              <td className="p-2 flex space-x-2">
                <button
                  onClick={() => openModal(item)}
                  className="group relative inline-flex h-8 items-center justify-center overflow-hidden rounded-md border border-blue-500 bg-transparent px-3 font-medium text-blue-600 transition-all duration-100 [box-shadow:5px_5px_rgb(59_130_246)] hover:bg-blue-100 active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(59_130_246)]"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full max-w-[100%] mx-auto overflow-x-auto">
      <button
        onClick={() => openModal()}
        className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]" 
      >
        Add Service Category
      </button>

      {isMobile ? (
        <MobileTable data={data} openModal={openModal} />
      ) : (
        <DesktopTable data={data} openModal={openModal} />
      )}

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>{editItem ? `Update Service Category` : "Add Service Category"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Service Category"
            name="service_type_name"
            value={formData.service_type_name}
            onChange={handleChange}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value={1}>Active</MenuItem>
              <MenuItem value={0}>Inactive</MenuItem>
            </Select>
          </FormControl>

        </DialogContent>
        <DialogActions>
          <button
            onClick={() => setIsModalOpen(false)}
            className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border border-gray-300 bg-transparent px-4 font-medium text-gray-600 transition-all duration-100 [box-shadow:5px_5x_rgb(82_82_82)] hover:bg-gray-200 active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
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
            {editItem ? "Update" : "Submit"}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ServiceTypes;
