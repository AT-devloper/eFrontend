import api from "./axiosInstance";

// ROLE → PERMISSIONS
export const getRolePermissions = (roleId) =>
  api.get(`/rbac/roles/${roleId}/permissions`);

export const updateRolePermissions = (roleId, permissionIds) =>
  api.put(`/rbac/roles/${roleId}/permissions`, permissionIds);

// ALL PERMISSIONS
export const getPermissions = () =>
  api.get("/rbac/permissions");