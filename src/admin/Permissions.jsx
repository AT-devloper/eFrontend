import { useState, useEffect } from "react";
import { createPermission, getPermissions } from "../services/rbacService";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function Permissions() {
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = () => {
    getPermissions().then(res => setPermissions(res.data));
  };

  const handleCreate = () => {
    createPermission({ code: name }).then(() => {
      setName("");
      loadPermissions();
    });
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>Create Permission</Typography>

      <TextField
        label="Permission Code"
        value={name}
        onChange={(e) => setName(e.target.value)}
        size="small"
        sx={{ mr: 2 }}
      />

      <Button variant="contained" onClick={handleCreate}>
        Create
      </Button>

      <Box mt={4}>
        <Typography variant="h6">Existing Permissions</Typography>
        {permissions.map(p => (
          <Typography key={p.id}>{p.code}</Typography>
        ))}
      </Box>
    </Box>
  );
}
