import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import bcrypt from 'bcryptjs';

const fetchUsers = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
  return response.data;
};

fetchUsers().then(users => console.log(users));

const Users = () => {
  const initialNewUser = () => ({
    name: '',
    email: '',
    password: '',
    role: 0,
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    status: '0',
  });

  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState(initialNewUser()); // Now this is after the declaration
  const [actionType, setActionType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      alertify.error('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      renderCell: (params) => {
        const roles = ['Admin', 'User', 'Guest'];
        return <span>{roles[params.value]}</span>;
      },
    },
    {
      field: 'user_status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <span>
          {params.value === 0 ? 'Pending' : params.value === 1 ? 'Activated' : 'Deactivated'}
        </span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      renderCell: (params) => (
        <Grid container spacing={1}>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleActionClick(params.row, 'resetPassword')}
            >
              Reset Password
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color={params.row.user_status === 1 ? 'error' : 'success'}
              onClick={() => handleActionClick(params.row, params.row.user_status === 1 ? 'deactivate' : 'activate')}
            >
              {params.row.user_status === 1 ? 'Deactivate' : 'Activate'}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleActionClick(params.row, 'editPermissions')}
            >
              Edit Permissions
            </Button>
          </Grid>
        </Grid>
      ),
    },
  ];

  const handleActionClick = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setNewUser(action === 'addUser' ? initialNewUser() : { ...user, password: '' });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
    setActionType('');
    setNewUser(initialNewUser());
  };

  const isPasswordValid = (password) => password.length >= 6;

  const handleConfirmAction = async () => {
    setLoading(true);
    try {
      let response;
      switch (actionType) {
        case 'resetPassword':
          await resetUserPassword(selectedUser.id);
          break;
        case 'activate':
        case 'deactivate':
          await toggleUserActivation(selectedUser.id, actionType);
          break;
        case 'editPermissions':
          await editUserPermissions(selectedUser.id, selectedUser.permissions);
          break;
        case 'addUser':
          if (!isPasswordValid(newUser.password)) {
            alertify.error('Password must be at least 6 characters long.');
            return;
          }
          await addUser(newUser);
          break;
        default:
          break;
      }
      handleCloseModal();
      fetchUsers(); // Refresh user list after action
    } catch (error) {
      console.error('Error performing action:', error);
      alertify.error(error.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const resetUserPassword = async (userId) => {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/users/${userId}/reset-password`);
    alertify.success('Password reset successfully!');
  };

  const toggleUserActivation = async (userId, action) => {
    const newStatus = action === 'activate' ? '1' : '2';
    await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, { status: newStatus });
    alertify.success(`User ${action === 'activate' ? 'activated' : 'deactivated'}!`);
  };

  const editUserPermissions = async (userId, permissions) => {
    await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${userId}/permissions`, { permissions });
    alertify.success('Permissions updated successfully!');
  };

  const addUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, { ...userData, password: hashedPassword });
    setUsers([...users, response.data.user]);
    alertify.success('User added successfully!');
  };

  return (
    <div style={{ height: 600, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Typography variant="body1" gutterBottom>
        Manage users and their roles in the system. Add or remove users as necessary.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleActionClick({}, 'addUser')}
        style={{ marginBottom: '16px' }}
      >
        Add User
      </Button>
      <DataGrid rows={users} columns={columns} pageSize={10} loading={loading} />

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {actionType === 'addUser'
            ? 'Add New User'
            : actionType === 'resetPassword'
            ? 'Reset Password'
            : actionType === 'editPermissions'
            ? 'Edit Permissions'
            : `${actionType === 'activate' ? 'Activate' : 'Deactivate'} User`}
        </DialogTitle>
        <DialogContent>
          {actionType === 'addUser' || actionType === 'editPermissions' ? (
            <>
              <TextField
                label="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Address"
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="City"
                value={newUser.city}
                onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="State"
                value={newUser.state}
                onChange={(e) => setNewUser({ ...newUser, state: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Country"
                value={newUser.country}
                onChange={(e) => setNewUser({ ...newUser, country: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Postal Code"
                value={newUser.postal_code}
                onChange={(e) => setNewUser({ ...newUser, postal_code: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                select
                label="Role"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                fullWidth
                margin="normal"
              >
                <MenuItem value={0}>Admin</MenuItem>
                <MenuItem value={1}>User</MenuItem>
                <MenuItem value={2}>Guest</MenuItem>
              </TextField>
              <TextField
                select
                label="Status"
                value={newUser.status}
                onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                fullWidth
                margin="normal"
              >
                <MenuItem value="0">Pending</MenuItem>
                <MenuItem value="1">Activated</MenuItem>
                <MenuItem value="2">Deactivated</MenuItem>
              </TextField>
            </>
          ) : actionType === 'resetPassword' ? (
            <Typography>Are you sure you want to reset the password for {selectedUser?.name}?</Typography>
          ) : (
            <Typography>
              Are you sure you want to {actionType} the user {selectedUser?.name}?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color="primary" disabled={loading}>
            {loading ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;
