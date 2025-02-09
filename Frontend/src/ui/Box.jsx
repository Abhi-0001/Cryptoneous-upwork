import React from 'react';

function Box({children, styles}){
    return (
        <div className={`w-[100%] ${styles}` }>
            {children}
        </div>
    );
}

export default Box;
