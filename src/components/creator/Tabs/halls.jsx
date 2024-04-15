import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button, Input, notification, Popconfirm, Space, Spin, Table} from "antd";
import Title from "antd/es/typography/Title";
import {CREATEEVENT_ROUTE} from "../../../utils/consts";
import ModalZal from "../ModalZal/ModalZal";
import {getEventCreator} from "../../../http/creactorAPI";
import {SearchOutlined} from "@ant-design/icons";
import creator from "../../../pages/creator/creator";
import {Context} from "../../../index";
import {useNavigate} from "react-router-dom";
import {deleteHall, fetchUserHall} from "../../../http/hallAPI";
import {observer} from "mobx-react-lite";
import {deleteEvent} from "../../../http/eventAPI";

const Halls = () => {
    const navigate = useNavigate()


    const [modal, setModal] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const {user, creator} = useContext(Context);
    const [loading, setLoading] = useState(true)
    const [update, setUpdate] = useState(1)
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (!!user.user) {
            fetchUserHall(user.user.id).then(data => creator.setHalls(data)).finally(() => setLoading(false));
        }

    }, [user.user, modal, update]);

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



    const confirmOneGood = (id, type) => {
        deleteHall(id, type)
            .then(() => {
                setUpdate(update + 1)
                return api.success({
                    message: 'Внимание!',
                    description: 'Контроллер успешно удален!',
                    className: 'custom-class',
                    style: {
                        width: 600
                    }
                })
            })
            .catch(error => {
                return api['error']({
                    message: 'Ошибка ' + error,
                });
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
            ...getColumnSearchProps('number'),
            sorter: (a, b) => a.address.length - b.address.length,
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            sorter: (a, b) => a.address.length - b.address.length,
            ...getColumnSearchProps('name'),
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
            title: 'Тип',
            dataIndex: 'type',
            key: 'type',
            width: '20%',
            ...getColumnSearchProps('date'),
            sorter: (a, b) => a.address.length - b.address.length,
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
                                onClick={() => {
                                    // return showModal(record.id)
                                }}>
                            Изменить
                        </Button>
                        <Popconfirm
                            title="Вы уверены, что хотите удалить зал? Все мероприятия с этим залом также удалены!"
                            onConfirm={() => confirmOneGood(record.id, record.type)}
                            okText="Удалить"
                            cancelText="Отмена">
                            <Button danger>Удалить</Button>
                        </Popconfirm>
                    </Space>
                )
            }
        }
    ];

    return (
        <Space direction="vertical" style={{textAlign: 'left', width: '90%', backgroundColor: 'white', margin: 10}}>
            <Title level={2}>
                Залы
            </Title>
            <Button type="primary" style={{backgroundColor: '#722ed1'}} onClick={() => setModal(true)}>
                Добавить +
            </Button>

            <Table style={{cursor: 'pointer'}} columns={columns} dataSource={creator.halls}
            />

            <ModalZal open={modal}
                      onCancel={() => {
                          setModal(false);
                      }}/>
        </Space>

    );
};

export default observer(Halls);