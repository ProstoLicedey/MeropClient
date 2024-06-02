
const removeTicket = (entranceOptionPriceId, event, hall) => {
    const index = hall.ticket.findIndex(
        (ticket) =>
            ticket.eventId === event.event.id &&
            ticket.entranceOptionPriceId === entranceOptionPriceId
    );

    if (index !== -1) {
        const updatedTickets = [...hall.ticket];
        updatedTickets.splice(index, 1);
        hall.setTicket(updatedTickets);
    }
};


export default removeTicket;