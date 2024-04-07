import React, {useContext} from 'react';
import Title from "antd/es/typography/Title";
import {Button, Result} from "antd";
import {ADMIN_ROUTE, CONTROLLER_ROUTE, CREATOR_ROUTE, HOME_ROUTE} from "../utils/consts";
import {Navigate, useNavigate} from "react-router-dom";
import {Context} from "../index";

const ErrorPage = () => {
    const navigate = useNavigate()
    const {user} = useContext(Context)
    const buttonHome = () => {
        console.log(user.user.role)
            switch (user.user.role) {
                case 'USER':
                    navigate(HOME_ROUTE);
                    break;
                case 'CREATOR':
                    navigate(CREATOR_ROUTE);
                    break;
                case 'ADMIN':
                    navigate(ADMIN_ROUTE);
                    break;
                case 'CONTROLLER':
                    navigate(CONTROLLER_ROUTE);
                    break;
                default:
                    navigate(HOME_ROUTE);
            }

    };
    return (
        <Result
            status="404"
            title="Ошибочка"
            subTitle="Мы не нашли такой странички, хотя очень старались. Или вам просто сюда нельзя)"
            extra={<Button onClick={buttonHome} type={'primary'}  style={{backgroundColor: '#722ed1',  height: '2em', fontSize:'1.4em'}}>На главную</Button>}
        />
    );
};

export default ErrorPage;