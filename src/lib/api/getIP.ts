import axios from "axios";

export default async function getIP() {
    const response = await axios.get('https://api.ipify.org?format=json');
    console.log("IP Address: ");

    console.log(response)
    return response.data.ip;
}