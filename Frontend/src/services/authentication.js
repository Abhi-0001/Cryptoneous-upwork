import axios from "axios";

export async function signin({ address }) {
  try {
    const res = await axios.post(`${BASE_URL}/${role}/${logOrSign}`, {
      address,
    });
    console.log(res.data);
    return { message: res.data.message, ...res.data };
  } catch (err) {
    console.log(err.response.data.message);
    return {
      status: err.response.data.status,
      message: err.response.data.message,
    };
  }
}
export async function signup({ address }) {
  try {
    const res = await axios.post(`${BASE_URL}/${role}/${logOrSign}`, {
      address,
    });
    console.log(res.data);
    return { message: res.data.message, ...res.data };
  } catch (err) {
    console.log(err.response.data.message);
    return {
      status: err.response.data.status,
      message: err.response.data.message,
    };
  }
}
