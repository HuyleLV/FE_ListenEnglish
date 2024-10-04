import axios from "axios";

export const getUserListening = async (token) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/listenings`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response?.data;
    } catch (error) {
        console.error(error);
    }
}
export const createUserListening = async (data, token) => {
    try {
        let count = 0;
        const text = data.text
            .toLowerCase()
            .replace(/[!@#$%^&*(),.?":{}|<>“”]/g, '')
            .split(' ');
        const lyric = data.lyric
            .toLowerCase()
            .replace(/[!@#$%^&*(),.?":{}|<>“”]/g, '')
            .split(' ');
        lyric.map(word => {
            text.includes(word) && count++;
        });
        const point = Math.round((count / lyric.length) * 100);
        await axios.post(
            `${process.env.REACT_APP_API_URL}/listening`,
            {...data, point},
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
    } catch (e) {
        console.log(e)
    }
}
