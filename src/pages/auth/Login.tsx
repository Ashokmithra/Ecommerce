import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/hooks/auth";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";

const LoginFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username should contains minimum of 3 characters"),
  password: z
    .string()
    .min(8, "Password should contains minimum of 8 characters"),
});

type LoginFormField = z.infer<typeof LoginFormSchema>;
export type TLoginResponseData = {
  accessToken: string;
  email: string;
  firstName: string;
  gender: string;
  id: number;
  image: string;
  lastName: string;
  refreshToken: string;
  username: string;
};

const Login = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginFormField>({
    resolver: zodResolver(LoginFormSchema),
  });

  const { mutate } = useAuth().postLoginData;

  const onsubmit: SubmitHandler<LoginFormField> = (data) => {
    mutate({ ...data, expiresInMins: 60 });
  };

  return (
    <div className="flex items-center justify-center h-full w-full">
      <Card className="w-full max-w-sm min-w-1/4 h-110">
        <CardHeader className="font-bold text-2xl justify-center">
          Login
        </CardHeader>
        <form onSubmit={handleSubmit(onsubmit)} id="loginForm">
          <CardContent className="flex flex-col justify-center h-51 gap-6">
            <div className="flex flex-col gap-2">
              <Label>Username</Label>
              <Input
                {...register("username")}
                type="username"
                id="username"
                placeholder="username"
              />
              {errors.username && (
                <div className="text-red-500 text-[14px]">
                  {errors.username.message}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Password</Label>
              <Input
                {...register("password")}
                type="password"
                id="password"
                placeholder="password"
              />
              {errors.password && (
                <div className="text-red-500 text-[14px]">
                  {errors.password.message}
                </div>
              )}
            </div>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col gap-3">
          <Button
            type="submit"
            form="loginForm"
            className="w-full items-center"
          >
            Login
          </Button>
          <Button variant={"outline"} className="w-full items-center">
            SignUp
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
