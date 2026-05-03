import { SiApplepodcasts } from "react-icons/si";
import { AiOutlineHome, AiOutlineShoppingCart } from "react-icons/ai";
import { IoLogOutOutline, IoLogInSharp } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { clearLocalStorage } from "@/utils/localStorage";
import { useGetCurrentUser } from "@/features/auth/hooks/auth";
import useCart from "@/hooks/useCart";
import { Badge } from "../ui/badge";

const AppHeader = () => {
  const queryClient = useQueryClient();
  const { data: userData } = useGetCurrentUser();
  const navigate = useNavigate();
  const cartLength = useCart().getUserCartDataLength;

  const logout = () => {
    queryClient.clear();
    clearLocalStorage();
    navigate("login", { replace: true });
  };

  return (
    <div className="h-full w-full flex min-w-sm">
      <div className="flex logo  min-w-1/4 items-center text-2xl font-bold p-4">
        <SiApplepodcasts />
        MYSHOPIFY
      </div>
      <div className="flex grow justify-end  items-center p-4 gap-4">
        <div className=" min-w-16 max-w-25 text-lg">
          {userData && `Hello ${userData?.data?.firstName}`}
        </div>
        <NavLink
          to="/cart"
          className="flex flex-col items-center  min-w-16 max-w-20"
        >
          <div className="flex gap-0.5 items-center">
            <AiOutlineShoppingCart />
            {cartLength() !== 0 && (
              <Badge className="bg-blue-500 h-4.5 w-4.5">{cartLength()}</Badge>
            )}
          </div>
          Cart
        </NavLink>
        <NavLink
          to="/"
          className="flex flex-col items-center  min-w-16 max-w-20"
        >
          <AiOutlineHome />
          Home
        </NavLink>
        {userData ? (
          <button
            onClick={() => logout()}
            className="flex flex-col items-center  min-w-16 max-w-20"
          >
            <IoLogOutOutline color="white" />
            Logout
          </button>
        ) : (
          <NavLink
            to="/login"
            className="flex flex-col items-center  min-w-16 max-w-20"
          >
            <IoLogInSharp color="white" />
            Login
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default AppHeader;
