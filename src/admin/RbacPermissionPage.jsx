import { useEffect, useState } from "react";
import { getRolePermissions, updateRolePermissions } from "../api/rbacApi";
import { useUser } from "../context/UserContext"; // import context
import { Box, Typography, Checkbox, FormControlLabel, Button, Paper } from "@mui/material";

// Define which roles each role can manage
const ROLE_HIERARCHY = {
  SUPER_ADMIN: ["ADMIN", "SELLER"],
  ADMIN: ["SELLER"],
  SELLER: [] // cannot manage anyone
};

export default function RbacPermissionPage() {
  const { user } = useUser(); // get logged-in user from context
  const [roleId, setRoleId] = useState("");
  const [permissions, setPermissions] = useState({});
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Get current user's highest role (or first role if multiple)
  const currentUserRole = user?.roles?.[0] || "";
  const manageableRoles = ROLE_HIERARCHY[currentUserRole] || [];

  /* ===============================
     LOAD PERMISSIONS FOR ROLE
  =============================== */
  useEffect(() => {
    if (!roleId) return;

    setLoading(true);

    getRolePermissions(roleId)
      .then((res) => {
        setPermissions(res.data);

        const assigned = new Set();
        Object.values(res.data).forEach((moduleList) => {
          moduleList.forEach((perm) => {
            if (perm.assigned) assigned.add(perm.id);
          });
        });

        setSelected(assigned);
      })
      .catch((err) => {
        console.error(err);
        alert("Server error while loading permissions");
      })
      .finally(() => setLoading(false));
  }, [roleId]);

  /* ===============================
     TOGGLE CHECKBOX
  =============================== */
  const togglePermission = (id) => {
    const updated = new Set(selected);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setSelected(updated);
  };

  /* ===============================
     SAVE PERMISSIONS
  =============================== */
  const handleSave = () => {
    if (!roleId) return alert("Select role first");

    updateRolePermissions(roleId, Array.from(selected))
      .then(() => alert("Permissions updated successfully"))
      .catch(() => alert("Update failed"));
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Role Permission Management
      </Typography>

      {/* ROLE SELECT */}
      <Box mb={3}>
        <Typography>Select Role</Typography>
        <select
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          style={{ padding: "8px", width: "200px" }}
          disabled={!currentUserRole} // disable until user is loaded
        >
          <option value="">-- Select --</option>
          {manageableRoles.includes("SUPER_ADMIN") && <option value="1">SUPER_ADMIN</option>}
          {manageableRoles.includes("ADMIN") && <option value="2">ADMIN</option>}
          {manageableRoles.includes("SELLER") && <option value="3">SELLER</option>}
        </select>
      </Box>

      {!roleId && <Typography>Please select a role</Typography>}
      {loading && <Typography>Loading...</Typography>}

      {/* MODULE WISE LIST */}
      {!loading &&
        roleId &&
        Object.entries(permissions).map(([moduleName, perms]) => (
          <Paper key={moduleName} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {moduleName}
            </Typography>

            {perms.map((perm) => (
              <FormControlLabel
                key={perm.id}
                control={
                  <Checkbox
                    checked={selected.has(perm.id)}
                    onChange={() => togglePermission(perm.id)}
                    disabled={perm.disabled}
                  />
                }
                label={perm.code}
              />
            ))}
          </Paper>
        ))}

      {roleId && manageableRoles.length > 0 && (
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Changes
        </Button>
      )}

      {manageableRoles.length === 0 && (
        <Typography>You do not have permission to manage any roles.</Typography>
      )}
    </Box>
  );
}