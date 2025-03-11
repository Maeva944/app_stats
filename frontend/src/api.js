const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * Fonction générique pour les requêtes API.
 */
export async function fetchData(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Erreur API :", error);
    throw error;
  }
}

/**
 * Récupérer des données (GET)
 */
export async function getData(endpoint) {
  return fetchData(endpoint, { method: "GET" });
}

/**
 * Envoyer des données (POST)
 */
export async function postData(endpoint, body) {
  return fetchData(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Mettre à jour des données (PUT)
 */
export async function putData(endpoint, body) {
  return fetchData(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

/**
 * Supprimer des données (DELETE)
 */
export async function deleteData(endpoint) {
  return fetchData(endpoint, { method: "DELETE" });
}

export async function postFormData(endpoint, formData) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        body: formData, // Pas besoin de `Content-Type`, FormData le gère automatiquement
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("❌ Erreur API (Upload) :", error);
      throw error;
    }
  }
  