import axios from 'axios';

const API_URL = 'http://localhost:3000/location/auth';

const fetchLocations = async () =>{
    try{
        const response = await axios.get(`${API_URL}/locations`,{withCredentials:true})
        return response.data
    }catch(error){
        throw error.response?.data || "Error fetching all locations"
    }
}

const fetchLocation = async (location_id) =>{
    try{
        const response = await axios.get(`${API_URL}/locations${location_id}`,{withCredentials:true})
        return response.data
    }catch(error){
        throw error.response?.data || "Error fetching one loaction"
    }
}

export {fetchLocations,fetchLocation}
