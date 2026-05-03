import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDebounce from "@/hooks/useDebounce";
import { useEffect } from "react";
import { MdClear } from "react-icons/md";
import { useSearchParams } from "react-router-dom";

interface SearchSortBarProps {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

const SearchSortBar = ({ searchValue, setSearchValue }: SearchSortBarProps) => {
  const [searchParam, setSearchParam] = useSearchParams();
  const debounceValue = useDebounce(searchValue, 500);

  const clearSearchBar = () => {
    setSearchValue("");
  };
  const sortbyValueChangeHandler = (value: string) => {
    const newParams = new URLSearchParams(searchParam);

    if (value && value !== null) {
      const [sort, order] = value.split("/");
      newParams.set("sortBy", sort);
      newParams.set("order", order);
    } else {
      newParams.delete("sortBy");
      newParams.delete("order");
    }
    setSearchParam(newParams);
  };

  useEffect(() => {
    const newParams = new URLSearchParams();
    if (debounceValue !== "") {
      newParams.set("search", debounceValue);
    } else {
      newParams.delete("search");
    }
    setSearchParam(newParams);
  }, [debounceValue]);

  return (
    <div className="h-full w-full flex items-center">
      <div className="searchBar   w-1/2  items-center! flex relative z-50">
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          name="search"
          placeholder="Search"
          className="bg-white text-black h-10 w-4/5   focus:outline-none focus-visible:outline-none  focus-visible:border-none focus-visible:ring-0 focus-visible:shadow-none "
        />
        <button
          type="button"
          className="absolute  ml-[75%] "
          onClick={clearSearchBar}
        >
          <MdClear className="h-10 w-8 bg-white rounded-md text-gray-500 hover:text-black" />
        </button>
      </div>
      <div className="sort w-1/2 px-2 flex justify-end ">
        <Select onValueChange={sortbyValueChangeHandler}>
          <SelectTrigger className="w-full max-w-48 bg-white focus:outline-none focus-visible:outline-none  focus-visible:border-none focus-visible:ring-0 focus-visible:shadow-none ">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectItem value="price/asc">Price - low to high</SelectItem>
              <SelectItem value="price/desc">Price - high to low</SelectItem>
              <SelectItem value="rating/asc">Rating - low to high</SelectItem>
              <SelectItem value="rating/desc">Rating - high to low</SelectItem>
              <SelectItem value="title">Title - A to Z</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchSortBar;
