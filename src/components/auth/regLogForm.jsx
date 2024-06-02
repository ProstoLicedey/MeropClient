import React, {useContext, useState} from 'react';
import {Alert, Button, DatePicker, Form, Input, Modal, notification, Space, Typography} from "antd";
import onCreate from "../../services/userService/authService";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {ReCAPTCHA} from "react-google-recaptcha";
import {SmartCaptcha} from "@yandex/smart-captcha";
import passwordCheck from "../../services/passwordCheck";

const {Text, Link} = Typography

const RegLogForm = ({title, onCancel, setPassUpdate, idCreator}) => {
    const [form] = Form.useForm();
    const [isRegistration, setIsRegistration] = useState(!!idCreator);
    const [message, setMessage] = useState(false);
    const [buttonActiv, setButtonActiv] = useState(false);
    const {user} = useContext(Context)
    const [openPas, setOpenPas] = useState(false);
    const [captch_check, setCaptch_check] = useState(false);

    title(isRegistration ? (!!idCreator ? "Добавление контроллера" : "Регистрация") : "Авторизация");
    const buttonText = !isRegistration ? 'Войти' : (!!idCreator ? 'Добавить контроллера' : 'Зарегистрироваться');
    const buttonLabel = !isRegistration ? 'Зарегистрироваться' : (!!idCreator ? '' : 'Войти');
    const recap = () => {
        setButtonActiv(true)
    }
    return (
        <Form
            form={form}
            layout="vertical"
            name="form_in_modal"
            initialValues={{
                modifier: 'public',
            }}
        >
            {message && (
                <Alert type="error" message={message} showIcon/>
            )}
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
                <Input maxLength={60}/>
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
                <Input.Password maxLength={100}/>
            </Form.Item>

            <Form.Item
                hidden={!isRegistration}
                label="Повторите пароль"
                name="password2"
                dependencies={['password']}
                rules={[
                    {
                        required: isRegistration,
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
                <Input.Password maxLength={100}/>
            </Form.Item>
            <Form.Item
                hidden={!isRegistration}
                label="Имя"
                name="name"
                rules={[
                    {

                        message: 'не корректно',
                        required: isRegistration,
                    },
                ]}
            >
                <Input maxLength={50}/>
            </Form.Item>
            <Form.Item
                hidden={!isRegistration}
                label="Фамилия"
                name="surname"
                rules={[
                    {
                        message: 'введите фамилию',
                        required: isRegistration,
                    },
                ]}
            >
                <Input maxLength={50}/>
            </Form.Item>
            <Form.Item
                hidden={!isRegistration}
                label="Дата рождения"
                name="birthday"
                rules={[
                    {

                        message: 'введите дату',
                        type: 'date',
                        required: false,
                    },
                ]}
            >
                <DatePicker sty placeholder=""/>
            </Form.Item>

            <Space size={'large'}>
                <SmartCaptcha sitekey={process.env.REACT_APP_CAPTCHA_KEY}
                              onSuccess={() => setCaptch_check(true)}/>
            </Space>
            <div hidden={isRegistration}
                 style={{textAlign: 'right', cursor: 'pointer'}}
            >
                <Text underline onClick={() => setPassUpdate(true)}>Забыли пароль?</Text>
            </div>

            <Form.Item style={{textAlign: 'center'}}>
                <Button type="primary" htmlType="submit"
                        style={{width: 220, height: 40, fontSize: 18, backgroundColor: '#722ed1'}}
                    // disabled = {!buttonActiv}
                        onClick={() => {
                            setMessage('');
                            form
                                .validateFields()
                                .then((values) => {
                                    if (captch_check) {
                                        if (isRegistration) {
                                            const data = passwordCheck(values.password);
                                            if (data !== true) {
                                                return notification.error({
                                                    message: 'Ошибка',
                                                    description: data
                                                });
                                            }
                                        }
                                        onCreate(values, user, isRegistration, (!!idCreator ? 'CONTROLLER' : 'USER'), idCreator)
                                            .then(result => {

                                                if (result === true) {
                                                    console.log(result);
                                                    setIsRegistration(false);
                                                    form.resetFields();
                                                    onCancel();
                                                    setMessage('');
                                                } else {
                                                    if (result.response.status === 451) {
                                                        form.resetFields();
                                                        onCancel();
                                                        return Modal.error({
                                                            title: 'Ваш аккаунт заблокирован!',
                                                            content: `В связи с нарушением прав платформы ваш аккаунт заблокирован на площадке. Если вы считаете, что это ошибка, напишите нам на почту ${process.env.REACT_APP_EMAIL}`,
                                                        });
                                                    }
                                                    isRegistration ?
                                                        setMessage("Данный email уже зарегистрирован") :
                                                        setMessage("Логин и пароль не совпадают");
                                                }
                                            })
                                            .catch(error => {
                                                if (error.response && error.response.status === 451) {
                                                    return Modal.error({
                                                        title: 'Ваш аккаунт заблокирован',
                                                        content: 'some messages...some messages...',
                                                    });
                                                    setMessage("Ошибка 451: Недоступно по юридическим причинам.");
                                                } else {
                                                    console.error("Произошла ошибка:", error);

                                                }
                                            });
                                    } else {
                                        setMessage("Проверка Captcha не пройдена");
                                    }
                                })
                                .catch((info) => {
                                    console.log('Failed:', info);
                                });
                        }}
                >
                    {buttonText}
                </Button>
            </Form.Item>


            <div style={{textAlign: 'center'}}>
                <Link onClick={() => {
                    isRegistration ? setIsRegistration(false) : setIsRegistration(true);
                    setMessage('')
                }} underline>
                    {buttonLabel}
                </Link>
            </div>
        </Form>
    );
};

export default observer(RegLogForm);