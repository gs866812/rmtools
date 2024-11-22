import axios from "axios";



const axiosSecure = axios.create({
    baseURL: 'https://api.rm.toolscare.net',
});

const useAxiosSecure = () => {

    return axiosSecure;
};

export default useAxiosSecure;