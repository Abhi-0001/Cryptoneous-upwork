import React from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

function LoginForm({
  formType,
  handleLogin,
  setAddress,
  setLogOrSign,
  setRole,
  role,
}) {
  return (
    <div className="bg-gray-50 flex items-center justify-center rounded-2xl w-lg">
      <form className="flex flex-col gap-4 items-center justify-center p-8 w-[75%]">
        <div className="flex items-center justify-between w-[50%]">
          <div className="cursor-pointer flex flex-col items-center justify-center">
            <input
              type="radio"
              onClick={() => setRole("user")}
              id="user"
              name="role"
              className="cursor-pointer"
              defaultChecked={role === "user"}
            />
            <label className="cursor-pointer" htmlFor="user">
              User
            </label>
          </div>

          <div className="cursor-pointer flex flex-col items-center justify-center">
            <input
              type="radio"
              onClick={() => setRole("worker")}
              id="worker"
              name="role"
              defaultChecked={role === "worker"}
              className="cursor-pointer"
            />
            <label className="cursor-pointer" htmlFor="worker">
              Worker
            </label>
          </div>
        </div>
        <Input
          type="text"
          placeholder="address"
          styles=""
          onChangeHandler={(e) => setAddress(e.target.value)}
        />

        <Button type={"primary"} onClickHandler={handleLogin}>
          {" "}
          {formType === "signin" ? "sign in" : "sign up"}{" "}
        </Button>

        <p className="mt-8 text-sm">
          {" "}
          {formType === "signin"
            ? `don't have account? `
            : `already have an account? `}
          <button
            type="button"
            className="capitalize cursor-pointer text-blue-400"
            onClick={() =>
              setLogOrSign(formType === "signin" ? "signup" : "signin")
            }
          >
            {formType === "signin" ? "sign up" : "sign in"}
          </button>{" "}
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
