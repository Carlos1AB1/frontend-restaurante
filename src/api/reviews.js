import axiosInstance from '../utils/axios';

const reviewsApi = {
    getProductReviews: (productSlug) => {
        return axiosInstance.get('/reviews/reviews/', {
            params: { product: productSlug }
        });
    },

    createReview: (reviewData) => {
        return axiosInstance.post('/reviews/reviews/', reviewData);
    },

    updateReview: (reviewId, reviewData) => {
        return axiosInstance.patch(`/reviews/reviews/${reviewId}/`, reviewData);
    },

    deleteReview: (reviewId) => {
        return axiosInstance.delete(`/reviews/reviews/${reviewId}/`);
    }
};

export default reviewsApi;