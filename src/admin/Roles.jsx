import { useState, useEffect } from "react";
import { createRole, getRoles } from "../services/rbacService";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function Roles() {
  const [name, setName] = useState("");
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = () => {
    getRoles().then(res => setRoles(res.data));
  };

  const handleCreate = () => {
    createRole({ name }).then(() => {
      setName("");
      loadRoles();
    });
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>Create Role</Typography>

      <TextField
        label="Role Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        size="small"
        sx={{ mr: 2 }}
      />

      <Button variant="contained" onClick={handleCreate}>
        Create
      </Button>

      <Box mt={4}>
        <Typography variant="h6">Existing Roles</Typography>
        {roles.map(role => (
          <Typography key={role.id}>{role.name}</Typography>
        ))}
      </Box>
    </Box>
  );
}
