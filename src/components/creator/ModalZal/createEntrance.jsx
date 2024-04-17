import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button, Card, Flex, Form, Input, InputNumber, Space, Tour, Typography} from "antd";
import {CloseOutlined, QuestionOutlined, SearchOutlined} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import onCreate from "../../../services/userService/authService";
import {createEntrance} from "../../../http/entranceAPI";
import {Context} from "../../../index";
import HallPhoto from "../../../assets/Hall.png";
import SliderPhoto from "../../../assets/Slider.png";


const CreateEntrance = ({Close}) => {
    const [form] = Form.useForm();
    const {user} = useContext(Context)
    const [open, setOpen] = useState(false);

    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);

    const sum = () => {
        if (form.getFieldsValue().option === undefined) {
            return;
        }
        let sum = 0;
        form.getFieldsValue().option.forEach((i) => {
            sum += i.totalSeats;
        });

        form.setFieldsValue({
            totalSeats: sum,
        })


    };

    const steps = [
        {
            title: 'Категории',
            description: 'С помощью категорий можно бронировать билеты разного типа',
            target: null,
        },
        {
            title: 'Категории',
            description: 'Например обычныйе билеты, Vip и Фан зона',
            target: null,
        },
        {
            title: 'Заполнение категорий',
            description: 'Для добовление категории необходимо внести информацию о ней.',
            target: () => ref1.current,
        },
        {
            title: 'Заполнение категории',
            description: 'Необходимо указать название категории и сколько в ней мест',
            target: () => ref1.current,
        },
        {
            title: 'Добавить категорию',
            description: 'Если вам нужно больше категорий нажмите на кнопку "Добавить категорию".',
            target: () => ref2.current,
        },
        {
            title: 'Важно!',
            description: 'В зале может быть от 1 до 10 категории.',
            target: null,
        },
    ];

    return (

        <Form
            layout="vertical"
            form={form}
            name="dynamic_form_complex"
            style={{
                maxWidth: 600,
            }}
            autoComplete="off"
            initialValues={{
                option: [{}]
            }}
            title="Входные билеты"
        >
            <Form.Item
                label="Название площадки"
                name="name"
                rules={[
                    {
                        required: true,
                        message: 'Поле не должно быть пустым',
                    },
                ]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="Адрес площадки"
                name="address"
                rules={[
                    {
                        required: true,
                        message: 'Поле не должно быть пустым',
                    },
                ]}
            >
                <Input/>
            </Form.Item>
            <Space direction={"horizontal"}>
                <Title level={4}>Категории</Title>
                <Button style={{marginBottom: 10}} shape="circle" size={"small"} onClick={() => setOpen(true)}
                        icon={<QuestionOutlined/>}/>
            </Space>
            <Form.List name="option" onInput={sum} >
                {(fields, {add, remove}) => (
                    <div
                        style={{
                            display: 'flex',
                            rowGap: 16,
                            flexDirection: 'column',
                        }}
                    >
                        {fields.map((field, index) => (
                            <Card
                                ref={ref1}
                                size="small"
                                title={`Категория ${field.name + 1}`}
                                key={field.key}
                                extra={index !== 0 && (
                                    <CloseOutlined
                                        onClick={() => {
                                            remove(index);
                                            sum();
                                        }}
                                    />
                                )}
                            >
                                <Form.Item
                                    label="Название категории"
                                    name={[field.name, 'name']}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Поле не должно быть пустым',
                                        },
                                    ]}
                                >
                                    <Input/>
                                </Form.Item>

                                <Form.Item
                                    label="Мест в категорие"
                                    name={[field.name, 'totalSeats']}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Поле не должно быть пустым',
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        formatter={value => (value ? `${value}`.replace(/\D/g, '') : '')}  // Allow only numbers
                                        parser={value => (value ? value.replace(/\D/g, '') : '')}  // Allow only numbers
                                        maxLength={5}
                                        onInput={sum}
                                        style={{
                                            width: '100%',
                                        }}
                                    />
                                </Form.Item>
                            </Card>
                        ))}

                        <Button type="dashed" onClick={() => add()} block ref={ref2}>
                            Добавить категорию +
                        </Button>
                    </div>
                )}
            </Form.List>

            <Form.Item label="Всего мест" name="totalSeats">
                <Input disabled/>
            </Form.Item>
            <Form.Item style={{textAlign: 'center'}}>
                <Button type="primary" htmlType="submit"
                        style={{width: 200, height: 40, fontSize: 18, backgroundColor: '#722ed1'}}
                        onClick={() => {
                            form
                                .validateFields()
                                .then((values) => {
                                        const userId = user.user.id;
                                        values.userId = userId;
                                        createEntrance(values).then(response => {
                                            if (response.id) {
                                                Close()
                                                form.resetFields();
                                            } else {
                                                console.error("Error server");
                                            }
                                        })
                                    }
                                )
                                .catch((error) => {
                                    console.error("Error during form validation:", error);
                                });
                        }}
                >
                    Создать
                </Button>
            </Form.Item>

            <Tour open={open}
                  onClose={() => setOpen(false)}
                  steps={steps}
            />
        </Form>
    );
};

export default CreateEntrance;