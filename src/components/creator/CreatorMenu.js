import React, {useContext} from 'react';
import {
    BarcodeOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    LogoutOutlined,
    PoweroffOutlined,
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';
import {Menu, Popconfirm} from 'antd';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {logout} from "../../http/userAPI";

function getItem(label, key, icon, type, confirm) {
    return {
        key,
        icon,
        label,
        type,
        confirm // Add a property to determine whether to show confirmation
    };
}

const items = [
    getItem('Мероприятия', 'events', <CalendarOutlined/>),
    getItem('Залы', 'zal', <EnvironmentOutlined/>),
    getItem('Покупки', 'buyers', <TeamOutlined/>),
    getItem('Контролеры', 'controler', <BarcodeOutlined/>),
    getItem('Обо мне', 'aboutMe', <UserOutlined/>),
    getItem('Выйти', 'exit', <LogoutOutlined/>, 'confirm'), // Corrected the type
];

const CreatorMenu = () => {
    const {creator} = useContext(Context);

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
        console.log(e)
        if (e.item.props.confirm === 'confirm') {

            return;
        }
        window.location.hash = e.key;
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
            <Menu.Item key={'events'} icon={<CalendarOutlined/>}>
                Мероприятия
            </Menu.Item>
            <Menu.Item key={'zal'} icon={<EnvironmentOutlined/>}>
                Залы
            </Menu.Item>
            <Menu.Item key={'buyers'} icon={<TeamOutlined/>}>
                Покупки
            </Menu.Item>
            <Menu.Item key={'controler'} icon={<BarcodeOutlined/>}>
                Контролеры
            </Menu.Item>
            <Menu.Item key={'aboutMe'} icon={<UserOutlined/>}>
                Обо мне
            </Menu.Item>

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
