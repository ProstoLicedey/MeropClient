import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {
    Button, Card, Col, ConfigProvider,
    DatePicker,
    Form,
    Input, InputNumber,
    message, notification, Row,
    Select, Space, Switch, Tooltip,
    TreeSelect, Typography, Upload,
} from 'antd';
import Title from "antd/es/typography/Title";
import {useNavigate, useParams} from "react-router-dom";
import {observer} from "mobx-react-lite";
import TextArea from "antd/es/input/TextArea";
import {UploadOutlined} from "@ant-design/icons";
import ruRU from "antd/es/locale/ru_RU";
import {Context} from "../../index";
import {createEvent, fetchRating, fetchTypes, getEventForUpdate, updateEvent} from "../../http/eventAPI";
import ModalZal from "../../components/creator/ModalZal/ModalZal";
import {
    getEntranceHallUser,
    getOneEntranceHall
} from "../../http/entranceAPI";
import {SmartCaptcha} from "@yandex/smart-captcha";
import {CREATOR_ROUTE} from "../../utils/consts";
import moment from "moment";
import dayjs from "dayjs";
import 'dayjs/locale/ru'; // Подключаем локаль ru
const {Text} = Typography;


const {RangePicker} = DatePicker;
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 10,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 14,
        },
    },
};


const CreateEvent = () => {
    dayjs.locale('ru');
    const today = dayjs();
    const nextYear = today.add(1, 'year');
    const {id} = useParams();
    const {event, creator, user} = useContext(Context)
    const [fileUploaded, setFileUploaded] = useState(false);
    const [modal, setModal] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [switchStates, setSwitchStates] = useState({});
    const [form] = Form.useForm();
    const [formEvent] = Form.useForm();
    const titleText = id == undefined ? "Создание мероприятия" : "Редактирование мероприятия";
    const [fileList, setFileList] = React.useState([]);
    const [captch_check, setCaptch_check] = useState(!!id);
    const [photoCheck, setPhotoCheck] = useState(false);
    const [resetCaptcha, setResetCaptcha] = useState(0);

    const navigate = useNavigate()


    useEffect(() => {
        fetchTypes().then(data => event.setTypes(data))
        fetchRating().then(data => event.setRatings(data))
        getEntranceHallUser(user.user.id).then(data => creator.setEntranceAll(data))


    }, [modal]);


    useEffect(() => {
        if (!!id) {
            getEventForUpdate(id, user.user.id).then(data => {
                const formattedDate = moment(data.dateTime);
                formEvent.setFieldsValue({
                    title: data.title,
                    description: data.description,
                    dateTime: formattedDate,
                    typeId: data.typeId,
                    ageRatingId: data.ageRatingId
                });
                setFileList(data.img ? [{
                    uid: '-1',
                    name: 'Изображение мероприятия',
                    status: 'done',
                    url: process.env.REACT_APP_API_URL + data.img
                }] : []);

                const hall = data.hallId ? data.hallId : (data.entranceId ? data.entranceId : null);
                selectEntranceHall(hall, data.type, data.option)
                setPhotoCheck(true)
            }).catch(error => {
                return notification.error({
                    message: 'Ошибка получения мероприятия',
                    description: error,

                })
            });
        }
    }, []);


    const handleUpload = ({file}) => {
        setFileList([file]);
        return false;
    };


    const selectEntranceHall = (value, type, option) => {
        if (value == 'new') {
            setModal(true)
            setSelectedValue(null);
            return
        }
        setSelectedValue(value);

        getOneEntranceHall(value, type).then(data => {
                creator.setEntrance(data)
                if (creator.entrance.options) {
                    // Обновляем значения формы на основе обновленных entranceOptions
                    form.setFieldsValue({
                        entrances: creator.entrance?.options.map((entrance, index) => ({
                            id: entrance.id,
                            switchState: switchStates[entrance.id] === undefined ? true : switchStates[entrance.id],
                            price: option ? option[index]?.price : ''
                        })),
                    });
                }
            }
        )

    };
    const beforeUpload = async (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Можно загружать только изображения!');
            formEvent.Image(null)
        }
        if (Array.isArray(file)) {

            setFileUploaded(false); // Update state based on whether a file is present
        }
        setFileUploaded(true);
        return Promise.resolve();
    };
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

    const handleCaptchaError = (error) => {
        console.error('Ошибка капчи:', error);
    };

    return (
        <Row style={{
            margin: '2%',
            display: "flex",
            textAlign: 'center',
            alignItems: 'flex-start',
            justifyContent: 'center',
            height: '100%'
        }}>
            <Col xs={24} sm={12}>
                <Space direction="vertical" style={{width: '95%', margin: 5}}>
                    <Title level={2}>
                        {titleText}
                    </Title>
                    <Form
                        form={formEvent}
                        title={"Общая информация"}
                        {...formItemLayout}
                        style={{
                            maxWidth: '100%',
                            width: '100%',
                            padding: '0 16px',
                            boxSizing: 'border-box',
                        }}
                    >
                        <Form.Item
                            label="Название"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Укажите как называется ваше мероприятие',
                                },
                            ]}
                        >
                            <Input showCount maxLength={50} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Описание"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Напишиите несколько слов о мерорприятие',
                                },
                            ]}
                        >
                            <TextArea
                                showCount
                                maxLength={5000}
                                autoSize={{
                                    minRows: 3,
                                    maxRows: 15,
                                }}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <ConfigProvider locale={ruRU}>
                            <Form.Item
                                label="Дата и время"
                                name="dateTime"
                                rules={[
                                    {
                                        type: 'object',
                                        required: true,
                                        message: 'Укажите когда запанировано мероприятие',
                                    },
                                ]}
                            >
                                <DatePicker
                                    minDate={today}
                                    maxDate={nextYear}
                                    showTime
                                    format="YYYY-MM-DD HH:mm"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </ConfigProvider>
                        <Form.Item
                            label="Изображение"
                            rules={[
                                {
                                    message: 'Загрузите фото',
                                },
                            ]}
                        >
                            <Upload
                                customRequest={handleUpload}
                                fileList={fileList}
                                maxCount={1}
                                onChange={() => setPhotoCheck(true)}
                                listType="picture"
                            >
                                <Button icon={<UploadOutlined />}>
                                    Выбрать изображение (максимум 1)
                                </Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            label="Тип мероприятия"
                            name="typeId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Выберите тип вашего мероприятия',
                                },
                            ]}
                        >
                            <Select options={event.types} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Возрастное ограничение"
                            name="ageRatingId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Укажите возрастное ограничение мероприятия',
                                },
                            ]}
                        >
                            <Select options={event.ratings} style={{ width: '100%' }} />
                        </Form.Item>
                        {!id && (
                            <Form.Item
                                label="Проверка"
                                name="captcha"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Необходимо пройти капчу',
                                    },
                                ]}
                            >
                                <SmartCaptcha
                                    key={resetCaptcha}
                                    sitekey={process.env.REACT_APP_CAPTCHA_KEY_CREATOR}
                                    onError={handleCaptchaError}
                                    onJavaScriptError={handleCaptchaError}
                                    onTokenExpired={handleCaptchaError}
                                    onSuccess={() => {
                                        setCaptch_check(true);
                                        formEvent.setFieldsValue({ captcha: true });
                                    }}
                                />
                            </Form.Item>
                        )}
                    </Form>

                </Space>
            </Col>
            <Col xs={24} sm={12} style={{flex: 1,}}>
                <Space direction="vertical" style={{width: '95%', margin: 5, height: '100%',}}>
                    <Title level={4}>
                        Схема продажи
                    </Title>
                    <Tooltip
                        title={!!id ? "Зал у созданного мероприятия поменять уже нельзя, если вам это необходимо советуем пересоздать мероприятие" : 'Выберите зал'}>
                        <Select
                            disabled={!!id}
                            style={{width: '100%', maxWidth: 400}}
                            showSearch
                            onChange={(value, option) => selectEntranceHall(value, option.type)}
                            placeholder="Выбрать схему продаж"
                            value={selectedValue}
                            optionFilterProp="children"
                            filterOption={filterOption}
                            options={[
                                {key: 'new', label: '+Добавить новую схему', value: 'new', style: {color: '#722ed1'}},
                                ...creator.entranceAll.map((item, index) => ({key: index, ...item}))
                            ]}
                        />
                    </Tooltip>
                    {creator.entrance?.options && (
                        <Form
                            form={form}

                            initialValues={{
                                entrances: creator.entrance.options?.map((entrance) => ({
                                    id: entrance.id,
                                    switchState: switchStates[entrance.id] === undefined ? true : switchStates[entrance.id],
                                    price: "",

                                })),
                            }}
                        >
                            <Card title={creator.entrance.address} style={{marginTop: 25}}>
                                <Form.List name="entrances">
                                    {(fields, {add, remove}) => (
                                        <>
                                            {fields.map(({key, name, ...restField}) => (
                                                <Card.Grid
                                                    hoverable={false}
                                                    key={key}
                                                    style={{
                                                        maxHeight: 70,
                                                        position: 'relative',
                                                        width: '100%',
                                                        backgroundColor: switchStates[name] === false ? '#f5f5f5' : 'white',
                                                        cursor: switchStates[name] === false ? 'not-allowed' : 'default',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        padding: '10px'
                                                    }}
                                                >
                                                    <Tooltip title="Убрать категорию в этом мероприятие ">
                                                        <div style={{ position: 'absolute', top: 0, right: 3 }}>
                                                            <Form.Item
                                                                name={[name, 'switchState']}
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: 'Укажите стоимость билетов',
                                                                    },
                                                                ]}
                                                            >
                                                                {creator.entrance.type == 'Entrance' && (
                                                                    <Switch
                                                                        defaultChecked={true}
                                                                        size="small"
                                                                        {...restField}
                                                                        checked={switchStates[name]}
                                                                        onChange={(checked) => {
                                                                            setSwitchStates((prevStates) => ({
                                                                                ...prevStates,
                                                                                [name]: checked
                                                                            }))
                                                                        }}
                                                                    />
                                                                )}
                                                            </Form.Item>
                                                        </div>
                                                    </Tooltip>
                                                    <Row style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                                        <Col span={8} style={{ flex: '1 1 auto', marginBottom: '8px' }}>
                                                            <Title level={4} style={{ marginRight: '16px', textAlign: 'left' }}>
                                                                {creator.entrance.options[name].name}
                                                            </Title>
                                                        </Col>
                                                        <Col span={7} style={{ flex: '1 1 auto', marginBottom: '8px' }}>
                                                            <Text type="secondary">Мест: {creator.entrance.options[name].totalSeats}</Text>
                                                        </Col>
                                                        <Col span={8} style={{ flex: '1 1 auto', marginBottom: '8px' }}>
                                                            <Form.Item name={[name, 'price']}>
                                                                <InputNumber
                                                                    maxLength={7}
                                                                    min={0}
                                                                    addonAfter="₽"
                                                                    placeholder="Цена"
                                                                    style={{ marginRight: 40, width: '100%' }}
                                                                    disabled={switchStates[name] === undefined ? false : !switchStates[name]}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </Card.Grid>

                                            ))}
                                        </>
                                    )}
                                </Form.List>
                            </Card>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{
                                    marginTop: 20,
                                    width: 250,
                                    height: 40,
                                    fontSize: 18,
                                    backgroundColor: '#722ed1',
                                }}
                                onClick={() => {
                                    formEvent
                                        .validateFields()
                                        .then((value) => {
                                            form.validateFields()
                                                .then(() => {
                                                    if (captch_check && photoCheck) {
                                                        if (!value.title.trim() || !value.description.trim() || !value.dateTime) {
                                                            return notification.error({
                                                                message: 'Ошибка',
                                                                description: 'Заполните поля верно'
                                                            });
                                                        }
                                                      setResetCaptcha((prev) => prev + 1);

                                                        if (!id) {
                                                            createEvent(formEvent.getFieldsValue(), user.user.id, fileList[0], form.getFieldsValue(), creator.entrance.type)
                                                                .then((response) => {
                                                                    navigate(CREATOR_ROUTE)


                                                                })
                                                        } else {
                                                            updateEvent(formEvent.getFieldsValue(), user.user.id, fileList[0], form.getFieldsValue(), creator.entrance.type, id)
                                                                .then((response) => {
                                                                    navigate(CREATOR_ROUTE)
                                                                    return notification.success({
                                                                        message: 'Данные мероприятия успешно измеены'
                                                                    })


                                                                })
                                                        }
                                                    } else {

                                                        return notification.warning({
                                                            message: 'Пожалуйста заполните все поля',

                                                        })
                                                    }
                                                })
                                                .catch((error) => {
                                                    return notification.error({
                                                        message: 'Ошибка получения мероприятия',
                                                        description: "Пожалуста заполните все поля",

                                                    })

                                                });
                                        })
                                        .catch((error) => {
                                            console.error("Error during form validation:", error);
                                            return notification.error({
                                                message: 'Ошибка валидации  ',
                                                description: "Пожалуста заполните все поля",
                                            })

                                        });
                                }}
                            >
                                {id ? "Изменить" : "Создать"}
                            </Button>
                        </Form>)}

                </Space>
            </Col>

            <ModalZal open={modal}
                      onCancel={() => {
                          setModal(false);
                      }}/>
        </Row>
    );
}
export default observer(CreateEvent);