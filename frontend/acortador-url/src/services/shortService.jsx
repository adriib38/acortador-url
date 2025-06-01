import { ENDPOINTS } from "../api/endpoints";
import { refresh } from "./authService";


export const short = async (longUrl, token) => {
  try {
    let resp = await fetch(ENDPOINTS.shortLink.create, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        "url": longUrl,
      }),
    });

    if (resp.status === 200) {
      const data = await resp.json();
      return { status: resp.status, data: data };
    } else if (resp.status === 401) {
      // Intentar refrescar el token
      console.log("Token expirado, intentando refrescar...");
      try {
        const refreshResp = await refresh();
        if (refreshResp.status === 200 && refreshResp.data.access_token) {
          const newToken = refreshResp.data.access_token;
          // Reintentar la petición con el nuevo token
          resp = await fetch(ENDPOINTS.shortLink.create, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${newToken}`
            },
            body: JSON.stringify({
              "url": longUrl,
            }),
          });
          if (resp.status === 200) {
            const data = await resp.json();
            return { status: resp.status, data: data };
          } else {
            const data = await resp.json();
            throw new Error(data.message || "Error al acortar la URL tras refresh");
          }
        } else {
          throw new Error("No se pudo refrescar el token");
        }
      } catch (refreshError) {
        throw new Error("Error al refrescar el token: " + refreshError.message);
      }
    } else {
      const data = await resp.json();
      throw new Error(data.message || "Error al acortar la URL");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

