import React, { useContext, useEffect, useState } from 'react';
import {Button, Card, DatePicker, Form, Input, message, Tooltip} from 'antd';
import Title from 'antd/es/typography/Title';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import moment from 'moment';
import {USER_ROUTE} from "../../utils/consts";
import {getInfo, putUser} from "../../http/userAPI"; // Import moment

const Profile = () => {
    const { user } = useContext(Context);
    const [form] = Form.useForm();
    const [isFormChanged, setIsFormChanged] = useState(false);
    useEffect(() => {
        if(user.user.id != undefined) {
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
                    birthday: birthday.format('YYYY-MM-DD'), // Format the date as needed
                }).then(() => {
                    message.success('Данные успешно изменены');
                });

                setIsFormChanged(false);

            })
            .catch((errorInfo) => {
                console.log('Validation failed:', errorInfo);
            });

    };

    const onFinish = (values) => {
        // Handle form submission
        console.log('Received values:', values);
        // Add your logic to update the user profile here
    };
    const handleFormChange = () => {
        // Установить состояние изменения формы в true при изменении значений формы
        setIsFormChanged(true);
    };
    return (
        <div >
            <Title  level={2}>Контактные данные</Title>
            <Card style={{marginTop:"3"}}>

                <Form form={form} onFinish={onFinish} onValuesChange={handleFormChange}>
                    <Tooltip title="Почту поменять нельзя(">
                    <Form.Item
                        name="email"

                        rules={[
                            {
                                message: 'почта не корректна',
                                required: true,
                                type: 'email',

                            },
                        ]}
                    >
                        <Input disabled size={'large'} placeholder="Почта" />
                    </Form.Item>
                    </Tooltip>
                    <Form.Item
                        name="name"
                        rules={[
                            {
                                message: 'не корректно',
                                required: false,
                            },
                        ]}
                    >
                        <Input size={'large'} placeholder={user.user && user.user.role === 'USER' ? 'Имя' : 'Название организации'} />
                    </Form.Item>
                    <Form.Item
                        name="surname"
                        rules={[
                            {
                                message: 'не корректо',
                                required: false,
                            },
                        ]}
                    >
                        <Input size={'large'} placeholder={user.user && user.user.role === 'USER' ? 'Фамилия' : 'Описание организации'} />
                    </Form.Item>
                    <Form.Item
                        name="birthday"
                        rules={[
                            {
                                message: 'введите дату',
                                type: 'date',
                                required: false,
                            },
                        ]}
                    >
                        <DatePicker size={'large'} placeholder="Дата рождения" />
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