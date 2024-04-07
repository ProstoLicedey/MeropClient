import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button, Input, message, notification, Popconfirm, Space, Spin, Table} from "antd";
import Title from "antd/es/typography/Title";
import {CREATEEVENT_ROUTE} from "../../../utils/consts";
import {deleteController, getControllers, getEventCreator} from "../../../http/creactorAPI";
import {SearchOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {Context} from "../../../index";
import CollectionCreateForm from "../../auth/authModals";

const MyController = () => {
    const navigate = useNavigate()

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const {user, creator} = useContext(Context);
    const [loading, setLoading] = useState(true)
    const [controllers, setControllers] = useState([])
    const [update, setUpdate] = useState(1)
    const [api, contextHolder] = notification.useNotification();

    const [open, setOpen] = useState(false); // модальное окно

    useEffect(() => {
        if (!!user.user) {
            getControllers(user.user.id).then(data => setControllers(data)).finally(() => setLoading(false));
        }
        console.log(controllers)
    }, [user.user, update]);

    const confirmOneGood = (id) => {
        deleteController(id)
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

    const onRowClick = (record) => {
        navigate(CREATEEVENT_ROUTE + '/' + record.id)
    };

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
            dataIndex: 'controllerId',
            key: 'id',
            width: '10%',
            ...getColumnSearchProps('id'),
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Почта',
            dataIndex: 'email',
            key: 'title',
            width: '30%',
            sorter: (a, b) => a.title.length - b.title.length,
            ...getColumnSearchProps('title'),
        },
        {
            title: 'Фамилия Имя',
            dataIndex: 'name',
            key: 'address',
            width: '40%',
            ...getColumnSearchProps('address'),
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
                            title="Вы уверены, что хотите удалить контроллера?"
                            onConfirm={() => confirmOneGood(record.controllerId)}
                            okText="Да"
                            cancelText="Отмена">
                            <Button danger>Удалить</Button>
                        </Popconfirm>
                    </Space>
                )
            }
        }
    ];

    const tableProps = {
        columns,
        dataSource: creator.events,
        onRow: (record) => ({
            onClick: () => onRowClick(record),
        }),
    };

    return (
        <Space direction="vertical" style={{textAlign: 'left', width: '100%', backgroundColor: 'white', margin: 10}}>
            <Title level={2}>
                Мои котроллеры
            </Title>
            <Button
                type="primary"
                style={{backgroundColor: '#722ed1'}}
                onClick={() =>    setOpen(true)}>
                Добавить +
            </Button>
            <Table columns={columns} dataSource={controllers} onRow={(record) => ({
                // onClick: () => onRowClick(record)
            })}/>
            <CollectionCreateForm
                open={open}
                onCancel={() => {
                    setOpen(false);
                }}
                idCreator={user.user.id}
            />
        </Space>
    );
};

export default MyController;