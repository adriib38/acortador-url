import { ENDPOINTS } from "../api/endpoints";
import { useAuth } from "../auth/AuthContext";



export const login = async (credentials) => {
  try {
    const resp = await fetch(ENDPOINTS.auth.login, {
      method: "POST",
      credentials: 'include', 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    });

    const data = await resp.json();
    return { status: resp.status, data: data };
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};

export const refresh = async () => {

  try {
    const resp = await fetch(ENDPOINTS.auth.refresh, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
      },
      credentials: "include",
      
    });

    const data = await resp.json();
    return { status: resp.status, data: data };
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
}


export const logout = () => {};

export function getUser() {
  
  const user = localStorage.getItem('user');
  console.log("Devolviendo el usuario de localStorage:", user)
  return user ? JSON.parse(user) : null;
}
