type TInvalidPage = {
  errorMessage: string;
};

const InvalidPage = ({ errorMessage }: TInvalidPage) => {
  return (
    <div className="h-full w-full flex justify-center items-center text-5xl font-bold">
      {errorMessage}
    </div>
  );
};

export default InvalidPage;
