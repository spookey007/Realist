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
  HiHome,
  HiUser,
  HiCog,
  HiChartBar,
  HiInbox,
  HiBell,
  HiDocumentText,
  HiFolder,
  HiHeart,
  HiShoppingCart,
  HiUsers,
  HiArrowRightOnRectangle,
  HiCalendar,
  HiBars3,
  HiChevronUp,
  HiChevronDown,
  HiUserPlus,
  HiSquaresPlus,
  HiOutlineEquals,
  HiRectangleStack,
  HiDocumentCheck
} from "react-icons/hi2";

const availableIcons = [
  { label: "Home", value: "HiHome", component: HiHome },
  { label: "User", value: "HiUser", component: HiUser },
  { label: "Invite", value: "HiUserPlus", component: HiUserPlus },
  { label: "Permission", value: "HiSquaresPlus", component: HiSquaresPlus },
  { label: "MenuManagemnt", value: "HiOutlineEquals", component: HiOutlineEquals },
  { label: "Listing", value: "HiRectangleStack", component: HiRectangleStack },
  { label: "Services", value: "HiDocumentCheck", component: HiDocumentCheck },
  { label: "Settings", value: "HiCog", component: HiCog },
  { label: "Reports", value: "HiChartBar", component: HiChartBar },
  { label: "Inbox", value: "HiInbox", component: HiInbox },
  { label: "Notifications", value: "HiBell", component: HiBell },
  { label: "Documents", value: "HiDocumentText", component: HiDocumentText },
  { label: "Folders", value: "HiFolder", component: HiFolder },
  { label: "Favorites", value: "HiHeart", component: HiHeart },
  { label: "Cart", value: "HiShoppingCart", component: HiShoppingCart },
  { label: "Users", value: "HiUsers", component: HiUsers },
  { label: "Logout", value: "HiArrowRightOnRectangle", component: HiArrowRightOnRectangle },
  { label: "Calendar", value: "HiCalendar", component: HiCalendar },
  { label: "Menu", value: "HiBars3", component: HiBars3 },
  { label: "Expand Less", value: "HiChevronUp", component: HiChevronUp },
  { label: "Expand More", value: "HiChevronDown", component: HiChevronDown },
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
            <button onClick={() => openModal(row.original)} className="group relative inline-flex h-8 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-3 font-medium text-blue-600 transition-all duration-100 [box-shadow:5px_5px_rgb(59_130_246)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(59_130_246)]">
                Edit
            </button>
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
      <button
        onClick={() => setIsModalOpen(true)}
        className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]" 
      >
        Add Menu
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
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border border-gray-300 bg-transparent px-4 font-medium text-gray-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] hover:bg-gray-200 active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border px-4 font-medium transition-all duration-100 active:translate-x-[3px] active:translate-y-[3px] ${
                  editItem
                    ? "border-yellow-500 text-yellow-600 [box-shadow:5px_5px_rgb(234_179_8)] hover:bg-yellow-100 active:[box-shadow:0px_0px_rgb(234_179_8)]"
                    : "border-green-500 text-green-600 [box-shadow:5px_5px_rgb(34_197_94)] hover:bg-green-100 active:[box-shadow:0px_0px_rgb(34_197_94)]"
                }`}
              >
                {editItem ? "Update" : "Send Invite"}
              </button>
            </DialogActions>


          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuManagement;