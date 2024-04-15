const addTicket = async (event, hall, entranceOptionPriceId, row, seat) => {
    try {
        // Создаем объект билета
        const ticketToAdd = {
            eventId: event?.event?.id || null,
            hall: hall?.hall || null,
            entranceOptionPriceId: entranceOptionPriceId || null,
            row: row || null,
            seat: seat || null
        };

        // Проверяем, что хотя бы одно из полей не является null
        if (Object.values(ticketToAdd).some(value => value !== null)) {
            // Добавляем билет в список билетов
            hall.setTicket([...hall.ticket, ticketToAdd]);
            console.log(hall.ticket);
            return true;
        } else {
            console.log('Один или несколько входных параметров равны null. Билет не был добавлен.');
            return false;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
};

export default addTicket;
