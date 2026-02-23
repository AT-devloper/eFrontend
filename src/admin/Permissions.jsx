import { useState, useEffect } from "react";
import { createPermission, getPermissions } from "../services/rbacService";
import { Box, Button, TextField, Typography, MenuItem } from "@mui/material";

export default function Permissions() {
  const [module, setModule] = useState("");
  const [action, setAction] = useState("");
  const [permissions, setPermissions] = useState([]);

  // Load existing permissions from backend
  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = () => {
    getPermissions().then((res) => {
      setPermissions(res.data);
    });
  };

  // Handle creating a new permission
  const handleCreate = () => {
    if (!module || !action) return;

    // Auto-generate unique code
    const code = `${module.toUpperCase()}_${action.toUpperCase()}`;

    // Prevent duplicate permission
    if (permissions.find((p) => p.code === code)) {
      alert("This permission already exists!");
      return;
    }

    createPermission({ code, module }).then(() => {
      setModule("");
      setAction("");
      loadPermissions();
    });
  };

  // Group permissions by module
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission.code.split("_")[1]); // Show action only
    return acc;
  }, {});

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Module-Based Permission Management
      </Typography>

      {/* Create New Permission */}
      <Box display="flex" gap={2} mb={4}>
        <TextField
          select
          label="Module"
          value={module}
          onChange={(e) => setModule(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="PERMISION">PERMISION</MenuItem>
           <MenuItem value="ROLE">ROLE</MenuItem>
          <MenuItem value="ATTRIBUTE">ATTRIBUTE</MenuItem>
          <MenuItem value="PRODUCT">PRODUCT</MenuItem>
          <MenuItem value="CATEGORY">CATEGORY</MenuItem>
        </TextField>

        <TextField
          label="Action"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          size="small"
        />

        <Button variant="contained" onClick={handleCreate}>
          Create
        </Button>
      </Box>

      {/* Existing Permissions List */}
      <Typography variant="h6" mb={2}>
        Existing Permissions
      </Typography>

      {Object.keys(groupedPermissions).map((moduleName) => (
        <Box key={moduleName} mb={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            {moduleName}
          </Typography>
          <Typography variant="body2">
            {groupedPermissions[moduleName].join(", ")}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}