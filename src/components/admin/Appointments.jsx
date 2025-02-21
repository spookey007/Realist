import React, { useEffect, useState } from 'react';
import { Typography, Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // For Booked
import CancelIcon from '@mui/icons-material/Cancel'; // For Declined
import CachedIcon from '@mui/icons-material/Cached'; // For Rescheduled


import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [newDateTime, setNewDateTime] = useState(null);
  const [error, setError] = useState('');

  // Fetch data from API endpoint
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/appointment/get`);
        const dataWithIds = response.data.appointments.map((item, index) => ({
          ...item,
          id: item.id || item._id || index, // Ensuring each appointment has a unique id
        }));
        setAppointments(dataWithIds);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchData();
  }, []);

  // Columns configuration
  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'message', headerName: 'Message', width: 200 },
    { field: 'dateTime', headerName: 'Appointment Date', width: 150 },
    { 
      field: 'rescheduled_dateTime', 
      headerName: 'Rescheduled Date', 
      width: 150,
      valueGetter: (params) => {
        if (!params || !params.row) {
          return ''; // Return empty string if params or params.row is null
        }
        return params.row.rescheduled === 0 ? '' : params.row.rescheduled_dateTime;
      }
    },
    { field: 'latitude', headerName: 'Latitude', width: 100 },
    { field: 'longitude', headerName: 'Longitude', width: 100 },
    { field: 'status', headerName: 'Status', width: 100 },
    { field: 'createdAt', headerName: 'Created At', width: 150 },
    { field: 'updatedAt', headerName: 'Updated At', width: 150 },
    { field: 'address', headerName: 'Address', width: 200 },
    {
      field: 'action',
      headerName: 'Action',
      width: 300,
      renderCell: (params) => {
        const { status, id,rescheduled } = params.row;

        if (status === 0) {
          return (
            <Grid container spacing={1} justifyContent="flex-start">
              <Grid item>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => handleButtonClick(id, 1, 'confirm')}
                  sx={{ fontSize: '0.7rem', padding: '4px 8px' }}
                >
                  Confirm
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleButtonClick(id, 2, 'decline')}
                  sx={{ fontSize: '0.7rem', padding: '4px 8px' }}
                >
                  Decline
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleRescheduleClick(id)}
                  sx={{ fontSize: '0.7rem', padding: '4px 8px' }}
                >
                  Reschedule
                </Button>
              </Grid>
            </Grid>
          );
        } 
        else if (status === 1 && rescheduled === 1) {
          return (
            <Button
              variant="contained"
              style={{ backgroundColor: '#64b6d1', fontSize: '0.7rem', color: 'black' }}
              disabled
              endIcon={<CachedIcon />} // Add the Cached icon before the text
            >
              Booked
            </Button>
          );
        }
        
        else if (status === 1) {
          return (
            <Button
              variant="contained"
              style={{ backgroundColor: '#64b6d1', fontSize: '0.7rem', color:'black' }}
              disabled
              endIcon={<CheckCircleIcon />}
            >
              Booked
            </Button>
          );
        }
        
        else if (status === 2) {
          return (
            <Button
              variant="contained"
              style={{ backgroundColor: '#dba2af', fontSize: '0.7rem', color:'black' }}
              disabled
              endIcon={<CancelIcon/>}
            >
              Declined
            </Button>
          );
        }

        return null;
      },
    },
  ];

  // Handle appointment status change with confirmation
  const handleButtonClick = (id, action, actionName) => {
    alertify.confirm(
      `<div style="color: black; font-size: 16px; text-align: center;">` + // Inline styles here
      `<p>Are you sure you want to ${actionName} the booking?</p>` +
      `</div>`,
      function () {
        handleStatusChange(id, action);
        alertify.success(`${actionName.charAt(0).toUpperCase() + actionName.slice(1)}!`);
      },
      function () {
        alertify.error('Action canceled');
      }
    ).set({ labels: { ok: 'Yes', cancel: 'No' }, padding: false });
  };

  // Handle appointment status change
  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/appointment/update/${id}`, { status });
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === id ? { ...appointment, status } : appointment
        )
      );
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  // Handle reschedule button click
  const handleRescheduleClick = (id) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewDateTime(null);
    setError('');
  };

  // Validate and send new date and time to API
  const handleConfirmReschedule = async () => {
    if (!newDateTime) {
      alertify.error("Please select a datetime");
      setError('Please select a valid date and time.');
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/appointment/update/${selectedId}`, { rescheduled_dateTime: newDateTime,rescheduled: 1,status: 1 });
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === selectedId ? { ...appointment, dateTime: newDateTime } : appointment
        )
      );
      handleCloseModal();
      alertify.success('Appointment rescheduled successfully!');
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      alertify.error('Failed to reschedule appointment.');
    }
  };

  return (
    <div style={{ height: 600, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Appointments
      </Typography>
      <Typography variant="body1" gutterBottom>
        Here you can manage your appointments. View, edit, or delete appointments as needed.
      </Typography>
      <DataGrid
        rows={appointments}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        getRowId={(row) => row.id || row._id || Math.random()}
      />

      {/* Modal for Rescheduling Appointment */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Reschedule Appointment</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Select Date and Time"
              value={newDateTime}
              onChange={setNewDateTime}
              renderInput={(params) => <TextField {...params} helperText={error} error={!!error} />}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">Cancel</Button>
          <Button onClick={handleConfirmReschedule} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Appointments;
