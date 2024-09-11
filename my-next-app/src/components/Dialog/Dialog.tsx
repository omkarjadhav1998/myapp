import React, { useState, useEffect } from "react";
import UserService from "@/services/userService";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";

type CreateUserProps = {
  onClose: () => void; // Function to close the dialog
  refreshUsers: () => void; // Function to refresh the users list
  user: Users | null; // Optional user for editing
  isEditable: boolean;
};

type Users = {
  _id?: string;
  name?: string;
  role?: string;
  age?: number;
  date?: Date;
};

export default function CreateUser({
  onClose,
  refreshUsers,
  user,
  isEditable,
}: CreateUserProps) {
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [age, setAge] = useState<number | undefined>(undefined);
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    if (user) {
      // Pre-fill the form if editing an existing user
      setName(user.name || "");
      setRole(user.role || "");

      if (!isEditable) {
        setAge(user.age);
        setDate(user.date ? user.date.toISOString().split("T")[0] : "");
      }
    }
  }, [isEditable, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDate = date ? new Date(date) : undefined;
    try {
      if (user?._id) {
        // Update existing user
        await UserService.updateUsers(user._id, { name, role });
      } else {
        // Add new user
        await UserService.addUsers({ name, role, age, date: formattedDate });
      }
      refreshUsers(); // Refresh the users list after adding/updating
      onClose(); // Close the dialog
    } catch (err) {
      console.log("Error saving user", err);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogContent>
        <Typography variant='h5' gutterBottom>
          {user ? "Edit User" : "Create User"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Name'
                variant='outlined'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Role'
                variant='outlined'
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </Grid>
            {!isEditable && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Age'
                    variant='outlined'
                    value={age || ""}
                    onChange={(e) => setAge(parseInt(e.target.value, 10))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type='date'
                    label='Date'
                    variant='outlined'
                    InputLabelProps={{ shrink: true }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Grid>
              </>
            )}
          </Grid>
          <DialogActions>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              style={{ marginTop: "16px" }}
            >
              Submit
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              onClick={onClose}
              style={{ marginTop: "16px" }}
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
