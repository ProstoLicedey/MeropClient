import React, { useContext, useState } from 'react';
import InputEmail from "./inputEmail";
import RegLogForm from "../regLogForm";
import InputCode from "./inputCode";
import InputNewPass from "./inputNewPass";

const UpdatePasswordModal = ({setPassUpdate}) => {

    const [email, setEmail] = useState('');
    const [page, setPage] = useState(1);

    let pageContent;

    switch (page) {
        case 1:
            pageContent = <InputEmail setPage={setPage} setEmail={setEmail} />
            break;
        case 2:
            pageContent = <InputCode  setPage={setPage} email={email}/>;
            break;
        case 3:
            pageContent = <InputNewPass  setPage={setPage} email={email}/>;
            break;
        default :
            setPassUpdate(false)
            break;

    }

    return (
        <div>
            {pageContent}
        </div>
    );
};

export default UpdatePasswordModal;