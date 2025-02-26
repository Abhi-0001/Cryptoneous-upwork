import axios from "axios";

export async function signInUp({ address }) {
  try {
    // console.log(address, role, logOrSign);
    const res = await axios.post(`${BASE_URL}/user/signin`, {
      address,
    });
    console.log(res);
    return { message: res.data.message, ...res.data };
  } catch (err) {
    console.log(err.response.data.message);
    return {
      status: err.response.data.status,
      message: err.response.data.message,
    };
  }
}
