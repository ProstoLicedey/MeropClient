import React, {useContext} from 'react';
import {
    BarcodeOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    LogoutOutlined, MenuFoldOutlined,
    PoweroffOutlined,
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';
import {Button, Menu, Popconfirm} from 'antd';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {logout} from "../../http/userAPI";

const menuCreator = [
    {
        key: 'events',
        icon: <CalendarOutlined/>,
        label: 'Мероприятия'
    },
    {
        key: 'zal',
        icon: <EnvironmentOutlined/>,
        label: 'Залы'
    },
    {
        key: 'buyers',
        icon: <TeamOutlined/>,
        label: 'Покупки'
    },
    {
        key: 'controler',
        icon: <BarcodeOutlined/>,
        label: 'Контролеры'
    },
    {
        key: 'aboutMe',
        icon: <UserOutlined/>,
        label: 'Обо мне'
    }
];
const menuController = [
    {
        key: 'controller',
        icon: <BarcodeOutlined/>,
        label: 'Контроль'
    },
    {
        key: 'aboutMe',
        icon: <UserOutlined/>,
        label: 'Обо мне'
    }
];

const CreatorMenu = ({close}) => {
    const {creator, user} = useContext(Context);

    let items = []
    if(user.user.role == 'ADMIN'){

    }
    else  if(user.user.role == 'CONTROLLER'){
        items = menuController
    }
    else  if(user.user.role == 'CREATOR'){
        items = menuCreator
    }

    const handleLogout = () => {
        logout()
            .then(r => {
                    window.location.reload()
                }
            )
    };

    const onClick = (e) => {
        if (e.key === undefined) {
            return;
        }
        if (e.item.props.confirm === 'confirm') {

            return;
        }
        window.location.hash = e.key;
        close()
    };

    return (
        <Menu
            onClick={onClick}
            style={{
                width: 256,
            }}
            defaultSelectedKeys={['0']}
            defaultOpenKeys={['sub1']}
            mode="inline"
        >


            {items.map((item, index) => (
                <Menu.Item key={item.key} icon={item.icon}>
                    {item.label}
                </Menu.Item>
            ))}
            <Popconfirm
                title="Выйти из аккаунта?"
                onConfirm={handleLogout}
                okText="Выйти"
                cancelText="Остаться"
                placement="bottom"
                okButtonProps={{style: {backgroundColor: '#722ed1'}}}
                style={{width: '100%'}}
            >
                <Menu.Item key={"exit"} icon={<LogoutOutlined/>} style={{paddingLeft:25}}>
                    Выйти
                </Menu.Item>
            </Popconfirm>
        </Menu>
    );
};

export default observer(CreatorMenu);
