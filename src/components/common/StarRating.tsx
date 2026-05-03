import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

type TstarType = "Full" | "Half" | "Empty";

const StarRating = ({ rating = 0, maxStar = 5 }) => {
  const getStarType = (index: number): TstarType => {
    const starNum = index + 1;
    if (rating - starNum >= 0) {
      return "Full";
    } else if (starNum - rating > 0 && starNum - rating < 1) {
      return "Half";
    }
    return "Empty";
  };
  return (
    <div className="flex text-yellow-500">
      {[...Array(maxStar)].map((_, index) => {
        const starType: TstarType = getStarType(index);

        return (
          <div key={index}>
            {starType === "Full" && <FaStar />}
            {starType === "Half" && <FaStarHalfAlt />}
            {starType === "Empty" && <FaRegStar />}
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
