import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

const Layout = () => {
  return (
    <div className="relative h-screen w-full">
      <div className="min-h-screen grid grid-rows-[auto_1fr_auto] ">
        <div className="sticky top-0 h-16  bg-black text-white z-10">
          <AppHeader />
        </div>

        <div className=" ">
          <Outlet />
        </div>
        <div className="h-14   bg-amber-400 sticky bottom-0">
          <AppFooter />
        </div>
      </div>
    </div>
  );
};

export default Layout;
