import api from "../api/axiosInstance";

// PERMISSIONS
export const createPermission = (data) =>
  api.post("/rbac/permissions", data);

export const getPermissions = () =>
  api.get("/rbac/permissions");

export const deletePermission = (id) =>
  api.delete(`/auth/rbac/permissions/${id}`);

// ROLES
export const createRole = (data) =>
  api.post("/rbac/roles", data);

export const getRoles = () =>
  api.get("/rbac/roles");

// ROLE → PERMISSIONS
export const assignPermissionsToRole = (roleId, permissionIds) =>
  api.put(`/rbac/role-permissions/${roleId}`, permissionIds);

// USER → ROLE
export const assignRoleToUser = (userId, roleId) =>
  api.post(`/rbac/user-roles?userId=${userId}&roleId=${roleId}`);