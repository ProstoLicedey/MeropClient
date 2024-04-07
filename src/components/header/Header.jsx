import React, {useContext, useState} from 'react';
import Logo from '../../assets/logo.png'
import {Image, Menu, Space} from 'antd';
//import { Header } from "antd/es/layout/layout";
import {Typography} from 'antd';
import {ADMIN_ROUTE, CONTROLLER_ROUTE, CREATOR_ROUTE, EVENT_ROUTE, HOME_ROUTE, USER_ROUTE} from "../../utils/consts";
import {NavLink, useNavigate} from "react-router-dom";
import SerchInput from "../serch";
import {useMediaQuery} from "react-responsive";
import authModals from "../auth/authModals";
import CollectionCreateForm from "../auth/authModals";
import {Context} from "../../index";
import {UserOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {Header} from "antd/es/layout/layout";

const {Title} = Typography;


const HeaderPage = () => {
    const isMobile = useMediaQuery({maxWidth: 950});
    const [open, setOpen] = useState(false);
    const {user} = useContext(Context)
    const [userName, setUserName] = React.useState('')
    const navigate = useNavigate()
    //открытие авторизации или профиля
    const buttonUser = () => {
        if (user.isAuth) {
            switch (user.user.role) {
                case 'USER':
                    navigate(USER_ROUTE);
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
                    setOpen(true);
            }
        } else {
            setOpen(true);
        }
    };

    return (
        <Header style={{
            display: 'flex',
            alignItems: 'center',
            height: '5vw',
            justifyContent: 'space-between',
            backgroundColor: '#391085'
        }}>
            <NavLink to={HOME_ROUTE} style={{display: 'flex', alignItems: 'center'}}>
                {!isMobile && (<Image src={Logo}
                                      width={'5vw'}
                                      height={'5vw'}
                                      style={{
                                          padding: '0.8vw',
                                          userSelect: 'none',
                                      }}
                                      preview={false}
                                      alt="Логотип сайта"
                />)}
                <Title level={1}
                       style={{
                           color: '#FFFFFFFF',
                           marginTop: '0.3vw',
                           marginBottom: '0.3vw',
                           userSelect: 'none',
                           whiteSpace: 'nowrap',
                           fontSize: '3vw',
                       }}
                >
                    Merop
                </Title>
            </NavLink>

            {!isMobile && (<SerchInput style={{width: '35vw',}}/>)}


            <Title level={3}
                   style={{
                       color: '#FFFFFFD9',
                       marginTop: 10,
                       userSelect: 'none',
                       whiteSpace: 'nowrap',
                       fontSize: '1.8vw',
                   }}
                   onClick={buttonUser}
            > {
                user.isAuth ?
                    <UserOutlined/>
                    :
                    "Войти"
            }
            </Title>
            <CollectionCreateForm
                open={open}
                onCancel={() => {
                    setOpen(false);
                }}
                idCreator={null}
            />
        </Header>
    );
};

export default observer(HeaderPage);