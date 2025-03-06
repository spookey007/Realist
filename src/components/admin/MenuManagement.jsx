import React, { useState, useMemo } from "react";
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
];

const dummyMenus = [
  { id: 1, name: "Dashboard", icon: "HomeIcon", href: "/dashboard", status: 1, parent: null, createdAt: "2024-03-06", updatedAt: "2024-03-06" },
  { id: 2, name: "Users", icon: "UsersIcon", href: "/users", status: 1, parent: null, createdAt: "2024-03-06", updatedAt: "2024-03-06" },
  { id: 3, name: "Settings", icon: "CogIcon", href: "/settings", status: 0, parent: 2, createdAt: "2024-03-06", updatedAt: "2024-03-06" },
];

const MenuManagement = () => {
  const initialData = { name: "", icon: "", href: "", status: 1, parent: null, createdAt: "", updatedAt: "" };
  const [data, setData] = useState(dummyMenus);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [editItem, setEditItem] = useState(null);

  const openModal = (item = null) => {
    setFormData(item ? { ...item } : initialData);
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.icon || !formData.href.trim()) {
      alertify.error("All fields are required!");
      return;
    }

    const now = new Date().toISOString().split("T")[0];

    if (editItem) {
      const updatedMenus = data.map((item) =>
        item.id === editItem.id ? { ...formData, id: item.id, updatedAt: now } : item
      );
      setData(updatedMenus);
      alertify.success("Menu updated successfully!");
    } else {
      setData([...data, { ...formData, id: data.length + 1, createdAt: now, updatedAt: now }]);
      alertify.success("Menu added successfully!");
    }

    setIsModalOpen(false);
  };

  const columns = useMemo(
    () => [
      { header: "Menu Name", accessorKey: "name", cell: (info) => <Typography>{info.getValue()}</Typography> },
      { 
        header: "Icon", 
        accessorKey: "icon",
        cell: (info) => {
          const iconItem = availableIcons.find((icon) => icon.value === info.getValue());
          return iconItem ? <iconItem.component className="h-5 w-5" /> : <Typography>{info.getValue()}</Typography>;
        },
      },
      { header: "Href", accessorKey: "href", cell: (info) => <Typography>{info.getValue()}</Typography> },
      {
        header: "Parent Menu",
        accessorKey: "parent",
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
    ],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full max-w-[100%] mx-auto overflow-x-auto">
      <Button variant="contained" color="primary" onClick={() => openModal()}>Add Menu</Button>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>{editItem ? "Edit Menu" : "Add New Menu"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Menu Name" name="name" value={formData.name} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Href (URL)" name="href" value={formData.href} onChange={handleChange} margin="normal" />

          {/* Icon Selection */}
          <TextField select fullWidth label="Select Icon" name="icon" value={formData.icon} onChange={handleChange} margin="normal">
            {availableIcons.map((icon) => (
              <MenuItem key={icon.value} value={icon.value}>
                <icon.component className="h-5 w-5 mr-2 inline-block" />
                {icon.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField select fullWidth label="Parent Menu" name="parent" value={formData.parent} onChange={handleChange} margin="normal">
            <MenuItem value={null}>None</MenuItem>
            {data.map((menu) => (
              <MenuItem key={menu.id} value={menu.id}>{menu.name}</MenuItem>
            ))}
          </TextField>

          <TextField select fullWidth label="Status" name="status" value={formData.status} onChange={handleChange} margin="normal">
            <MenuItem value={1}>Active</MenuItem>
            <MenuItem value={0}>Inactive</MenuItem>
          </TextField>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuManagement;
