import React, {useContext, useEffect, useRef, useState} from 'react';
import {Alert, Button, Card, Flex, Form, Input, InputNumber, Select, Space, Tooltip, Tour, Typography} from "antd";
import {CloseOutlined, QuestionOutlined, SearchOutlined} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import onCreate from "../../../services/userService/authService";
import {createEntrance, updateEntrance} from "../../../http/entranceAPI";
import {Context} from "../../../index";
import HallPhoto from "../../../assets/Hall.png";
import SliderPhoto from "../../../assets/Slider.png";
import {observer} from "mobx-react-lite";
import {getCityDaData} from "../../../http/cityAPi";


const CreateEntrance = ({Close}) => {
    const [form] = Form.useForm();
    const {user, hall} = useContext(Context)
    const [open, setOpen] = useState(false);

    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);

    const sum = () => {
        const options = form.getFieldsValue().option;
        if (options === undefined) {
            form.setFieldsValue({
                totalSeats: 0,
            });
            return;
        }

        let sum = 0;
        options.forEach((option) => {
            if (option && option.totalSeats) {
                sum += option.totalSeats;
            }
        });

        form.setFieldsValue({
            totalSeats: typeof sum === "number" ? sum : 0,
        });
    };
    const getCity = (inputValue) => {
        if (inputValue.length > 3) {
            getCityDaData(inputValue).then(data => hall.setCity(data))
        }
    };

    useEffect(() => {
        if (!!hall.hallUpdate?.entranceOptions) {
            const options = hall.hallUpdate.entranceOptions?.map(option => ({
                name: option.name.trim(), // убираем лишние пробелы
                totalSeats: option.totalSeats,
                id: option.id
            }));

            form.setFieldsValue({
                name: hall.hallUpdate.name,
                address: hall.hallUpdate.address,
                city: {value: hall.hallUpdate.city?.ideficator, label: hall.hallUpdate.city?.name},
                option: options ? options : {}
            })


        }
        else {
            form.setFieldsValue({
                name: "",
                address: "",
                option: [{}],
            })
        }
        sum()
    }, [hall.hallUpdate, Close]);

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
            {hall.hallUpdate?.eventCount > 0 && (
                <Alert
                    message={`Зал привязан к  актуальным мероприятиям, поэтому добавить или удалить категории не получиться`}
                    banner style={{margin: 10}}/>
            )}

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
                <Input showCount maxLength={50}/>
            </Form.Item>
            <Form.Item
                label="Город"
                name="city"
                rules={[
                    {
                        required: true,
                        message: 'Поле не должно быть пустым',
                    },
                ]}
            >
                <Select
                    showSearch
                    placeholder=""
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    onSearch={(inputValue) => getCity(inputValue)} // передаем введенное значение в функцию getCity
                    options={hall.city}
                    onChange={(value, option) => {
                        // Создаем объект, который содержит как value, так и label
                        const selectedOption = { value, label: option.label };
                        // Устанавливаем это значение в форму
                        form.setFieldsValue({ city: selectedOption });
                    }}
                />
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
                <Input  maxLength={200}/>
            </Form.Item>
            <Space direction={"horizontal"}>
                <Title level={4}>Категории</Title>
                <Button style={{marginBottom: 10}} shape="circle" size={"small"} onClick={() => setOpen(true)}
                        icon={<QuestionOutlined/>}/>
            </Space>
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
                                ref={ref1}
                                size="small"
                                title={`Категория ${field.name + 1}`}
                                key={field.key}
                                extra={(index !== 0 && (hall.hallUpdate === null || hall.hallUpdate?.eventCount === 0) && (
                                    <CloseOutlined
                                        onClick={() => {
                                            remove(index);
                                            sum();
                                        }}
                                    />
                                ))}
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
                                    <Input howCount maxLength={50}/>
                                </Form.Item>

                                <Form.Item
                                    label="Мест в категории"
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
                        <Tooltip
                            title={hall.hallUpdate?.eventCount > 0 ? "Зал привязан к актуальным мероприятиям, поэтому добавить или удалить категории не получиться" : fields.length >= 15 ? "Больше добавить категррий нельзя, макисмум 15":""}>
                            <Button disabled={hall.hallUpdat?.eventCount > 0 || fields.length >= 15} type="dashed" onClick={() => add()} block
                                    ref={ref2}>
                                Добавить категорию +
                            </Button>
                        </Tooltip>
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

                                        if (!!hall.hallUpdate?.id) {
                                            values.eventCount = hall.hallUpdate?.eventCount;
                                            updateEntrance(values, hall.hallUpdate?.id)
                                                .then(() => {
                                                    Close()
                                                    form.resetFields();
                                                })
                                                .catch(error => {
                                                    console.error("Ошибка при выполнении запроса:", error);
                                                });
                                        } else {
                                            createEntrance(values)
                                                .then(() => {
                                                    Close()
                                                    form.resetFields();
                                                })
                                                .catch(error => {
                                                    console.error("Ошибка при выполнении запроса:", error);
                                                });
                                        }
                                    }
                                )
                                .catch((error) => {
                                    console.error("Error during form validation:", error);
                                });
                        }}
                >
                    {!!hall.hallUpdate?.id ? "Изменить" : "Создать"}
                </Button>
            </Form.Item>

            <Tour open={open}
                  onClose={() => setOpen(false)}
                  steps={steps}
            />
        </Form>
    );
};

export default observer(CreateEntrance);