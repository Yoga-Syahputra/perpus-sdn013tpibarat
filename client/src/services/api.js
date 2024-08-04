import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

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

export const adminLogin = async (credentials) => {
  try {
    const response = await api.post("/admin/login", credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("There was an error logging in!", error);
    throw error;
  }
};
