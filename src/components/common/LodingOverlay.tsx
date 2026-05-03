import { Spinner } from "@/components/ui/spinner";

const LodingOverlay = () => {
  return (
    <div className="absolute flex items-center justify-center h-full w-full  z-50 bg-slate-100/40">
      <Spinner />
    </div>
  );
};

export default LodingOverlay;
