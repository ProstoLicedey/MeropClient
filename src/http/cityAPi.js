import axios from 'axios';

export const getCityDaData = async (inputValue) => {
    try {
        const response = await axios.post(
            'http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
            {
                query: inputValue,
                locations: [{ country: 'Россия' }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Token 7941220a9d9c4e3926f66768d4840da5f7ec3537'
                }
            }
        );

        // Use a set to exclude duplicates
        const citySet = new Set();
        const filteredSuggestions = response.data.suggestions.reduce((acc, city) => {
            if (!citySet.has(city.data.city)) {
                citySet.add(city.data.city);
                acc.push({ label: city.data.city, value: city.data.city_fias_id });
            }
            return acc;
        }, []);

        return filteredSuggestions;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
