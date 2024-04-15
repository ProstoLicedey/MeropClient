import React, {useContext, useEffect, useRef, useState} from 'react';
import {Alert, Button, Card, Form, Input, InputNumber, Segmented, Slider, Space, Tour} from "antd";
import {Context} from "../../../index";
import {CloseOutlined, QuestionOutlined} from "@ant-design/icons";
import {createEntrance} from "../../../http/entranceAPI";
import Title from "antd/es/typography/Title";
import HallPhoto from "../../../assets/Hall.png";
import SliderPhoto from "../../../assets/Slider.png";
import {createHall} from "../../../http/hallAPI";


//создания массива для проверки
function create2DArray(n, j) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(new Array(j).fill(false));
    }
    return arr;
}

function setRangeToTrue(nRange, jRange, array) {
    const [nStart, nEnd] = nRange.map(val => val - 1); // уменьшаем на 1, чтобы начинать с индекса 0
    const [jStart, jEnd] = jRange.map(val => val - 1); // уменьшаем на 1, чтобы начинать с индекса 0

    for (let i = nStart; i <= nEnd && i < array.length; i++) {
        for (let j = jStart; j <= jEnd && j < array[i].length; j++) {
            array[i][j] = !array[i][j];
        }
    }
    return array;
}




const CreateZal = ({Close}) => {
    const [form] = Form.useForm();
    const {user} = useContext(Context)
    const [open, setOpen] = useState(false);
    const [maxRows, setMaxRows] = useState(50);
    const [maxSeat, setMaxSeat] = useState(50);
    const [message, setMessage] = useState(false);

    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);

    useEffect(() => {
        // Обновляем максимальное значение слайдера
        form.setFieldsValue({ row: maxRows });
        form.setFieldsValue({ seat: maxSeat });
    }, [maxRows, maxSeat]);


    const steps = [
        {
            title: 'Категории',
            description: 'Категории созданы для дальнейшего разбиения зала на категории с разными стоимостями',
            target: null,
        },
        {
            title: 'Категории',
            description: 'Например передние ряды могу стоить дороже чем, задние',
            cover: (
                <img
                    alt="Зрительный зал"
                    src={HallPhoto}
                />
            ),
            target: null,
        },
        {
            title: 'Заполнение категорий',
            description: 'Для добовление категории необходимо внести информацию о ней.',
            target: () => ref1.current,
        },
        {
            title: 'Заполнение категории',
            description: 'С помощью слайдеров необходимо выбрать ряд и место начала и конца категории.',
            target: () => ref2.current,
        },
        {
            title: 'Слайдеры',
            description: 'Начальное и конченое значение слайдера тоже входят в категорию. Например если у вас зал 10 на 10 и вы хотите чтоб 1 ряд бы в отдельной категорие необходимо сделать как на фото',
            cover: (
                <img
                    alt="Слайдер зал"
                    src={SliderPhoto}
                />
            ),
            target: () => ref2.current,
        },
        {
            title: 'Добавить категорию',
            description: 'Если вам нужно больше категорий нажмите на кнопку "Добавить категорию".',
            target: () => ref3.current,
        },
        {
            title: 'Важно!',
            description: 'Важно, чтоб каждое место в зале относилось к какой либо категори, иначе зал не добавиться.',
            target: null,
        },
    ];

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
            {message && (
                <Alert style={{margin:10}} type="error" message={message} showIcon/>
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
            <Form.Item
                label="Количество рядов"
                name="row"
                rules={[
                    {
                        required: true,
                        message: 'Поле не должно быть пустым',
                    },
                ]}
            >
                <InputNumber min={1} max={50} defaultValue={10} onChange={(value) => setMaxRows(value)} />
            </Form.Item>
            <Form.Item
                label="Количество мест"
                name="seat"
                rules={[
                    {
                        required: true,
                        message: 'Поле не должно быть пустым',
                    },
                ]}
            >
                <InputNumber defaultValue={10}min={1} max={50}  onChange={(value) => setMaxSeat(value) }/>
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
                                <div ref={ref2}>
                                    <Form.Item
                                        label="Ряды в категорие"
                                        name={[field.name, 'row']}
                                    >
                                        <Slider
                                            range
                                            defaultValue={[1, 50]}
                                            min={1}
                                            max={maxRows}
                                            marks={maxRows ? {
                                                1: '1', // Минимальное значение
                                                [maxRows]: maxRows.toString() // Максимальное значение
                                            } : {}}

                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Места в категорие"
                                        name={[field.name, 'seat']}
                                    >
                                        <Slider
                                            range
                                            defaultValue={[1, 50]}
                                            min={1}
                                            max={maxSeat}
                                            marks={maxSeat ? {
                                                1: '1', // Минимальное значение
                                                [maxSeat]: maxSeat.toString() // Максимальное значение
                                            } : {}}
                                        />
                                    </Form.Item>
                                </div>
                            </Card>
                        ))}

                        <Button ref={ref3} type="dashed" onClick={() => add()} block>
                            Добавить категорию +
                        </Button>
                    </div>
                )}
            </Form.List>



            <Form.Item style={{textAlign: 'center'}}>
                <Button type="primary" htmlType="submit"
                        style={{width: 200, height: 40, fontSize: 18, backgroundColor: '#722ed1', margin:10}}
                        onClick={() => {
                            setMessage('');
                            form
                                .validateFields()
                                .then((values) => {

                                    let array = create2DArray(values.row, values.seat);
                                    console.log(values)
                                    values.option.map((op) => {
                                        array = setRangeToTrue(op.row, op.seat, array);
                                    })


                                    let errorFound = false;
                                    for (let i = 0; i < array.length; i++) {
                                        for (let j = 0; j < array[i].length; j++) {
                                            if (array[i][j] === false) {
                                                errorFound = true;
                                                break;
                                            }
                                        }
                                        if (errorFound) {
                                            break;
                                        }
                                    }
                                    if (errorFound) {
                                        setMessage('Ошибка некотрые места не принадлежат  не 1 категорие, или принадлежит сразу нескольким категориям');
                                        console.log("error " + array);
                                    } else {

                                        const userId = user.user.id;
                                        values.userId = userId;
                                        createHall(values).then(response => {
                                            if (response.id) {
                                                Close()
                                                form.resetFields();
                                            } else {
                                                setMessage('Внутреняя ошибка');
                                                console.error("Error server");
                                            }
                                        })
                                    }


                                })
                                .catch((error) => {
                                    setMessage('Ошибка проверки');
                                    console.error("Ошибка во время валидации формы:", error);
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

export default CreateZal;