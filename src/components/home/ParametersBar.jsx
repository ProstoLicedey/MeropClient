import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, ConfigProvider, DatePicker, InputNumber, List, Row, Select, Slider, Space, Typography} from "antd";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import ruRU from 'antd/es/locale/ru_RU';
import EventItem from "./EventItem";
import Link from "antd/es/typography/Link";
import dayjs from "dayjs";
import {fetchRating, fetchTypes} from "../../http/eventAPI";
import {getEntranceHallUser} from "../../http/entranceAPI";

const {Text, Title} = Typography

const {RangePicker} = DatePicker;

const ParametersBar = observer(() => {
    const today = dayjs();
    const {event} = useContext(Context)
    const [priceMax, setPriceMax] = useState(1000);
    const [city, setCity] = useState('');
    const [data, setData] = useState('');
    const getBackgroundColor = (type) => {
        return type.value === event.selectedType.value ? '#b37feb' : 'inherit';
    };
    const handleDateChange = (dates) => {
        setData(dates)
        event.setSelectedDate(dates)
    };




    useEffect(() => {
        event.events.forEach(event => {
            if (event.minPrice > priceMax) {
                setPriceMax(event.minPrice);
            }
        });
    }, [event.events]);



    const onSliderChange = (values) => {
        setSliderValues(values);
        event.setSelectedPrice(values)
    };

    const onMinInputChange = (value) => {
        setSliderValues([value, sliderValues[1]]);
    };

    const onMaxInputChange = (value) => {
        setSliderValues([sliderValues[0], value]);
    };
    useEffect(() => {
        setSliderValues([0, priceMax]);
    }, [priceMax]);

    const [sliderValues, setSliderValues] = useState([0, priceMax]);
    return (
        <Space size={"large"} direction="vertical" style={{justifyContent: "center", margin: "5%", minWidth: 240}}>
            <div>
                <Space style={{
                    display: "flex",
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Title level={4}>Город</Title>
                    <Link onClick={() => {
                        event.setPage(1);
                        event.setSelectedType({});
                        event.setSelectedCity(null);
                        event.setSelectedDate(null);
                        event.setSelectedPrice({});
                        setCity('')
                        setData('')
                    }}>Сброс</Link>



                </Space>
                <Select
                    id="city-select" // Добавляем идентификатор
                    showSearch
                    style={{
                        width: "100%",
                    }}
                    placeholder="Выберите город"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    value={city}
                    onChange={(data) => {
                        setCity(data)
                        event.setSelectedCity(data)
                    }}

                    options={event.cities}
                />

            </div>
            <div>
                <Title level={4}>Категории</Title>
                <List
                    bordered
                    dataSource={event.types}
                    renderItem={(type) => (
                        <List.Item
                            onClick={() => event.setSelectedType(type)}
                            style={{backgroundColor: getBackgroundColor(type), cursor: 'pointer'}}
                        >
                            {type.label}
                        </List.Item>
                    )}
                />
            </div>
            <div>
                <Title level={4}>Даты</Title>
                <ConfigProvider locale={ruRU}>
                    <RangePicker id="date" name= "date" minDate={today} locale={ruRU} onChange={handleDateChange} value={data} />
                </ConfigProvider>
            </div>

            <div>
                <Title level={4}>Цена</Title>

                <Slider
                    range
                    min={1}
                    max={priceMax}
                    onChange={onSliderChange}
                    value={sliderValues}
                />

                <Row>
                    <Space>
                        <InputNumber
                            prefix="от"
                            min={0}
                            valu
                            max={priceMax}
                            style={{
                                margin: '0 16px',
                            }}
                            value={sliderValues[0]}
                            onChange={onMinInputChange}
                        />

                        <InputNumber
                            prefix="до"
                            min={0}
                            max={priceMax}
                            style={{
                                margin: '0 16px',
                            }}
                            value={sliderValues[1]}
                            onChange={onMaxInputChange}
                        />
                    </Space>
                </Row>
            </div>
        </Space>
    )
        ;
});


export default ParametersBar;