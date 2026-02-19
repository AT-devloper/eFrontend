import api from "./axiosInstance";

// Get permissions for a role
export const getRolePermissions = (roleId) => {
  return api.get(`/auth/rbac/roles/${roleId}/permissions`);
};

// Update permissions for a role
export const updateRolePermissions = (roleId, permissionIds) => {
  return api.put(`/auth/rbac/roles/${roleId}/permissions`, permissionIds);
};
