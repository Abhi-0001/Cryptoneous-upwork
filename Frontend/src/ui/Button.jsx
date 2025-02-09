import React, { Children } from 'react';


const classes = {
    root: 'ease-linear border cursor-pointer font-semibold p-2 rounded-md capitalize border-none',
    primary: 'bg-blue-700 text-white hover:bg-blue-600' ,
    secondary: 'bg-zinc-300 text-zinc-600 hover:bg-zinc-200' ,
    roundedP: `rounded-full hover:text-blue-400 text-blue-500 `,
    roundedS: `rounded-full  hover:text-zinc-400 text-zinc-500`,
}
function Button({children,type, onClickHandler}) {
    return (
        <button onClick={onClickHandler} className={`${classes['root']} ${classes[type]} `}>
            {children}
        </button>
    );
}

export default Button;
