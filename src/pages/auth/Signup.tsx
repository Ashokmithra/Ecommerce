import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Signup = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-sm min-w-1/4 h-125">
        <CardHeader className="font-bold text-2xl justify-center">
          SignUp
        </CardHeader>
        <CardContent className="flex flex-col justify-center h-full gap-3">
          <div className="flex flex-col gap-1">
            <Label>Name</Label>
            <Input type="name" id="name" placeholder="Mike" />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Email</Label>
            <Input type="email" id="email" placeholder="abc@gmail.com" />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Password</Label>
            <Input type="password" id="password" placeholder="password" />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Confirm Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="confirm password"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full items-center">SignUp</Button>
          <Button variant={"outline"} className="w-full items-center">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
