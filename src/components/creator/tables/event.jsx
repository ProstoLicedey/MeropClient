import React, {useContext, useEffect, useRef, useState} from 'react';
import {PlusOutlined, SearchOutlined} from '@ant-design/icons';
import {Button, Flex, Input, notification, Popconfirm, Space, Spin, Table, Tooltip} from 'antd';
import {deleteEvent, fetchEvent, fetchOneEvent, fetchTypes} from "../../../http/eventAPI";
import {deleteController, getEventCreator} from "../../../http/creactorAPI";
import {Context} from "../../../index";
import creator from "../../../pages/creator/creator";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {CREATEEVENT_ROUTE, EVENT_ROUTE} from "../../../utils/consts";
import Title from "antd/es/typography/Title";
import Link from "antd/es/typography/Link";

const Event = () => {
    const navigate = useNavigate()

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const {user, creator, notifai} = useContext(Context);
    const [loading, setLoading] = useState(true)
    const [update, setUpdate] = useState(1)
    const [archive, setArchive] = useState(false)


    useEffect(() => {
        if (!!user.user) {
            getEventCreator(user.user.id, archive).then(data => creator.setEvents(data)).finally(() => setLoading(false));
        }

    }, [user.user, update, archive]);


    if (loading) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <Spin size="large"/>
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

    //удаление мероприятия
    const confirmOneGood = (id) => {
        console.log(id)
        deleteEvent(id)
            .then(() => {
                setUpdate(update + 1)
                notifai.type = "success"
                notifai.message = "Внимание!"
                notifai.description = 'Контроллер успешно удален!'

            })
            .catch(error => {
                notifai.type = "error"
                notifai.message = "Ошибка!"
                notifai.description = error
            });
    }

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
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
                        icon={<SearchOutlined/>}
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
            render: (text, record) => (
                <Tooltip title={"Нажмите чтоб перейти к странице мероприятия"}>
                    <Link onClick={() => navigate(`${EVENT_ROUTE}/${record.id}`)}>{text}</Link>
                </Tooltip>
            )
        },
        {
            title: 'Билетов осталось',
            dataIndex: 'mests',
            key: 'mests',
            width: '5%',
            sorter: (a, b) => a.title.length - b.title.length,
            ...getColumnSearchProps('title'),
        },
        {
            title: 'Место проведения',
            dataIndex: 'address',
            key: 'address',
            width: '35%',
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
        {
            key: 'actions',
            render: (record) => {
                return (
                    <Space size="large" style={{
                        display: "flex",
                        flexFlow: "column"
                    }}>
                        <Button style={{
                            borderColor: 'green',
                            color: 'green'
                        }}
                                onClick={() =>
                                navigate(`${CREATEEVENT_ROUTE}/${record.id}`)
                                }>
                            Изменить
                        </Button>
                        <Popconfirm
                            title="Вы уверены, что хотите удалить мероприятие? Все билеты на него будут также удалены!"
                            onConfirm={() => confirmOneGood(record.id)}
                            okText="Да"
                            cancelText="Отмена">
                            <Button danger>Удалить</Button>
                        </Popconfirm>
                    </Space>
                )
            },
            // Условие для отображения столбца только когда archive === false
            ...(archive
                ? {
                    // Если archive === true, не добавляем этот столбец
                    hidden: true
                }
                : {})
        }
    ];


    return (

        <Space direction="vertical" style={{textAlign: 'left', width: '90%', backgroundColor: 'white', margin: 10}}>
            <Title level={2}>
                {archive? "Архив мероприятий" : "Мероприятия" }
            </Title>
            <Space direction={'horizontal'}>
                <Button type="primary" style={{backgroundColor: '#722ed1'}} onClick={() => navigate(CREATEEVENT_ROUTE)}>
                    Добавить +
                </Button>
                <Tooltip title={archive? "Просмотреть aктуальные мероприятия" : "Просмотреть архив прошедших мероприятий"}>
                    <Button onClick={()=> setArchive(!archive)} type="link">
                        {archive? "Акуальные мероприятия" : "Архив" }
                    </Button>
                </Tooltip>
            </Space>
            <Table style={{cursor: 'pointer'}} columns={columns} dataSource={creator.events} onRow={(record) => ({
                // onClick: () => onRowClick(record)
            })}/>
        </Space>
    );
};
export default observer(Event);