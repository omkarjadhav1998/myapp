// pages/index.tsx
import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import UserService from "@/services/userService";
import CreateUser from "@/components/Dialog/Dialog";
import UserCalender from "@/components/Calender/Calender"; // Import the calendar component

type Users = {
  _id: string;
  name: string;
  role: string;
  age: number;
  date: Date;
};

export default function BasicTable() {
  const [users, setUsers] = useState<Users[]>([]);
  const [open, setOpen] = useState(false); // State to manage dialog visibility
  const [editUser, setEditUser] = useState<Users | null>(null); // State to manage editing user
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // State to manage the selected date

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const userResponse = await UserService.fetchUsers();
      if (userResponse && Array.isArray(userResponse)) {
        setUsers(userResponse);
      } else {
        setUsers([]);
        console.error("Unexpected response format:", userResponse);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const handleAddClick = () => {
    setEditUser(null);
    setOpen(true); // Open dialog for adding a new user
  };

  const handleEditClick = (user: Users) => {
    setEditUser(user);
    setOpen(true); // Open dialog for editing an existing user
  };

  const handleCloseDialog = () => {
    setOpen(false); // Close dialog
    setEditUser(null); // Reset edit user
  };

  const handleRedirect = (date: Date) => {
    setSelectedDate(date); // Set the selected date
  };

  const handleDelete = async (id: string) => {
    try {
      await UserService.deleteUsers(id);
      loadUsers(); // Refresh the users list after deleting
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "";

    // Convert string to Date object if necessary
    const parsedDate = typeof date === "string" ? new Date(date) : date;

    // Check if the Date object is valid
    if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
      return "Invalid date"; // Return a placeholder for invalid dates
    }

    // Format the valid Date object
    return new Intl.DateTimeFormat("en-US").format(parsedDate);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Button onClick={handleAddClick} color='secondary' variant='contained'>
          Add user
        </Button>

        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell align='center'>User Name</TableCell>
              <TableCell align='center'>Designation</TableCell>
              <TableCell align='center'>Age</TableCell>
              <TableCell align='center'>Date</TableCell>
              <TableCell align='center'>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((row) => (
              <TableRow
                key={row._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  transition: "background-color 0.3s", // Smooth background transition
                  "&:hover": {
                    backgroundColor: "#f5f5f5", // Light gray background on hover
                    cursor: "pointer", // Pointer on hover
                  },
                }}
              >
                <TableCell
                  component='th'
                  scope='row'
                  align='center'
                  sx={{
                    padding: "16px", // Adjust padding
                    fontWeight: "bold", // Make name bold
                    fontSize: "1rem", // Slightly larger font
                    color: "#333", // Dark text color for better readability
                  }}
                >
                  {row.name}
                </TableCell>
                <TableCell
                  align='center'
                  sx={{
                    padding: "16px",
                    fontSize: "0.9rem",
                    color: "#666", // Lighter text color for roles
                  }}
                >
                  {row.role}
                </TableCell>
                <TableCell
                  align='center'
                  sx={{
                    padding: "16px",
                    fontSize: "0.9rem",
                    color: "#666", // Lighter text color for age
                  }}
                >
                  {row.age}
                </TableCell>
                <TableCell
                  align='center'
                  onClick={() => handleRedirect(row.date)}
                  sx={{
                    padding: "16px",
                    fontSize: "0.9rem",
                    color: "#666",
                    textDecoration: "underline", // Underline date to indicate clickable
                    "&:hover": {
                      color: "#1976d2", // Change color on hover
                    },
                  }}
                >
                  {formatDate(row.date)}
                </TableCell>
                <TableCell align='center' sx={{ padding: "16px" }}>
                  <IconButton
                    onClick={() => handleEditClick(row)}
                    color='primary'
                    sx={{
                      marginRight: "8px", // Spacing between icons
                      "& .MuiSvgIcon-root": {
                        fontSize: "1.5rem", // Larger icon size
                      },
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.1)", // Light blue background on hover
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(row._id)}
                    color='secondary'
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: "1.5rem", // Larger icon size
                      },
                      "&:hover": {
                        backgroundColor: "rgba(220, 0, 78, 0.1)", // Light red background on hover
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for adding/editing a user */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{editUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <CreateUser
            onClose={handleCloseDialog}
            refreshUsers={loadUsers}
            user={editUser}
            isEditable={!!editUser}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='primary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for displaying the calendar */}
      <Dialog
        open={selectedDate !== null}
        onClose={() => setSelectedDate(null)}
      >
        <DialogTitle>Calendar</DialogTitle>
        <DialogContent>
          {selectedDate && (
            <UserCalender
              initialDate={selectedDate}
              onClose={() => setSelectedDate(null)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedDate(null)} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
