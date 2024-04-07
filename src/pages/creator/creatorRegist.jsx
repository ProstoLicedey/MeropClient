import React, {useContext, useState} from 'react';
import Title from "antd/es/typography/Title";
import { Text } from "@react-pdf/renderer";
import Paragraph from "antd/es/typography/Paragraph";
import {Alert, Button, Card, DatePicker, Form, Input, message} from "antd";
import onCreate from "../../services/userService/authService";
import TextArea from "antd/es/input/TextArea";
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
import {CREATOR_ROUTE, HOME_ROUTE} from "../../utils/consts";

const CreatorRegist = () => {
    const [form] = Form.useForm();
    const [cardVisible, setCardVisible] = useState(false);
    const {user} = useContext(Context)
    const navigate = useNavigate()

    return (
        <div style={{ margin: '1%', justifyContent:'center', display:"flex" }}>
            <div>
            <Title level={2}>
                Организаторам мероприятий
            </Title>

            <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                Приглашаем к сотрудничеству организаторов мероприятий!<br /><br />

                Merops - платформа для бронирования билетов, на культурные и спортивные  мероприятия.<br />
                В основном расчитана на начинающие коллективы.<br /><br />

                Организаторам зрелищных мероприятий<br />
                Мы предлагаем следующие услуги:<br /><br />

                · Реализация билетов на зрелищные мероприятия<br />
                · Рекламное продвижение мероприятий с использованием всех рекламных ресурсов нашей компании<br />
                · Организация системы контроля доступа на площадке<br /><br />

                По всем вопросам обращайтесь на почту merops@hotmail.com<br />
            </Paragraph>
                <div style={{ textAlign: 'center' }}>
                    {!cardVisible && (   <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: 200, height: 40, fontSize: 16, backgroundColor: '#722ed1' }}
                    onClick={() => setCardVisible(true)}
                >
                    Стать организатором
                </Button> )}
            </div>
                {cardVisible && (   <Card style={{margin:"3%"}} visible>
                    <Title level={2}> Зарегестрироваться</Title>
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                        modifier: 'public',
                    }}
                >

                    <Form.Item
                        label="Почта"
                        name="email"
                        rules={[
                            {
                                message: 'почта не корректна',
                                required: true,
                                type: 'email',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item

                        label="Пароль"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'введите пароль',
                            },
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item
                        label="Повторите пароль"
                        name="password2"
                        dependencies={['password']}
                        rules={[
                            {
                                required: true,
                                message: 'Пароли должны совпадать',
                            },
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Пароли должны совпадать'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item

                        label="Название организации"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'поле не должно быть пустым',

                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item

                        label="Описание"
                        name="surname"
                        rules={[
                            {
                                message: 'поле не должно быть пустым',
                                required: true,
                            },
                        ]}
                    >
                         <TextArea rows={4}  maxLength={6} />
                    </Form.Item>
                    <Form.Item style={{textAlign: 'center'}}>
                        <Button type="primary" htmlType="submit" style={{width: 200, height: 40, fontSize: 18,  backgroundColor:'#722ed1'}}
                                onClick={() => {
                                    form
                                        .validateFields()
                                        .then((values) => {
                                            onCreate(values, user, true, 'CREATOR' )
                                                .then(result => {
                                                    console.log(result.code)
                                                    if (result === true) {
                                                        form.resetFields();
                                                        navigate(CREATOR_ROUTE);
                                                    } else {
                                                        console.log(result)
                                                        message.error("Данный email уже зарегестрирован")

                                                    }
                                                });

                                        })
                                        .catch((info) => {
                                            console.log('Failed:', info);
                                        });
                                }}
                        >

                                Зарегестрироваться
                        </Button>
                    </Form.Item>
                </Form>
                </Card>)}
        </div>
        </div>
    );
};

export default CreatorRegist;