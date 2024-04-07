import React, {useContext, useEffect, useRef, useState} from 'react';
import {PlusOutlined, SearchOutlined} from '@ant-design/icons';
import {Button, Flex, Input, Space, Spin, Table} from 'antd';
import {fetchEvent, fetchOneEvent, fetchTypes} from "../../../http/eventAPI";
import {getEventCreator} from "../../../http/creactorAPI";
import {Context} from "../../../index";
import creator from "../../../pages/creator/creator";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {CREATEEVENT_ROUTE, EVENT_ROUTE} from "../../../utils/consts";
import Title from "antd/es/typography/Title";

const Event = () => {
    const navigate = useNavigate()

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const {user, creator} = useContext(Context);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(!!user.user) {
            console.log(user.user.id)
            getEventCreator(user.user.id).then(data => creator.setEvents(data)).finally(()=> setLoading(false));
            console.log(creator.events)
        }

    }, [user.user]);


        if (loading){
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Spin size="large" />
                </div>
            )
        }


    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const onRowClick = (record) => {
        navigate(CREATEEVENT_ROUTE + '/' + record.id)
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{

                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Введите ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Найти
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Сброс
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Закрыть
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },


    });
    const columns = [
        {
            title: 'Номер',
            dataIndex: 'id',
            key: 'id',
            width: '10%',
            ...getColumnSearchProps('id'),
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            width: '30%',
            sorter: (a, b) => a.title.length - b.title.length,
            ...getColumnSearchProps('title'),
        },
        {
            title: 'Место проведения',
            dataIndex: 'address',
            key: 'address',
            width: '40%',
            ...getColumnSearchProps('address'),
            sorter: (a, b) => a.address.length - b.address.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Дата',
            dataIndex: 'dateTime',
            key: 'dateTime',
            width: '20%',
            sortDirections: ['descend', 'ascend'],
        },
    ];

    const tableProps = {
        columns,
        dataSource: creator.events,
        onRow: (record) => ({
            onClick: () => onRowClick(record),
        }),
    };
    return(

            <Space direction="vertical" style={{ textAlign: 'left', width: '90%', backgroundColor:'white', margin:10}}>
                <Title level={2}>
                    Мероприятия
                </Title>
                <Button type="primary" style={{ backgroundColor: '#722ed1' }} onClick={() =>navigate(CREATEEVENT_ROUTE)}>
                    Добавить +
                </Button>
               <Table style={{cursor:'pointer'}} columns={columns} dataSource={creator.events} onRow = {(record) => ({
                onClick: () => onRowClick(record)
            })}/>
            </Space>
    );
};
export default observer(Event);