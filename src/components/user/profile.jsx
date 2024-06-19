import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, DatePicker, Form, Input, notification, Tooltip } from 'antd';
import Title from 'antd/es/typography/Title';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import moment from 'moment';
import { USER_ROUTE } from "../../utils/consts";
import { getInfo, putUser } from "../../http/userAPI";
import dayjs from "dayjs";

const Profile = () => {
    const { user } = useContext(Context);
    const [form] = Form.useForm();
    const [isFormChanged, setIsFormChanged] = useState(false);

    useEffect(() => {
        if (user.user.id !== undefined) {
            getInfo(user.user.id).then(data => user.setUserProfile(data));
        }
    }, [user.user]);

    useEffect(() => {
        form.setFieldsValue({
            email: user.userProfile.email || '',
            name: user.userProfile.name || '',
            surname: user.userProfile.surname || '',
            birthday: user.userProfile.birthday ? moment(user.userProfile.birthday) : null,
        });
        setIsFormChanged(false);
    }, [user.userProfile, form]);

    const saveUpdate = () => {
        form
            .validateFields()
            .then(async (values) => {
                const { name, surname, email, birthday } = values;

                await putUser(user.userProfile.id, {
                    name: name,
                    surname: surname,
                    email: email,
                    birthday: birthday ? birthday.format('YYYY-MM-DD') : null,
                }).then(() => {
                    notification.success({
                        message: 'Данные успешно изменены',
                    });
                });

                setIsFormChanged(false);
            })
            .catch((errorInfo) => {
                notification.error({
                    message: 'Ошибка',
                });
                console.log('Validation failed:', errorInfo);
            });
    };

    const onFinish = (values) => {
        console.log('Received values:', values);
    };

    const handleFormChange = () => {
        setIsFormChanged(true);
    };

    return (
        <div style={{ margin: 10 }}>
            <Title level={2}>Контактные данные</Title>
            <Card style={{ marginTop: 3 }}>
                <Form form={form} onFinish={onFinish} onValuesChange={handleFormChange}>
                    <Tooltip title="Почту поменять нельзя(">
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'почта не корректна',
                                },
                            ]}
                        >
                            <Input disabled size="large" placeholder="Почта" />
                        </Form.Item>
                    </Tooltip>
                    <Form.Item
                        name="name"
                        rules={[
                            {
                                message: 'не корректно',
                            },
                        ]}
                    >
                        <Input size="large" placeholder={user.user && user.user.role === 'USER' ? 'Имя' : 'Название организации'} />
                    </Form.Item>
                    <Form.Item
                        name="surname"
                        rules={[
                            {
                                message: 'не корректно',
                            },
                        ]}
                    >
                        <Input size="large" placeholder={user.user && user.user.role === 'USER' ? 'Фамилия' : 'Описание организации'} />
                    </Form.Item>
                    <Form.Item
                        name="birthday"
                        rules={[
                            {
                                type: 'date',
                                message: 'введите дату',
                            },
                        ]}
                    >
                        <DatePicker
                            disabledDate={current =>
                                current && (current.isBefore(dayjs('1930-01-01')) || current.isAfter(dayjs()))
                            }
                            size="large"
                            placeholder="Дата рождения"
                        />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ width: 200, height: 40, fontSize: 16, backgroundColor: '#722ed1' }}
                            onClick={saveUpdate}
                            disabled={!isFormChanged}
                        >
                            Сохранить изменения
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default observer(Profile);
