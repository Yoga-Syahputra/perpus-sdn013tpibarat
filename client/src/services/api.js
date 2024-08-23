import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

 // visitor api
export const addVisitor = async (visitor) => {
  try {
    const response = await api.post("/visitors", visitor);
    return response.data;
  } catch (error) {
    console.error("There was an error adding the visitor!", error);
    throw error;
  }
};

export const getVisitors = async () => {
  try {
    const response = await api.get("/visitors");
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the visitors!", error);
    throw error;
  }
};

export const deleteVisitor = async (id) => {
  try {
    const response = await api.delete(`/visitors/${id}`);
    return response.data;
  } catch (error) {
    console.error("There was an error deleting the visitor!", error);
    throw error;
  }
};

export const editVisitor = async (id, updatedVisitor) => {
  try {
    const response = await api.put(`/visitors/${id}`, updatedVisitor);
    return response.data;
  } catch (error) {
    console.error("There was an error editing the visitor!", error);
    throw error;
  }
};

// admin api
export const adminLogin = async (credentials) => {
  try {
    const response = await api.post("/admin/login", credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    console.error("There was an error logging in!", error);
    throw error;
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.post(
      "/admin/change-password",
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("There was an error changing the password!", error);
    throw error;
  }
};

// guru api
export const addGuru = async (guru) => {
  try {
    const response = await api.post("/guru", guru);
    return response.data;
  } catch (error) {
    console.error("There was an error adding the guru!", error);
    throw error;
  }
};

export const getGurus = async () => {
  try {
    const response = await api.get("/guru");
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the guru!", error);
    throw error;
  }
};

export const deleteGuru = async (id) => {
  try {
    const response = await api.delete(`/guru/${id}`);
    return response.data;
  } catch (error) {
    console.error("There was an error deleting the guru!", error);
    throw error;
  }
};

export const changePasswordGuru = async (id, password) => {
  try {
    const response = await api.put(`/guru/${id}/password`, {
      password,
    });
    return response.data;
  } catch (error) {
    console.error("There was an error changing the guru's password!", error);
    throw error;
  }
};

export const guruLogin = async (credentials) => {
  try {
    const response = await api.post("/guru/login", credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    localStorage.setItem("guruToken", response.data.token);
    return response.data;
  } catch (error) {
    console.error("There was an error logging in!", error);
    throw error;
  }
};


