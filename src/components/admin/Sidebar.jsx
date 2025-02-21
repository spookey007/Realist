// src/components/Sidebar.jsx
import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { Dashboard, CalendarToday, Person, Contacts, Assessment, ExitToApp } from '@mui/icons-material';

const Sidebar = () => {
  return (
    <List sx={{
      bgcolor: 'background.default',
      color: 'red',
    }}>
      <ListItem button component={Link} to="/admin">
        <ListItemIcon>
          <Dashboard />
        </ListItemIcon>
        <ListItemText primary="Dashboard" sx={{ color: 'black' }} />
      </ListItem>
      <ListItem button component={Link} to="/admin/appointments">
        <ListItemIcon>
          <CalendarToday />
        </ListItemIcon>
        <ListItemText primary="Appointments" sx={{ color: 'black' }}/>
      </ListItem>
      <ListItem button component={Link} to="/admin/users">
        <ListItemIcon>
          <Person />
        </ListItemIcon>
        <ListItemText primary="Users" sx={{ color: 'black' }} />
      </ListItem>
      <ListItem button component={Link} to="/admin/crm">
        <ListItemIcon>
          <Contacts />
        </ListItemIcon>
        <ListItemText primary="CRM" sx={{ color: 'black' }} />
      </ListItem>
      <ListItem button component={Link} to="/admin/reports">
        <ListItemIcon>
          <Assessment />
        </ListItemIcon>
        <ListItemText primary="Reports" sx={{ color: 'black' }} />
      </ListItem>
      <ListItem button component={Link} to="/admin/logout">
        <ListItemIcon>
          <ExitToApp />
        </ListItemIcon>
        <ListItemText primary="Logout" sx={{ color: 'black' }} />
      </ListItem>
    </List>
  );
};

export default Sidebar;
