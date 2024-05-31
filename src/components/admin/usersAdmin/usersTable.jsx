import React, {useContext, useEffect, useRef, useState} from 'react';
import {Alert, Button, Input, Space, Table} from "antd";
import {getUserAllAdmin} from "../../../http/adminAPI";
import {SearchOutlined} from "@ant-design/icons";
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";

const UsersTable = () => {

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const {user} = useContext(Context);

    useEffect(() => {
        getUserAllAdmin()
            .then(data => user.setAllUsers(data))
            .catch((e) => console.log(e))
    }, [user]);

    if (!user.allUsers) {
        return null;
    }

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Введите ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Найти
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Сброс
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => close()}
                    >
                        Закрыть
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'id',
            key: 'id',
            width: '5%',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Почта',
            dataIndex: 'email',
            key: 'email',
            width: '25%',
            render: (value) => (
                <a onClick={(e) => {
                    user.setUserBroadcast(value);
                    e.preventDefault();
                }}>
                    {value}
                </a>
            ),
            sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Фамилия',
            dataIndex: 'surname',
            key: 'surname',
            width: '25%',
            sorter: (a, b) => (a.surname || "").localeCompare(b.surname || ""),
            ...getColumnSearchProps('surname'),
        },
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            width: '5%',
            sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
        },
        {
            title: 'Дата рождения',
            dataIndex: 'birthday',
            key: 'birthday',
            width: '20%',
            sorter: (a, b) => new Date(a.birthday) - new Date(b.birthday),
        },
        {
            title: 'Роль',
            dataIndex: 'role',
            key: 'role',
            width: '20%',
            sorter: (a, b) => (a.role || "").localeCompare(b.role || ""),
        },
    ];

    return (
        <Table
            bordered
            style={{ overflowX: 'auto' }}
            columns={columns}
            dataSource={user.allUsers}
            responsive={{ xs: true, sm: true, md: true, lg: true, xl: true, xxl: true }}
            rowKey="id"
        />
    );
};

export default observer(UsersTable);
