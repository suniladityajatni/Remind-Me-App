import axios from 'axios';

const axiosInstance=axios.create({
    baseURL:"https://remind-meapp.herokuapp.com/"
})
export default axiosInstance;