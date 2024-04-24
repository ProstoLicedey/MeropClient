import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    Alert, Button, Card, Form, Input, InputNumber, notification, Segmented, Select, Slider, Space, Tooltip, Tour
} from "antd";
import {Context} from "../../../index";
import {CloseOutlined, QuestionOutlined} from "@ant-design/icons";
import {createEntrance, updateEntrance} from "../../../http/entranceAPI";
import Title from "antd/es/typography/Title";
import HallPhoto from "../../../assets/Hall.png";
import SliderPhoto from "../../../assets/Slider.png";
import {createHall, updateHall} from "../../../http/hallAPI";
import {getCityDaData} from "../../../http/cityAPi";
import {observer} from "mobx-react-lite";


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
    const {user, hall} = useContext(Context)
    const [open, setOpen] = useState(false);
    const [maxRows, setMaxRows] = useState(50);
    const [maxSeat, setMaxSeat] = useState(50);
    const [select, setSelect] = useState('');

    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);

    useEffect(() => {
        // Обновляем максимальное значение слайдера
        form.setFieldsValue({row: maxRows});
        form.setFieldsValue({seat: maxSeat});
    }, [maxRows, maxSeat]);

    useEffect(() => {
        if (!!hall.hallUpdate) {

           // setSelect(hall.hallUpdate?.city?.ideficator)

            const options = hall.hallUpdate.hallOptions?.map(option => ({
                name: option.name.trim(), // убираем лишние пробелы
                row: [option.rowStart, option.rowFinish],
                seat: [option.seatStart, option.seatFinish],
                id: option.id,
            }));

            form.setFieldsValue({
                name: hall.hallUpdate.name,
                address: hall.hallUpdate.address,
                row: hall.hallUpdate.numberRows,
                seat: hall.hallUpdate.numberSeatsInRow,
                city: {value: hall.hallUpdate.city?.ideficator, label: hall.hallUpdate.city?.name},
                option: options ? options : {}
            })
            setMaxRows(hall.hallUpdate.numberRows)
            setMaxSeat(hall.hallUpdate.numberSeatsInRow)


        } else {
            form.setFieldsValue({
                name: "",
                address: "",
                option: [{}],
            })
        }
    }, [hall.hallUpdate, Close]);

    const getCity = (inputValue) => {
        if (inputValue.length > 2) {
            getCityDaData(inputValue).then(data => hall.setCity(data))
        }
    };
    const notificationFuncion = (description) => {
        return notification.error({
            message: 'Ошибка', description: description,

        })
    };
    const steps = [{
        title: 'Категории',
        description: 'Категории созданы для дальнейшего разбиения зала на категории с разными стоимостями',
        target: null,
    }, {
        title: 'Категории', description: 'Например передние ряды могу стоить дороже чем, задние', cover: (<img
            alt="Зрительный зал"
            src={HallPhoto}
        />), target: null,
    }, {
        title: 'Заполнение категорий',
        description: 'Для добовление категории необходимо внести информацию о ней.',
        target: () => ref1.current,
    }, {
        title: 'Заполнение категории',
        description: 'С помощью слайдеров необходимо выбрать ряд и место начала и конца категории.',
        target: () => ref2.current,
    }, {
        title: 'Слайдеры',
        description: 'Начальное и конченое значение слайдера тоже входят в категорию. Например если у вас зал 10 на 10 и вы хотите чтоб 1 ряд бы в отдельной категорие необходимо сделать как на фото',
        cover: (<img
            alt="Слайдер зал"
            src={SliderPhoto}
        />),
        target: () => ref2.current,
    }, {
        title: 'Добавить категорию',
        description: 'Если вам нужно больше категорий нажмите на кнопку "Добавить категорию".',
        target: () => ref3.current,
    }, {
        title: 'Важно!',
        description: 'Важно, чтоб каждое место в зале относилось к какой либо категори, иначе зал не добавиться.',
        target: null,
    },];


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

            {hall.hallUpdate?.eventCount > 0 && (<Alert
                message={`Зал привязан к  актуальным мероприятиям, поэтому добавить или удалить категории не получиться`}
                banner style={{margin: 10}}/>)}
            <Form.Item
                label="Название площадки"
                name="name"
                rules={[{
                    required: true, message: 'Поле не должно быть пустым',
                },]}
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
                    defaultValue={select}
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
                        const selectedOption = {value, label: option.label};
                        // Устанавливаем это значение в форму
                        form.setFieldsValue({city: selectedOption});
                    }}
                />
            </Form.Item>
            <Form.Item
                label="Адрес площадки"
                name="address"
                rules={[{
                    required: true, message: 'Поле не должно быть пустым',
                },]}
            >
                <Input  maxLength={200}/>
            </Form.Item>
            <Form.Item
                label="Количество рядов"
                name="row"
                rules={[{
                    required: true, message: 'Поле не должно быть пустым',
                },]}
            >
                <InputNumber min={1} max={50} onChange={(value) => setMaxRows(value)}/>
            </Form.Item>
            <Form.Item
                label="Количество мест"
                name="seat"
                rules={[{
                    required: true, message: 'Поле не должно быть пустым',
                },]}
            >
                <InputNumber min={1} max={50} onChange={(value) => setMaxSeat(value)}/>
            </Form.Item>

            <Space direction={"horizontal"}>
                <Title level={4}>Категории</Title>
                <Button style={{marginBottom: 10}} shape="circle" size={"small"} onClick={() => setOpen(true)}
                        icon={<QuestionOutlined/>}/>
            </Space>

            <Form.List name="option">
                {(fields, {add, remove}) => (<div
                    style={{
                        display: 'flex', rowGap: 16, flexDirection: 'column',
                    }}
                >
                    {fields.map((field, index) => (<Card
                        ref={ref1}
                        size="small"
                        title={`Категория ${field.name + 1}`}
                        key={field.key}
                        extra={index !== 0 && (hall.hallUpdate === null || hall.hallUpdate?.eventCount == 0) && (
                            <CloseOutlined
                                onClick={() => {
                                    remove(index);
                                }}
                            />)}
                    >
                        <Form.Item
                            label="Название категории"
                            name={[field.name, 'name']}
                            rules={[{
                                required: true, message: 'Поле не должно быть пустым',
                            },]}
                        >
                            <Input showCount maxLength={50}/>
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
                    </Card>))}

                    <Tooltip
                        title={hall.hallUpdate?.eventCount > 0 ? "Зал привязан к актуальным мероприятиям, поэтому добавить или удалить категории не получиться" : fields.length >= 15 ? "Больше добавить категррий нельзя, макисмум 15":""}>
                        <Button disabled={hall.hallUpdat?.eventCount > 0 || fields.length >= 15} type="dashed" onClick={() => add()} block
                                ref={ref2}>
                            Добавить категорию +
                        </Button>
                    </Tooltip>
                </div>)}
            </Form.List>


            <Form.Item style={{textAlign: 'center'}}>
                <Button type="primary" htmlType="submit"
                        style={{width: 200, height: 40, fontSize: 18, backgroundColor: '#722ed1', margin: 10}}
                        onClick={() => {
                            form
                                .validateFields()
                                .then((values) => {

                                    let array = create2DArray(values.row, values.seat);
                                    console.log(values)
                                    values.option.map((op) => {
                                        const row = op.row ? op.row : [1, values.row];
                                        const seat = op.seat ? op.seat : [1, values.seat];
                                        array = setRangeToTrue(row, seat, array);
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
                                        notificationFuncion('Ошибка некотрые места не принадлежат  не 1 категорие, или принадлежит сразу нескольким категориям');
                                        console.log("error " + array);
                                    } else {

                                        const userId = user.user.id;
                                        values.userId = userId;
                                        if (!!hall.hallUpdate?.id) {
                                            values.eventCount = hall.hallUpdate?.eventCount;
                                            updateHall(values, hall.hallUpdate?.id)
                                                .then(() => {
                                                    Close()
                                                    form.resetFields();
                                                })
                                                .catch(error => {
                                                    console.error("Ошибка при выполнении запроса:", error);
                                                });
                                        } else {
                                            createHall(values)
                                                .then(() => {
                                                    Close()
                                                    form.resetFields();
                                                })
                                                .catch(error => {
                                                    console.error("Ошибка при выполнении запроса:", error);
                                                });
                                        }
                                    }


                                })
                                .catch((error) => {
                                    notificationFuncion('Ошибка проверки');
                                    console.error("Ошибка во время валидации формы:", error);
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
        </Form>);
};

export default observer(CreateZal);