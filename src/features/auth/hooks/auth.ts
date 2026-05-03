import { getLocalStorageItem, storeLocalStorage } from "@/utils/localStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getCurrentUserData, loginData } from "../services/apiList";

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginmutation = useMutation({
    mutationFn: loginData,
    onError: () => {
      toast.error("Invalid Credentails: Email/Password is incorrect");
    },
    onSuccess: async (responseData) => {
      storeLocalStorage(responseData.data);
      await queryClient.invalidateQueries({
        queryKey: ["userValidation", "cart"],
      });
      navigate("/dashboard", { replace: true });
      toast.success("Success! You have been logged in.");
    },
  });

  return {
    postLoginData: loginmutation,
  };
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["userValidation"],
    queryFn: getCurrentUserData,
    enabled: !!getLocalStorageItem("accessToken"),
    retry: false,
  });
};
