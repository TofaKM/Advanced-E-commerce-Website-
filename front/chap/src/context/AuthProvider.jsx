import { registerUser, loginUser, loggedUser, logoutUser } from '../APIs/authAPIs';
import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuth = async () => {
      setLoading(true);
      try {
        const data = await loggedUser();
        console.log('loggedUser response:', data); // Debug
        if (data?.loggedIn) {
          setUser(data.user);
          setRole(data.role);
          setId(data.user.user_id); // Fix: Use data.user.user_id
          setSuccess(true);
        } else {
          setUser(null);
          setRole(null);
          setId(null);
          setSuccess(false);
        }
      } catch (error) {
        console.error('loggedUser error:', error); // Debug
        setError(error);
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };
    fetchAuth();
  }, []);

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await registerUser(userData);
      setUser(data.user);
      setRole(data.role);
      setId(data.user.user_id); // Fix: Use data.user.user_id
      setError(null);
      setSuccess(true);
      return { success: true, user: data.user };
    } catch (error) {
      setError(error);
      setSuccess(false);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    setLoading(true);
    try {
      const data = await loginUser(userData);
      setUser(data.user);
      setRole(data.role);
      setId(data.user.user_id); // Fix: Use data.user.user_id
      setError(null);
      setSuccess(true);
      return { success: true, user: data.user, role: data.role, user_id: data.user.user_id };
    } catch (error) {
      setError(error);
      setSuccess(false);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      setRole(null);
      setId(null);
      setSuccess(true);
      setError(null);
      return { success: true };
    } catch (error) {
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        id,
        loading,
        success,
        error,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}