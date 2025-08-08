const API_URL = `${import.meta.env.VITE_API_URL}/api`; // <-- PONER EL PUERTO DE CADA UNO DEL BACK

export const authenticateUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/Authenticate/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Email: email, Password: password }),
    });

    if (!response.ok) {
      throw new Error("Error de autenticación");
    }

    const token = await response.text();
    return { token };
  } catch (error) {
    console.error("Fallo en authenticateUser:", error);
    throw error;
  }
};
