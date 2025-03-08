import React, { useState, useMemo,useEffect } from "react";
import axios from "axios";
import {
  Typography,
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
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import "preline";
import { useFormik } from "formik";
import * as Yup from "yup";


import {
  HomeIcon,
  UserIcon,
  CogIcon,
  ChartBarIcon,
  InboxIcon,
  BellIcon,
  DocumentTextIcon,
  FolderIcon,
  HeartIcon,
  ShoppingCartIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

import { Dashboard, CalendarToday, Person, Contacts, Assessment, ExitToApp, Menu, ExpandLess, ExpandMore, Group, Settings } from "@mui/icons-material";

const availableIcons = [
  { label: "Home", value: "HomeIcon", component: HomeIcon },
  { label: "User", value: "UserIcon", component: UserIcon },
  { label: "Settings", value: "CogIcon", component: CogIcon },
  { label: "Reports", value: "ChartBarIcon", component: ChartBarIcon },
  { label: "Inbox", value: "InboxIcon", component: InboxIcon },
  { label: "Notifications", value: "BellIcon", component: BellIcon },
  { label: "Documents", value: "DocumentTextIcon", component: DocumentTextIcon },
  { label: "Folders", value: "FolderIcon", component: FolderIcon },
  { label: "Favorites", value: "HeartIcon", component: HeartIcon },
  { label: "Cart", value: "ShoppingCartIcon", component: ShoppingCartIcon },
  { label: "Users", value: "UsersIcon", component: UsersIcon },
  { label: "Logout", value: "ArrowRightOnRectangleIcon", component: ArrowRightOnRectangleIcon },
  { label: "Dashboard", value: "Dashboard", component: Dashboard },
  { label: "Calendar", value: "CalendarToday", component: CalendarToday },
  { label: "Person", value: "Person", component: Person },
  { label: "Contacts", value: "Contacts", component: Contacts },
  { label: "Assessment", value: "Assessment", component: Assessment },
  { label: "Exit", value: "ExitToApp", component: ExitToApp },
  { label: "Menu", value: "Menu", component: Menu },
  { label: "Expand Less", value: "ExpandLess", component: ExpandLess },
  { label: "Expand More", value: "ExpandMore", component: ExpandMore },
  { label: "Group", value: "Group", component: Group },
  { label: "Settings", value: "Settings", component: Settings }
];

const dummyMenus = [
  { id: 1, name: "Dashboard", icon: "HomeIcon", href: "/dashboard", status: 1, parent_menu_id: null, createdAt: "2024-03-06", updatedAt: "2024-03-06" },
  { id: 2, name: "Users", icon: "UsersIcon", href: "/users", status: 1, parent_menu_id: null, createdAt: "2024-03-06", updatedAt: "2024-03-06" },
  { id: 3, name: "Settings", icon: "CogIcon", href: "/settings", status: 0, parent_menu_id: 2, createdAt: "2024-03-06", updatedAt: "2024-03-06" },
];

const MenuManagement = () => {
  const initialData = { name: "", icon: "", href: "", status: 1, parent_menu_id: null, position: 1, createdAt: "", updatedAt: "" };
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", icon: "", href: "", status: 1, parent_menu_id: null, position: 1 });
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/menu`);
      setData(response.data || []);
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  const createMenu = async (formData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/menu`, formData);
      alertify.success("Menu created successfully!");
      fetchData();
      formik.resetForm();
      // setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating menu:", error);
      alertify.error("Failed to create menu");
    }
  };

  const updateMenu = async (formData) => {
    try {
      // console.log(formData)
      const updatedFormData = {
        ...formData,
        parent_menu_id: formData.parent_menu_id
          ? parseInt(formData.parent_menu_id, 10)
          : null,
      };
      // console.log(updatedFormData)
      await axios.put(`${import.meta.env.VITE_API_URL}/api/menu/${editItem.id}`, updatedFormData);
      alertify.success("Menu updated successfully!");
      fetchData();
      // setIsModalOpen(false);
      formik.resetForm();
    } catch (error) {
      console.error("Error updating menu:", error);
      alertify.error("Failed to update menu");
    }
  };

  const deleteMenu = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/menu/${id}`);
      alertify.success("Menu deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting menu:", error);
      alertify.error("Failed to delete menu");
    }
  };

  const openModal = (item = null) => {
    const formData = {
      name: item?.name ?? "",
      icon: item?.icon ?? "",
      href: item?.href ?? "",
      status: item?.status ?? 1,
      parent_menu_id: item?.parent_menu_id ?? null,
      position: item?.position ?? 1, // Ensure position is included
    };
  
    setFormData(formData);  // Update local form state
    formik.setValues(formData); // Update Formik state
  
    setEditItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditItem(null); // Clear editItem when modal is dismissed
    formik.resetForm(); // Reset form values
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSave = (formData) => {
    if (editItem) {
      updateMenu(formData);
    } else {
      createMenu(formData);
    }
    setIsModalOpen(false); // Close modal after saving
  };

  const columns = useMemo(
    () => [
      { header: "Menu Name", accessorKey: "name", cell: (info) => <Typography>{info.getValue()}</Typography> },
      { 
        header: "Icon", 
        accessorKey: "icon",
        cell: (info) => {
          const iconItem = availableIcons.find((icon) => icon.value === info.getValue()) || { component: () => <span>❓</span> };
          return <iconItem.component className="h-5 w-5" />;              
        },
      },
      { header: "Href", accessorKey: "href", cell: (info) => <Typography>{info.getValue()}</Typography> },
      {
        header: "Parent Menu",
        accessorKey: "parent_menu_id",
        cell: (info) => {
          const parentMenu = data.find((m) => m.id === info.getValue());
          return <Typography>{parentMenu ? parentMenu.name : "None"}</Typography>;
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const statusMap = {
            0: { label: "Inactive", color: "#F44336" },
            1: { label: "Active", color: "#4CAF50" },
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
        cell: ({ row }) => (
          <>
            <Button variant="contained" size="small" onClick={() => openModal(row.original)}>Edit</Button>
            {/* <Button variant="contained" color="error" size="small" onClick={() => deleteMenu(row.original.id)}>Delete</Button> */}
          </>
        ),
      },
    ],
    [data]
  );
  useEffect(() => {
    console.log("Data in Table:", data);
  }, [data]);
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const formik = useFormik({
    initialValues: {
      name: "" ?? "",
      href: "" ?? "",
      icon: "" ?? "",
      parent_menu_id: null ?? null,
      status: "1" ?? "1",
      position: 1 ?? 1,
    },
    validationSchema: Yup.object({
      name: Yup.string()
      .matches(/^[a-zA-Z0-9 ]+$/, "Only alphanumeric characters and spaces are allowed")    
      .required("Menu Name is required"),    
      href: Yup.string()
      .matches(/^\/[a-zA-Z0-9/-]+$/, "Enter a valid URL starting with '/' and without special characters")
      .required("Href is required"),    
      icon: Yup.string().required("Please select an icon"),
      status: Yup.string().required("Status is required"),
      position: Yup.number()
      .typeError("Position must be a number")
      .required("Position is required")
      .integer("Position must be an integer")
      .min(1, "Position must be at least 1")
      .max(999, "Position must be less than 999"), // Adjust as needed
    
    }),
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
      handleSave(values);
      setIsModalOpen(false);
    },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full max-w-[100%] mx-auto overflow-x-auto">
      <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
        Add Menu
      </Button>

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
      <Dialog
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditItem(null); // Clear editItem
            formik.resetForm(); // Reset form values
          }}
        >
        <DialogTitle>{editItem ? "Edit Menu" : "Add New Menu"}</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              label="Menu Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              margin="normal"
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <TextField
              fullWidth
              label="Href (URL)"
              name="href"
              value={formik.values.href}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              margin="normal"
              error={formik.touched.href && Boolean(formik.errors.href)}
              helperText={formik.touched.href && formik.errors.href}
            />

            {/* Icon Selection */}
            <TextField
              select
              fullWidth
              label="Select Icon"
              name="icon"
              value={formik.values.icon}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              margin="normal"
              error={formik.touched.icon && Boolean(formik.errors.icon)}
              helperText={formik.touched.icon && formik.errors.icon}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: 200, // Apply max height here
                      overflowY: "auto",
                    },
                  },
                },
              }}
            >
              {availableIcons.map((icon) => (
                <MenuItem key={icon.value} value={icon.value}>
                  <icon.component className="h-5 w-5 mr-2 inline-block" />
                  {icon.label}
                </MenuItem>
              ))}
            </TextField>


            {/* Parent Menu Selection */}
            <TextField
              select
              fullWidth
              label="Parent Menu"
              name="parent_menu_id"
              value={formik.values.parent_menu_id ?? null} // Ensure `null` is properly handled
              onChange={formik.handleChange}
              margin="normal"
            >
              <MenuItem value={null}>None</MenuItem>
              {data
                .filter((menu) => menu.id !== editItem?.id) // Exclude the current menu
                .map((menu) => (
                  <MenuItem key={menu.id} value={menu.id}>
                    {menu.name}
                  </MenuItem>
                ))}
            </TextField>

            <TextField
              fullWidth
              label="Position"
              name="position"
              type="number"
              value={formik.values.position}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              margin="normal"
              error={formik.touched.position && Boolean(formik.errors.position)}
              helperText={formik.touched.position && formik.errors.position}
            />

            {/* Status Selection */}
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              margin="normal"
            >
              <MenuItem value="1">Active</MenuItem>
              <MenuItem value="0">Inactive</MenuItem>
            </TextField>

            <DialogActions>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {editItem ? "Update" : "Save"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuManagement;