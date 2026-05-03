import { FaStar } from "react-icons/fa";

const RatingBreakDown = ({
  ratings = [],
  maxRating = 5,
}: {
  ratings: Array<number>;
  maxRating?: number;
}) => {
  const getRatingPercent = (index: number) => {
    const currentRating = index + 1;
    const filterCountRating = ratings.filter(
      (rating) => rating <= currentRating && rating > index,
    ).length;
    const totalRatingLength = ratings.length;
    const currentRatingPercent = (filterCountRating / totalRatingLength) * 100;
    return currentRatingPercent;
  };
  return (
    <div>
      {[...Array(maxRating)].map((_, index) => {
        const ratingPercent: number = getRatingPercent(index);

        return (
          <div key={index} className="flex w-full items-center gap-1">
            <div className="text-slate-500 text-xs">{index + 1}</div>
            <FaStar className="text-slate-500 h-2.5 w-2.5" />
            <div className="w-full h-2.5 rounded-xl   bg-blue-100 my-2">
              <div
                className="h-2.5 rounded-xl bg-blue-500"
                style={{ width: `${ratingPercent}%` }}
              ></div>
            </div>
            <div className="text-slate-500 text-xs">
              {Math.round(ratingPercent)}%
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RatingBreakDown;
