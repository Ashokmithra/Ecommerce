import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ProductList from "@/features/products/components/ProductList";
import SearchSortBar from "@/features/products/components/SearchSortBar";
import SideBar from "@/features/products/components/SideBar";
import { useState } from "react";

const Home = () => {
  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <div className="flex h-full w-full">
      <SidebarProvider>
        <SideBar onResetSearch={setSearchValue} />
        <div className="content flex flex-col h-full w-full ">
          <div className="searchbar w-full h-15 bg-blue-500 sticky top-16 pr-4 pl-2 flex  items-center z-10">
            <SidebarTrigger className="bg-blue-500 text-white mr-4  " />
            <SearchSortBar
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
          </div>
          <div className="">
            <ProductList />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Home;
