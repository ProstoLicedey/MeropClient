import React from 'react';
import ReactPDF, {Page, Text, View, Document, StyleSheet, Font, Image, Line, Svg} from '@react-pdf/renderer';
import Hall from "../../pages/event/hall";
import LogoTicket from "../../assets/LogoTicket.png";
import {adminRoutes} from "../../routes";
import {Navigate, Route} from "react-router-dom";
import EventItem from "../../components/home/EventItem";
import moment from "moment/moment";

Font.register({
    family: "Robot",
    src:
        "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
});
Font.register({
    family: "RobotBold",
    src:
        "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf"
});
// Create styles

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
        fontFamily: "Robot",
    },
    page: {
        flexDirection: "row",
        backgroundColor: "#E4E4E4",
        fontFamily: "Robot",
    },
    section: {
        margin: 10,
        padding: 10,
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
    },
    text: {
        fontFamily: "Robot",
    },
    line: {
        marginBottom: 20,
        borderBottom: "1pt solid #391085",
    },
    logo: {
        width: 240,
        height: 62.5,
        marginTop: 40,
        marginLeft:-95,
        marginBottom: 20,
        alignSelf: "center",
    },
    textBold: {
        fontFamily: "RobotBold",
    }
});

const Ticket = ({order}) => {
     return (
        <Document>
            {order.map(ticket =>

            <Page orientation="landscape" size="A4" style={styles.page} wrap={false}>
                <View style={styles.section}>
                    <Text style={{fontSize: 28}}>{ticket.event.title}</Text>
                    <Line style={styles.line}/>
                    <Text style={{fontSize: 14, color:'gray', flex: 1}}>
                        {" Адрес: "}
                        <Text style={{ color: 'black'}}>
                            {ticket.entranceOptionPrice.entranceOption.entrance.name} ({ticket.entranceOptionPrice.entranceOption.entrance.address})
                        </Text>
                    </Text>
                    <Text style={{fontSize: 14, color:'gray', flex: 1}}>
                        {"Дата и время: "}
                        <Text style={{ color: 'black'}}>
                            {moment(ticket.event.dateTime).locale('ru').format('DD MMMM HH:mm ddd ')}
                        </Text>
                    </Text>
                    <Text style={{fontSize: 14, color:'gray', flex: 1}}>
                        {"Стоимость: "}
                        <Text style={{ color: 'black'}}>
                            {ticket.entranceOptionPrice.price} руб.
                        </Text>
                    </Text>

                    <Text style={{fontSize: 14, color:'gray', flex: 1}}>
                        Категория:
                        <Text style={{ color: 'black'}}>
                            {ticket.entranceOptionPrice.entranceOption.name}
                        </Text>
                    </Text>
                    <Text style={{fontSize: 12, flex: 1, textAlign: 'center'}}>
                        {`Электронный билет \n Номер: ${ticket.number} \n Дата покупки: ${moment(ticket.createdAt).format('DD.MM.YYYY HH:mm ')} \n Выпущен на Merop`}
                    </Text>

                </View>
                <View style={styles.section}>
                    <View style={styles.section}>


                        <Text style={styles.textBold}>Как работает билет</Text>
                        <Text style={{fontSize: 12, flex: 1}}>По билету можно пройти только один раз, его нельзя
                            копировать и перепродавать. Не выкладывайте билет в соцсети: другой человек может
                            использовать штрихкод и пройти вместо вас
                        </Text>
                        <Text style={styles.textBold}>Как вернуть</Text>
                        <Text style={{
                            fontSize: 12,
                            flex: 1
                        }}>{"Если событие отменят, заменят или перенесут или у вас просто не получается на него попасть пишите на почту \n MeropsRoot@hotmail.com"}
                        </Text>
                        <Text style={styles.textBold}>Участники мероприятия обязаны</Text>
                        <Text style={{fontSize: 12}}>- соблюдать правила поведения в общественных местах;</Text>
                        <Text style={{fontSize: 12}}>- занимать места согласно купленному билету;</Text>
                        <Text style={{fontSize: 12}}>- сохранять билет до конца мероприятия и предъявлять по требованию
                            администрации и сотрудников службы охраны.</Text>

                        <Image
                            cache={false}
                            src={LogoTicket}
                            style={styles.logo}
                        />

                        <Image
                            cache={false}
                            src={' https://api.qrserver.com/v1/create-qr-code/?size=150x150&bgcolor=e4e4e4&data=' + process.env.REACT_APP_CLIENT_URL  + 'ticket/' + ticket.number}
                            style={{width:62.5, height:62.5, float: "right", marginLeft:260, marginTop:-82}}
                        />

                    </View>
                </View>
            </Page>
    )}
        </Document>
    )
};

export default Ticket;