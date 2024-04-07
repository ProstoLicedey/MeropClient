import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Flex, Form, Input, InputNumber, Space, Typography} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import onCreate from "../../../services/userService/authService";
import {createEntrance} from "../../../http/entranceAPI";
import {Context} from "../../../index";


const CreateEntrance = ({Close}) => {
    const [form] = Form.useForm();
    const {user} = useContext(Context)
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

            <Form.List name="option" onInput={sum}>
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

                        <Button type="dashed" onClick={() => add()} block>
                            Добавить категорию +
                        </Button>
                    </div>
                )}
            </Form.List>

            {/*<Form.Item noStyle shouldUpdate>*/}
            {/*    {() => (*/}
            {/*       м
            {/*    )}*/}
            {/*</Form.Item>*/}
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
        </Form>
    );
};

export default CreateEntrance;