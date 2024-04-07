import React from 'react';
import { Carousel } from "antd";
import Ticket from "../../assets/numberTicket.jpg";
import QrImg from "../../assets/QrScan.png";
import Controller from "../../assets/controler.jpg";

const steps = [
    {
        title: 'Варианты контроля',
        description: 'Есть 2 варианта контроля билета: по номеру и с помощью QR-кода',
        cover: (
            <img
                src={Controller}
                alt="Contoller"
                style={{ maxWidth: '100%', maxHeight: '200px', margin: 'auto' }} // Center the image
            />
        ),
    },
    {
        title: 'По номеру билета',
        description: 'Введите в поле номер, указанный в билете, и нажмите "Ввод"',
        cover: (
            <img
                src={Ticket}
                alt="Ticket"
                style={{ maxWidth: '100%', maxHeight: '200px', margin: 'auto' }} // Center the image
            />
        ),
    },
    {
        title: 'По QR-коду',
        description: 'Необходимо предварительно авторизоваться под вашим аккаунтом на сайте, а после отсканировать билет, любым доступным сканером на телефоне, QR-код переведет вас на страницу билета.',
        cover: (
            <img
                src={QrImg}
                alt="QR Code"
                style={{ maxWidth: '100%', maxHeight: '200px', margin: 'auto' }} // Center the image
            />
        ),
    },
];

const Carouselcontroller = () => {
    return (
        <Carousel style={{ margin: '5%', width: '60vw', height: 'auto', backgroundColor:'#f9f0ff', padding:10,borderRadius:20 }} autoplay>
            {steps.map((step, index) => (
                <div key={index} style={{  height: 'auto',  }}>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    {step.cover}
                </div>
            ))}
        </Carousel>
    );
};

export default Carouselcontroller;