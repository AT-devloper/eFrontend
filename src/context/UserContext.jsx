import { createContext, useState, useEffect, useContext } from "react";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔄 Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRoles = localStorage.getItem("roles");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const parsedRoles = storedRoles ? JSON.parse(storedRoles) : [];

        // Ensure roles are attached to user object
        setUser({
          ...parsedUser,
          roles: parsedUser.roles || parsedRoles || [],
        });
      } catch (e) {
        console.error("Error parsing user from storage", e);
        localStorage.removeItem("user");
        localStorage.removeItem("roles");
      }
    }
  }, []);

  // 🔓 Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("roles");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
