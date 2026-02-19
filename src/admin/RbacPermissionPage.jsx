import { useEffect, useState } from "react";
import {
  getRolePermissions,
  updateRolePermissions
} from "../api/rbacApi";
import RoleSelector from "../components/auth/RoleSelector";

export default function RbacPermissionPage() {

  const [roleId, setRoleId] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);

  /* ===============================
     GET ROLES SAFELY
  =============================== */

  const storedRoles = JSON.parse(localStorage.getItem("roles") || "[]");

  // Remove ROLE_ prefix if exists
  const currentUserRoles = storedRoles.map(role =>
    role.replace("ROLE_", "")
  );

  /* ===============================
     ROLE HIERARCHY
  =============================== */

  const roles =
  currentUserRoles.includes("SUPER_ADMIN")
    ? [
        { id: 2, name: "ADMIN" },
        { id: 3, name: "SELLER" }  // ✅ correct ID
      ]
    : currentUserRoles.includes("ADMIN")
      ? [
          { id: 3, name: "SELLER" }  // ✅ correct ID
        ]
      : [];


  /* ===============================
     LOAD PERMISSIONS
  =============================== */

  useEffect(() => {
    if (!roleId) return;

    setLoading(true);

    getRolePermissions(roleId)
      .then(res => {
        setPermissions(res.data);

        const assigned = new Set();
        Object.values(res.data)
          .flat()
          .forEach(p => {
            if (p.assigned) assigned.add(p.id);
          });

        setSelected(assigned);
      })
      .catch(err => {
        console.error(err);
        alert("Not allowed or session expired");
        setPermissions({});
        setSelected(new Set());
      })
      .finally(() => setLoading(false));

  }, [roleId]);

  /* ===============================
     TOGGLE PERMISSION
  =============================== */

  const togglePermission = (id) => {
    const copy = new Set(selected);
    copy.has(id) ? copy.delete(id) : copy.add(id);
    setSelected(copy);
  };

  /* ===============================
     SAVE
  =============================== */

  const savePermissions = () => {
    if (!roleId) return;

    updateRolePermissions(roleId, Array.from(selected))
      .then(() => alert("Permissions updated successfully"))
      .catch(() => alert("Update failed"));
  };

  /* ===============================
     UI
  =============================== */

  return (
    <div style={{ padding: "20px", maxWidth: "700px" }}>
      <h2>Role Permission Management</h2>

      {roles.length === 0 && (
        <p style={{ color: "red" }}>
          You do not have permission to manage roles.
        </p>
      )}

      {roles.length > 0 && (
        <RoleSelector
          roles={roles}
          value={roleId}
          onChange={setRoleId}
        />
      )}

      {!roleId && roles.length > 0 && (
        <p>Please select a role</p>
      )}

      {loading && <p>Loading permissions...</p>}

      {!loading && roleId && Object.entries(permissions).map(([module, perms]) => (
        <div
          key={module}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "12px",
            borderRadius: "6px"
          }}
        >
          <h4>{module}</h4>

          {perms.map(p => (
            <label
              key={p.id}
              style={{ display: "block" }}
            >
              <input
                type="checkbox"
                checked={selected.has(p.id)}
                disabled={p.disabled}
                onChange={() => togglePermission(p.id)}
              />{" "}
              {p.code}
            </label>
          ))}
        </div>
      ))}

      {roleId && (
        <button
          onClick={savePermissions}
          style={{
            padding: "8px 16px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Save Changes
        </button>
      )}
    </div>
  );
}
