import React from 'react';

function Input({placeholder, type, styles, onChangeHandler}) {
    return (
        <input type={type} onChange={onChangeHandler} placeholder={placeholder} className={`outline-0 bg-zinc-200 text-zinc-500 p-2 rounded-md w-[100%] hover:bg-zinc-100 ${styles}`}  />
    );
}

export default Input;
