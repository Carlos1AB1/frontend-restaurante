import axiosInstance from '../utils/axios';

const contactApi = {
    sendMessage: (messageData) => {
        return axiosInstance.post('/contact/send-message/', messageData);
    }
};

export default contactApi;