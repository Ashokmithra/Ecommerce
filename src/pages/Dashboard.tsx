import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetCurrentUser } from "@/features/auth/hooks/auth";

const DashBoard = () => {
  const { data: userData } = useGetCurrentUser();
  return (
    <Card className="h-full shadow-md shadow-gray-500">
      <div className="flex flex-col w-full h-full items-center gap-5 p-4">
        <div className="font-extrabold text-4xl">USER PROFILE</div>
        <div className="">
          <img
            height={100}
            width={100}
            src={userData?.data?.image}
            alt="profileImg"
          />
        </div>
        <div className="grid grid-cols-3 w-2/3 gap-4 items-center gap-y-8">
          <div className="flex flex-col gap-1">
            <span className="font-bold">FirstName</span>
            <Input
              className="border shadow-sm shadow-gray-500 border-gray-500"
              readOnly
              type="text"
              value={userData?.data?.firstName}
            ></Input>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold">LastName</span>
            <Input
              className="border shadow-sm shadow-gray-500 border-gray-500"
              readOnly
              type="text"
              value={userData?.data?.lastName}
            ></Input>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold">MaidenName</span>
            <Input
              className="border shadow-sm shadow-gray-500 border-gray-500"
              readOnly
              type="text"
              value={userData?.data?.maidenName}
            ></Input>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold">Email</span>
            <Input
              className="border shadow-sm shadow-gray-500 border-gray-500"
              readOnly
              type="text"
              value={userData?.data?.email}
            ></Input>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold">Phone</span>
            <Input
              className="border shadow-sm shadow-gray-500 border-gray-500"
              readOnly
              type="text"
              value={userData?.data?.phone}
            ></Input>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold">Age</span>
            <Input
              className="border shadow-sm shadow-gray-500 border-gray-500"
              readOnly
              type="text"
              value={userData?.data?.age}
            ></Input>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold">BirthDate</span>
            <Input
              className="border shadow-sm shadow-gray-500 border-gray-500"
              readOnly
              type="text"
              value={userData?.data?.birthDate}
            ></Input>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold">Gender</span>
            <Input
              className="border shadow-sm shadow-gray-500 border-gray-500"
              readOnly
              type="text"
              value={userData?.data?.gender}
            ></Input>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold">BloodGroup</span>
            <Input
              className="border shadow-sm shadow-gray-500 border-gray-500"
              readOnly
              type="text"
              value={userData?.data?.bloodGroup}
            ></Input>
          </div>
          <div className="flex flex-col gap-1 col-span-3 items-center">
            <span className="font-bold">Address</span>
            <Input
              className="border shadow-sm shadow-gray-500 border-gray-500"
              readOnly
              type="text"
              value={
                userData?.data?.address &&
                Object.entries(userData?.data?.address)
                  .map(([key, value]) => {
                    if (typeof value === "object") {
                      return Object.entries(value || {})
                        .map(([key, value]) => value)
                        .join(",");
                    } else {
                      return value;
                    }
                  })
                  .join(",")
              }
            ></Input>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DashBoard;
