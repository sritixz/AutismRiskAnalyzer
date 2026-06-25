import axiosInstance from "./axios";

/**
 * @param {{ parentEmail: string, password: string, childName: string, childAgeMonths: number }} payload
 */
export const signup = async (payload) => {
  const { data } = await axiosInstance.post("/auth/signup", payload);
  return data;
};

/**
 * @param {{ parentEmail: string, password: string }} payload
 */
export const login = async (payload) => {
  const { data } = await axiosInstance.post("/auth/login", payload);
  return data;
};

export const getProfile = async () => {
  const { data } = await axiosInstance.get("/auth/profile");
  return data;
};

/**
 * @param {{ childName?: string, childAgeMonths?: number }} payload
 */
export const updateProfile = async (payload) => {
  const { data } = await axiosInstance.patch("/auth/profile", payload);
  return data;
};
