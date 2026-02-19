import { useState } from "react";
import { assignRoleToUser } from "../services/rbacService";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function AssignRole() {
  const [userId, setUserId] = useState("");
  const [roleId, setRoleId] = useState("");

  const handleAssign = () => {
    assignRoleToUser(userId, roleId)
      .then(() => alert("Role assigned successfully"))
      .catch(() => alert("Assignment failed"));
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>Assign Role To User</Typography>

      <TextField
        label="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        size="small"
        sx={{ mr: 2 }}
      />

      <TextField
        label="Role ID"
        value={roleId}
        onChange={(e) => setRoleId(e.target.value)}
        size="small"
        sx={{ mr: 2 }}
      />

      <Button variant="contained" onClick={handleAssign}>
        Assign
      </Button>
    </Box>
  );
}
