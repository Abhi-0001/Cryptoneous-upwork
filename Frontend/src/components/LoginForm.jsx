import React, { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import axios from "axios";
import { BASE_URL } from "../constants";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [address, setAddress] = useState("");
  const [logOrSign, setLogOrSign] = useState("signin");
  const [role, setRole] = useState("user");

  // context
  const { handleLogin, isLoading } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    await handleLogin({ address, role, logOrSign });
  }

  return (
    <div className="bg-gray-50 flex items-center justify-center rounded-2xl w-lg">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 items-center justify-center p-8 w-[75%]"
      >
        <div className="flex items-center justify-between w-[50%]">
          <div className="cursor-pointer flex flex-col items-center justify-center">
            <input
              type="radio"
              onClick={() => setRole("user")}
              id="user"
              name="role"
              className="accent-blue-700 cursor-pointer hover:accent-blue-600"
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
              className="accent-blue-700 cursor-pointer hover:accent-blue-600"
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

        <Button
          type={"primary"}
          disabled={isLoading}
          onClickHandler={handleSubmit}
        >
          {" "}
          {isLoading
            ? "loading..."
            : logOrSign === "signin"
            ? "sign in"
            : "sign up"}{" "}
        </Button>

        <p className="mt-8 text-sm">
          {" "}
          {logOrSign === "signin"
            ? `don't have account? `
            : `already have an account? `}
          <button
            type="button"
            className="capitalize cursor-pointer text-blue-400"
            onClick={() =>
              setLogOrSign(logOrSign === "signin" ? "signup" : "signin")
            }
          >
            {logOrSign === "signin" ? "sign up" : "sign in"}
          </button>{" "}
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
