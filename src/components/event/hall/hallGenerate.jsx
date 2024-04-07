import React, { useState } from 'react';
import { Button } from 'antd';
import Title from 'antd/es/typography/Title';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const HallGenerate = ({ numberRows, numberSeatsInRow, hallOptionPrice, style }) => {
    const [fontSize, setFontSize] = useState(20);

    // const increaseFontSize = () => {
    //     setFontSize((prevSize) => prevSi ze + 1);
    // };
    //
    // const decreaseFontSize = () => {
    //     setFontSize((prevSize) => prevSize - 1);
    // };

    const generateRow = (rowIndex) => {
        const row = [];
        row.push(
            <Title
                style={{ margin: 6, width: 20, whiteSpace: 'nowrap', verticalAlign: 'top' }}
                level={4}
                key={`row-${rowIndex}`}
            >
                {rowIndex + 1}
            </Title>
        );
        for (let j = 0; j < numberSeatsInRow; j++) {
            row.push(
                <Button key={`${rowIndex}-${j}`} type="primary" style={{ verticalAlign: 'top', margin: 3 }} />
            );
        }
        return (
            <div key={`space-${rowIndex}`} style={{ display: 'flex', margin: 3 }}>
                {row}
            </div>
        );
    };

    const generateHall = () => {
        const hallRows = [];
        for (let i = 0; i < numberRows; i++) {
            hallRows.push(generateRow(i));
        }
        return hallRows;
    };

    return (
        <div
            style={{
                ...style,
                margin: '2%',
                display: 'flex',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                minHeight: 500,
                position: 'relative',
                backgroundColor: '#f0f0f0',
                justifyContent: 'center',
                
            }}
        >
            <TransformWrapper
                minPositionX={5000}
                minScale={0.5}
                maxScale={3}
                style={{ width: '100%', height: '100%' }}
            >
                <TransformComponent>
                    <div>
                        {/*
                <div>
                    <Button onClick={increaseFontSize}>Increase Font Size</Button>
                    <Button onClick={decreaseFontSize}>Decrease Font Size</Button>
                </div>
                */}
                        {generateHall()}
                    </div>
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
};

export default HallGenerate