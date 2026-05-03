import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { getAllCategories } from "../services/api";
import type { TCategory, TRating, TStock } from "../types";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Ratings, Stocks } from "../constant/productDetail";
import useDebounce from "@/hooks/useDebounce";

interface SideBarProps {
  onResetSearch: React.Dispatch<React.SetStateAction<string>>;
}

const SideBar = ({ onResetSearch }: SideBarProps) => {
  const allcategoryQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });
  const [searchParam, setSearchParam] = useSearchParams();
  const categories: Array<TCategory> = allcategoryQuery.data?.data;

  const minPrice = 0;
  const maxPrice = 1000;

  const [priceRange, setPriceRange] = useState<Array<number>>([
    minPrice,
    maxPrice,
  ]);
  const debouncevalue = useDebounce(priceRange, 300);
  const handlePriceChange = (pricerange: Array<number>) => {
    setPriceRange(pricerange);
  };
  useEffect(() => {
    const newParams = new URLSearchParams(searchParam);
    newParams.delete("price");

    newParams.set("price", priceRange.toString());
    setSearchParam(newParams);
  }, [debouncevalue]);
  const categorySelectionHandler = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onResetSearch("");
    setPriceRange([minPrice, maxPrice]);
    const newParams = new URLSearchParams();
    const { name } = event.currentTarget;
    newParams.set("category", name);
    setSearchParam(newParams);
  };

  const isCheckedHandler = (itemId: string, name: string): boolean => {
    const currentItems = searchParam.getAll(name);

    return currentItems.includes(itemId);
  };

  const chkChangeHandler = (
    value: string | boolean,
    itemId: string,
    name: string,
  ) => {
    const newParams = new URLSearchParams(searchParam);
    if (value) {
      newParams.append(name, itemId);
    } else {
      const updatevalue = searchParam
        .getAll(name)
        .filter((item) => item !== itemId);
      newParams.delete(name);
      updatevalue.forEach((item) => newParams.set(name, item));
    }
    setSearchParam(newParams);
  };

  return (
    <Sidebar
      variant="inset"
      collapsible="offcanvas"
      className="h-[calc(100vh-120px)] top-16 bg-slate-100  overflow-y-hidden "
    >
      <SidebarHeader title="Filters" className="  bg-slate-100">
        <h2 className="text-xl font-bold text-gray-600">Filters</h2>
      </SidebarHeader>

      <SidebarContent className="bg-slate-100">
        <SidebarGroup title="Category">
          <Collapsible className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center">
                Category
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent className="p-2">
              {categories &&
                categories.map((category: TCategory) => {
                  return (
                    <div
                      className="flex w-full items-center text-sm"
                      key={category.name}
                    >
                      <Button
                        className={`outline-none bg-blue-500!  hover:bg-black! w-full my-1 h-fit ${searchParam.get("category") === category.slug ? "bg-black!" : ""}`}
                        onClick={categorySelectionHandler}
                        name={category.slug}
                      >
                        {category.name}
                      </Button>
                    </div>
                  );
                })}
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
        <SidebarGroup title="priceRange">
          <SidebarGroupLabel>Price Range</SidebarGroupLabel>
          <SidebarGroupContent className="flex gap-1">
            <span>₹{priceRange[0]}</span>
            <Slider
              min={minPrice}
              max={maxPrice}
              minStepsBetweenThumbs={1}
              value={priceRange}
              onValueChange={handlePriceChange}
              className="[&_[data-slot=slider-track]]:bg-slate-200"
            />

            <span>₹{priceRange[1]}</span>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup title="Ratings">
          <SidebarGroupLabel>Ratings</SidebarGroupLabel>
          <SidebarGroupContent className="p-2 text-sm">
            {Ratings.map((rating: TRating) => {
              return (
                <div
                  className="flex w-full items-center text-sm"
                  key={rating.id}
                >
                  <span>{rating.name}</span>
                  <div className="ml-auto">
                    <Checkbox
                      name={rating.id}
                      checked={isCheckedHandler(rating.id, "rating")}
                      onCheckedChange={(value) =>
                        chkChangeHandler(value, rating.id, "rating")
                      }
                    />
                  </div>
                </div>
              );
            })}
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup title="StockAvailability">
          <SidebarGroupLabel>Stocks</SidebarGroupLabel>
          <SidebarGroupContent className="p-2 text-sm">
            {Stocks.map((stock: TStock) => {
              return (
                <div
                  className="flex w-full items-center text-sm"
                  key={stock.id}
                >
                  <span>{stock.name}</span>
                  <div className="ml-auto">
                    <Checkbox
                      name={stock.id}
                      checked={isCheckedHandler(stock.id, "stock")}
                      onCheckedChange={(value) =>
                        chkChangeHandler(value, stock.id, "stock")
                      }
                    />
                  </div>
                </div>
              );
            })}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SideBar;
