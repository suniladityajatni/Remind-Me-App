import axios from 'axios';

const axiosInstance=axios.create({
    baseURL:"http://localhost:9000/"
    //https://remind-meapp.herokuapp.com/
})
export default axiosInstance;