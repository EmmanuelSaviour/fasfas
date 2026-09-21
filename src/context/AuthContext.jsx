import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext =
  createContext();

const API_URL = "";

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

    return null;
  }
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

    /*
     * Store only the safe user
     * information returned by
     * the backend.
     */

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

    /*
     * Store the authenticated
     * user.
     *
     * The backend never sends
     * passwordHash.
     */

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

    const response =
      await fetch(
        `${API_URL}/api/users/${user.id}/profile`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
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

    /*
     * Update React state.
     */

    setUser(data.user);

    /*
     * Update stored user so
     * the changes remain after
     * refreshing the page.
     */

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
    /*
     * Remove authentication.
     */

    localStorage.removeItem(
      "fasfas_authenticated"
    );

    /*
     * Remove stored user.
     */

    localStorage.removeItem(
      "fasfas_user"
    );

    /*
     * IMPORTANT:
     *
     * Remove any temporary
     * active run when the
     * runner logs out.
     *
     * This prevents a run from
     * today being restored when
     * the user logs back in.
     */

    localStorage.removeItem(
      "fasfas_active_run"
    );

    /*
     * Clear React authentication
     * state.
     */

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