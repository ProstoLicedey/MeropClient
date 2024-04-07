import React from 'react';
import {Row, Typography} from 'antd';
import {observer} from "mobx-react-lite";
import Title from "antd/es/typography/Title";
import MapIcon from "../../assets/icon/MapIcon";

const { Text, Link } = Typography;

const AddressLink = ({address, name, styleIcon, styleTitle, level, underline}) => {
    const handleOpenMaps = () => {
        const mapsUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(address)}`;
        window.open(mapsUrl, '_blank');
    };

    return (
        <Row>
            <MapIcon style={styleIcon}/>
        <Title level={level} underline={underline} onClick={handleOpenMaps} style={styleTitle}>
            {name}
        </Title>
        </Row>
    );
};

export default AddressLink;