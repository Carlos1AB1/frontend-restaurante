import axiosInstance from '../utils/axios';

const chatbotApi = {
    sendMessage: (message) => {
        return axiosInstance.post('/chatbot/ask/', { message });
    }
};

export default chatbotApi;