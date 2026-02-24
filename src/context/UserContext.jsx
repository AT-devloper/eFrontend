import { createContext, useState, useEffect, useContext } from "react";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔄 Load user & roles from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRoles = localStorage.getItem("roles");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const roles = parsedRoles(parsedUser, storedRoles);
        const roleLabel = computeRoleLabel(roles);

        const fullUser = {
          ...parsedUser,
          roles,
          roleLabel,
          // 🔹 Role helpers
          isSuperAdmin: () => roles.includes("SUPER_ADMIN"),
          isAdmin: () => roles.includes("ADMIN"),
          isSeller: () => roles.includes("SELLER"),
          isUser: () => roles.length === 0,
        };

        setUser(fullUser);

        console.log("🟢 User loaded:", fullUser);
        console.log("🟢 Role:", roleLabel);
      } catch (e) {
        console.error("❌ Error parsing user from storage", e);
        localStorage.removeItem("user");
        localStorage.removeItem("roles");
      }
    } else {
      console.log("🔴 No user logged in");
    }
  }, []);

  // 🔹 Helpers to parse roles
  const parsedRoles = (parsedUser, storedRoles) => {
    if (parsedUser.roles && parsedUser.roles.length > 0) return parsedUser.roles;
    if (storedRoles) return JSON.parse(storedRoles);
    return []; // Google user with no roles
  };

  // 🔹 Compute role label for admin panel / console
  const computeRoleLabel = (roles) => {
    if (roles.includes("SUPER_ADMIN")) return "SUPER_ADMIN";
    if (roles.includes("ADMIN")) return "ADMIN";
    if (roles.includes("SELLER")) return "SELLER";
    return "USER"; // default for Google users or no roles
  };

  // 🔓 Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("roles");
    setUser(null);
    console.log("🚪 User logged out");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};