import {
  createContext,
  useContext,
  useState,
} from "react";
import API_URL from "../config/api";

const AuthContext =
  createContext();

/*
 * ================================
 * Get Stored User
 * ================================
 */

function getStoredUser() {
  const storedUser =
    localStorage.getItem(
      "fasfas_user"
    );

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(
      storedUser
    );
  } catch {
    localStorage.removeItem(
      "fasfas_user"
    );

    localStorage.removeItem(
      "fasfas_token"
    );

    localStorage.removeItem(
      "fasfas_authenticated"
    );

    return null;
  }
}

/*
 * ================================
 * Store Authentication
 * ================================
 */

function storeAuthentication(data) {
  if (!data?.user || !data?.token) {
    throw new Error(
      "Authentication succeeded without a user or token. Please try logging in again."
    );
  }

  localStorage.setItem(
    "fasfas_token",
    data.token
  );

  localStorage.setItem(
    "fasfas_user",
    JSON.stringify(
      data.user
    )
  );

  localStorage.setItem(
    "fasfas_authenticated",
    "true"
  );
}

/*
 * ================================
 * Auth Provider
 * ================================
 */

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(getStoredUser);

  const isAuthenticated =
    Boolean(user);

  /*
   * ================================
   * Register
   * ================================
   */

  const register = async ({
    name,
    email,
    password,
  }) => {
    const response =
      await fetch(
        `${API_URL}/api/users`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

    const data =
      await response.json();

    if (
      !response.ok ||
      !data.success
    ) {
      throw new Error(
        data.message ||
          "Unable to create account."
      );
    }

    storeAuthentication(data);

    setUser(data.user);

    return data.user;
  };

  /*
   * ================================
   * Login
   * ================================
   */

  const login = async (
    email,
    password
  ) => {
    const response =
      await fetch(
        `${API_URL}/api/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

    const data =
      await response.json();

    if (
      !response.ok ||
      !data.success
    ) {
      throw new Error(
        data.message ||
          "Unable to log in."
      );
    }

    storeAuthentication(data);

    setUser(data.user);

    return data.user;
  };

  /*
   * ================================
   * Update Profile
   * ================================
   */

  const updateProfile = async ({
    name,
    avatar,
    communityVisible,
  }) => {
    if (!user?.id) {
      throw new Error(
        "No authenticated user found."
      );
    }

    const token =
      localStorage.getItem(
        "fasfas_token"
      );

    if (!token) {
      throw new Error(
        "Your session has expired. Please log in again."
      );
    }

    const response =
      await fetch(
        `${API_URL}/api/users/${user.id}/profile`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            name,
            avatar,
            communityVisible,
          }),
        }
      );

    const data =
      await response.json();

    if (
      !response.ok ||
      !data.success
    ) {
      throw new Error(
        data.message ||
          "Unable to update profile."
      );
    }

    setUser(data.user);

    localStorage.setItem(
      "fasfas_user",
      JSON.stringify(
        data.user
      )
    );

    return data.user;
  };

  /*
   * ================================
   * Logout
   * ================================
   */

  const logout = () => {
    localStorage.removeItem(
      "fasfas_authenticated"
    );

    localStorage.removeItem(
      "fasfas_user"
    );

    localStorage.removeItem(
      "fasfas_token"
    );

    localStorage.removeItem(
      "fasfas_active_run"
    );

    setUser(null);
  };

  /*
   * ================================
   * Provider
   * ================================
   */

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        register,
        login,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/*
 * ================================
 * useAuth Hook
 * ================================
 */

export function useAuth() {
  return useContext(
    AuthContext
  );
}