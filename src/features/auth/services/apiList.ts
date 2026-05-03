import api from "@/services/api";

export const loginData = (frmData: Record<string, string | number>) => {
  return api.post("auth/login", frmData);
};

export const getCurrentUserData = () => {
  return api.get("auth/me");
};
