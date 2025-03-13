import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Avatar, List, ListItem, ListItemText } from "@mui/material";

const ReviewModal = ({ open, onClose, user, mode, handleApprove, handleReject }) => {

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>User Review - {user.name}</DialogTitle>
      <DialogContent dividers>
        <div className="grid grid-cols-2 gap-4 p-4 max-h-[600px] overflow-y-auto">
          {/* Profile Picture */}
          <div className="col-span-2 flex justify-center">
            {user.profile_picture_url ? (
              <Avatar src={user.profile_picture_url} alt={user.name} sx={{ width: 80, height: 80 }} />
            ) : (
              <Avatar sx={{ width: 80, height: 80 }}>{user.name[0]}</Avatar>
            )}
          </div>

          {/* Basic Info */}
          <div><strong>ID:</strong> {user.id}</div>
          <div><strong>Name:</strong> {user.name}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Status:</strong> {user.status === 0 ? "Pending" : "Active"}</div>
          <div><strong>Role:</strong> {user.role_name || "N/A"}</div>
          <div><strong>Phone:</strong> {user.phone || "N/A"}</div>

          {/* Address */}
          <div><strong>Address:</strong> {user.address || "N/A"}</div>
          <div><strong>City:</strong> {user.city || "N/A"}</div>
          <div><strong>State:</strong> {user.state || "N/A"}</div>
          <div><strong>Country:</strong> {user.country || "N/A"}</div>
          <div><strong>Postal Code:</strong> {user.postal_code || "N/A"}</div>

          {/* Login Info */}
          <div><strong>Last Login:</strong> {user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}</div>
          <div><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</div>
          <div><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</div>

          {/* Company Details */}
          <div><strong>Company Name:</strong> {user.company_name || "N/A"}</div>
          <div><strong>Website:</strong> {user.website ? <a href={user.website} target="_blank" rel="noopener noreferrer">{user.website}</a> : "N/A"}</div>
          <div><strong>Service Category:</strong> {user.service_category || "N/A"}</div>
          <div><strong>Years of Experience:</strong> {user.years_of_experience || "N/A"}</div>

          {/* Coverage Area */}
          <div className="col-span-2">
            <strong>Coverage Area:</strong>
            {user.coverage_area && user.coverage_area.length > 0 ? (
              <List dense>
                {user.coverage_area.map((area, index) => (
                  <ListItem key={index}><ListItemText primary={area} /></ListItem>
                ))}
              </List>
            ) : "N/A"}
          </div>

          {/* License & Insurance */}
          <div><strong>License Number:</strong> {user.license_number || "N/A"}</div>
          <div><strong>Insurance Policy:</strong> {user.insurance_policy || "N/A"}</div>

          {/* References */}
          <div className="col-span-2">
            <strong>References:</strong>
            {user.references && user.references.length > 0 ? (
              <List dense>
                {user.references.map((ref, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`${ref.name} - ${ref.phone}`} />
                  </ListItem>
                ))}
              </List>
            ) : "N/A"}
          </div>

          {/* Description */}
          <div className="col-span-2"><strong>Description:</strong> {user.description || "N/A"}</div>

          {/* Files */}
          <div className="col-span-2">
            <strong>Files:</strong>
            {user.files && user.files.length > 0 ? (
              <List dense>
                {user.files.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={file._relativePath || "N/A"} />
                  </ListItem>
                ))}
              </List>
            ) : "N/A"}
          </div>

          {/* Additional Info */}
          <div><strong>License Number:</strong> {user.licenseNumber || "N/A"}</div>
          <div><strong>Issuing Authority:</strong> {user.issuingAuthority || "N/A"}</div>
          <div><strong>Specialties:</strong> {user.specialties || "N/A"}</div>
          <div><strong>Affiliations:</strong> {user.affiliations || "N/A"}</div>
        </div>
      </DialogContent>

      {/* Buttons */}
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="default">Close</Button>
        {mode !== "view" && (
          <>
            <Button onClick={() => handleReject(user.id)} variant="contained" color="error">Reject</Button>
            <Button onClick={() => handleApprove(user.id)} variant="contained" color="primary">Approve</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ReviewModal;
