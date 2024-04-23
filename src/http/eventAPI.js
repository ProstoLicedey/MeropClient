import {$authHost, $host} from "./index";

export const createType = async (type) => {
    const {data} = await $authHost.post('/type', type)
    return data
}

export const fetchTypes = async () => {
    const {data} = await $host.get('/api/type')
    return data
}
export const fetchCity = async () => {
    const {data} = await $host.get('/api/type/city')
    return data
}
export const fetchRating = async () => {
    const {data} = await $host.get('/api/type/rating')
    return data
}

export const createEvent = async (event, userId, file, option, type) => {

    try {
        const formData = new FormData();
        formData.append('title', event.title);
        formData.append('description', event.description);
        formData.append('dateTime', event.dateTime);
        formData.append('typeId', event.typeId);
        formData.append('ageRatingId', event.ageRatingId);
        formData.append('userId', userId);
        formData.append('img', file);
        formData.append('type', type);
        const optionString = JSON.stringify(option.entrances);

        // Добавляем JSON-строку в FormData
        formData.append('option', optionString);

        const {data} = await $host.post('api/event', formData);

        return data;
    } catch (error) {
        // Handle error
        console.error('Error creating event:', error);
        throw error;
    }
}
export const updateEvent = async (event, userId, file, option, type,  id) => {

    try {
        const img = file.url? file.url : file
        const formData = new FormData();
        formData.append('title', event.title);
        formData.append('description', event.description);
        formData.append('dateTime', event.dateTime);
        formData.append('typeId', event.typeId);
        formData.append('ageRatingId', event.ageRatingId);
        formData.append('userId', userId);
        formData.append('img', img);
        formData.append('type', type);
        const optionString = JSON.stringify(option.entrances);

        // Добавляем JSON-строку в FormData
        formData.append('option', optionString);

        const {data} = await $host.put('api/event/' + id, formData);

        return data;
    } catch (error) {
        // Handle error
        console.error('Error creating event:', error);
        throw error;
    }
}


export const fetchEvent = async (typeId, page, price, date, serchTitle, city) => {
    let dateMin = null;
    let dateMax = null;
    let priceMin = null;
    let priceMax = null;

    if (date && date.length >= 2) {
        dateMin = date[0].$d;
        dateMax = date[1].$d;
    }
    if (price && price.length >= 2) { // исправлено
        priceMin = price[0];
        priceMax = price[1];
    }

    const {data} = await $host.get('api/event', {
        params: {
            typeId, page, priceMin, priceMax, dateMin, dateMax, serchTitle, city
        }
    });

    return data;
}
export const fetchOneEvent = async (id) => {
    const {data} = await $host.get('api/event/' + id)
    return data
}

export const getEventForUpdate = async (id, userId) => {
    const {data} = await $host.get('/api/event/update/'  + id,{params: {
            userId
        }})
    return data
}


export  const  deleteEvent = async (id) =>{
    const  {data} = await $host.delete('api/event/' , {
        params: {
            id
        }
    });
    return data
}