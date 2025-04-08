import React, { useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";
import { useAuth } from "../contexts/AuthProvider";

function RadioButton({onClickHandler, defaultChecked, id, name }){
  return <div className="cursor-pointer flex flex-col items-center justify-center">
  <input
    type="radio"
    onClick={onClickHandler}
    id={id}
    name={name}
    defaultChecked={defaultChecked}
    className="accent-blue-700 cursor-pointer hover:accent-blue-600"
  />
  <label className="cursor-pointer text-xs" htmlFor={id}>
    {id.toUpperCase()}
  </label>
</div>
}

function LoginForm() {
  const [address, setAddress] = useState("");
  const [logOrSign, setLogOrSign] = useState("signin");
  
  const [error, setError] = useState('');

  // context
  const { handleLogin, isLoading, role, setRole } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    console.log('inside handleSubmit');
    const res = await handleLogin({ address, role, logOrSign });
    console.log(res);
    if(res?.error?.length > 0) setError(res.error);
  }

  return (
    <div className="bg-gray-50 flex items-center justify-center rounded-2xl w-lg">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 items-center justify-center p-8 w-[75%]"
      >
        <div className="flex items-center justify-between w-[50%]">
          <RadioButton onClickHandler={() => setRole('user')} id={'user'} name={'role'} defaultChecked={role=='user'} />
          <RadioButton onClickHandler={() => setRole('worker')} id={'worker'} name={'role'} defaultChecked={role=='worker'} />
        </div>
        <Input
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
        <p className="text-red-500 font-semibold">
            {error.length > 0 && error}
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
