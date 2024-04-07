import React, {useContext, useEffect, useState} from 'react';
import {Alert, Button, DatePicker, Flex, Form, Input, Modal, Typography} from 'antd';
import {Context} from "../../index";

import onCreate from "../../services/userService/authService"
import UpdatePasswordModal from "./updatePassword/updatePasswordModal";
import RegLogForm from "./regLogForm";

const {Text, Link} = Typography
const CollectionCreateForm = ({open, onCancel, idCreator}) => {

    const [title, setTitle] = useState('Авторизация');
    const [passUpdate, setPassUpdate] = useState(false);
    useEffect(() => {
        if (passUpdate === true) {
            setTitle('Восстановление пароля');
        } else {
            setTitle('Авторизация');
        }
    }, [passUpdate]);

    useEffect(() => {
        setPassUpdate(false)
    }, [open]);

    return (
        <Modal
            open={open}
            title={title}
            footer={null}
            onCancel={() => {
                onCancel();
            }}

        >
            <Flex justify={"center"}>
                {!passUpdate ?
                    <RegLogForm title={setTitle}
                                onCancel={() => onCancel()}
                                setPassUpdate={() => setPassUpdate(true)}
                                idCreator={idCreator}
                    />
                    :
                    <UpdatePasswordModal setPassUpdate={setPassUpdate}/>
                }
            </Flex>
        </Modal>

    )
        ;
};

export default CollectionCreateForm