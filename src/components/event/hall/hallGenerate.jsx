import React, {useContext, useEffect, useState} from 'react';
import {Button, message, Space, Tooltip, Typography} from 'antd';
import Title from 'antd/es/typography/Title';
import {TransformWrapper, TransformComponent} from 'react-zoom-pan-pinch';
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {Context} from "../../../index";
import {BOOKING_ROUTE, CREATOR_ROUTE} from "../../../utils/consts";
import {useNavigate, useParams} from "react-router-dom";

const {Text, Link} = Typography;

const color = [
    '#0958d9',
    '#ff7a45',
    '#73d13d',
    '#c41d7f',
    '#874d00',
    '#ffa940',
    '#36cfc9',
    '#ffec3d',
    '#36cfc9',
    '#ff7a45',
    '#ffc53d',
    '#cf1322',
    '#5b8c00',
    '#ff4d4f',
    '#bae637',
];

const HallGenerate = ({numberRows, numberSeatsInRow, hallOptionPrice, tickets}) => {
    const {id} = useParams();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [sum, setSum] = useState(0);
    const {hall} = useContext(Context);
    const navigate = useNavigate()

    const toggleSeatSelection = (rowIndex, seatIndex) => {
        const seat = `${rowIndex}-${seatIndex}`;
        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seat));
        } else {
            if (selectedSeats.length < 5) {
                setSelectedSeats([...selectedSeats, seat]);
            } else {
                message.warning('Можно выбрать не более 5 мест');
            }
        }
    };

    // Функция для расчета суммы выбранных билетов
    const calculateTotalPrice = () => {
        let totalPrice = 0;
        selectedSeats.forEach(seat => {
            const [rowIndex, seatIndex] = seat.split('-');
            hallOptionPrice.forEach(HOP => {
                if (
                    HOP.hallOption.seatStart <= seatIndex &&
                    HOP.hallOption.seatFinish >= seatIndex &&
                    HOP.hallOption.rowStart <= rowIndex &&
                    HOP.hallOption.rowFinish >= rowIndex
                ) {
                    totalPrice += HOP.price;
                }
            });
        });
        return totalPrice;
    };

    // Обновляем сумму при изменении выбранных мест
    useEffect(() => {
        setSum(calculateTotalPrice());
    }, [selectedSeats]);

    const generateRow = (rowIndex) => {
        const row = [];

        row.push(
            <Title
                style={{margin: 6, width: 20, whiteSpace: 'nowrap', verticalAlign: 'top'}}
                level={4}
                key={`row-${rowIndex}`}
            >
                {rowIndex}
            </Title>
        );
        for (let j = 1; j < numberSeatsInRow + 1; j++) {
            const isSelected = selectedSeats.includes(`${rowIndex}-${j}`);
            let tool, thisColor, check = false;
            tickets.forEach((ticket) => {
                if (ticket.seat == j && ticket.row == rowIndex) {
                    check = true
                    return;
                }
            });
            hallOptionPrice.forEach((HOP, index) => {
                if (
                    HOP.hallOption.seatStart <= j &&
                    HOP.hallOption.seatFinish >= j &&
                    HOP.hallOption.rowStart <= rowIndex &&
                    HOP.hallOption.rowFinish >= rowIndex
                ) {
                    tool = HOP.price;
                    thisColor = color[index];
                    return;
                }
            });


            row.push(
                <Tooltip title={check ? 'Место занято' : `${tool} ₽, ${rowIndex} ряд, ${j} место`}>
                    <Button
                        disabled={check}
                        key={`${rowIndex + 1}-${j + 1}`}
                        type="primary"
                        shape={isSelected ? "circle" : "default"}
                        style={{
                            verticalAlign: 'top',
                            margin: 3,
                            backgroundColor: check ? 'null' : thisColor,
                        }}
                        onClick={() => toggleSeatSelection(rowIndex, j)}
                    >{isSelected ? <CheckOutlined/> : ''}</Button>
                </Tooltip>
            );
        }
        return (
            <div key={`row-${rowIndex}`} style={{display: 'flex', margin: 3}}>
                {row}
            </div>
        );
    };

    const generateHall = () => {
        const hallRows = [];
        for (let i = 1; i < numberRows + 1; i++) {
            hallRows.push(generateRow(i));
        }
        return hallRows;
    };

    return (
        <div
            style={{
                margin: '2%',
                display: 'flex',
                flexGrow: 1,
                alignItems: 'center',
                position: 'relative',
                backgroundColor: '#f0f0f0',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
            }}
        >
            <Space
                direction="horizontal"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    padding: '10px',
                    background: '#f0f0f0',
                }}
            >
                {hallOptionPrice.map((HOP, index) => (
                    <React.Fragment key={index}>
                        <div
                            style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: color[index],
                            }}
                        />
                        <Title level={5}> {HOP.price}₽ </Title>
                    </React.Fragment>
                ))}
            </Space>
            <TransformWrapper
                minPositionX={-5000}
                maxPositionX={5000}
                minPositionY={-5000}
                maxPositionY={5000}
                minScale={0.5}
                maxScale={3}
            >
                {({zoomIn, zoomOut, resetTransform, ...rest}) => (

                    <React.Fragment>
                        <TransformComponent innerRef={rest.ref} wrapperStyle={{width: '100%', height: '100%',}}>
                            <div style={{width: '100%', height: '100%'}}>

                                <svg
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 100 20"
                                    preserveAspectRatio="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <defs>
                                        <filter id="dropshadow" height="130%">
                                            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                                            <feOffset dx="2" dy="2" result="offsetblur"/>
                                            <feComponentTransfer>
                                                <feFuncA type="linear" slope="0.2"/>
                                            </feComponentTransfer>
                                            <feMerge>
                                                <feMergeNode/>
                                                <feMergeNode in="SourceGraphic"/>
                                            </feMerge>
                                        </filter>
                                    </defs>
                                    <path
                                        d="M0,10 Q50,0 100,10"
                                        fill="none"
                                        stroke="#22075e"
                                        strokeWidth="0.5"
                                        filter="url(#dropshadow)"
                                    />
                                </svg>
                                {generateHall()}
                            </div>
                        </TransformComponent>
                    </React.Fragment>
                )}
            </TransformWrapper>

            {selectedSeats.length > 0 && (
                <Space
                    visible
                    direction="horizontal"
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 5,
                        zIndex: 1,
                        padding: '10px',
                        background: '#f0f0f0',

                    }}
                >
                    <Title
                        level={4}>{selectedSeats.length} {selectedSeats.length === 1 ? 'билет' : selectedSeats.length > 1 && selectedSeats.length < 5 ? 'билета' : 'билетов'}: {sum} ₽</Title>
                    <Button
                        type="primary"
                        shape="round"
                        size="large"
                        style={{
                            backgroundColor: '#722ed1',
                            fontSize: '1.5em',
                            padding: '12px 20px',
                            display: 'flex', // добавляем flex-контейнер
                            alignItems: 'center', // выравниваем по центру по вертикали
                            justifyContent: 'center' // выравниваем по центру по горизонтали
                        }}
                        onClick={() => {

                            hall.setSelectedSeats(selectedSeats);
                            navigate(BOOKING_ROUTE +'/' +id);
                        }}
                    >
                        Далее
                    </Button>
                </Space>)}
        </div>
    );
};

export default HallGenerate;
