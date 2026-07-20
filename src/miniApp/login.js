import axios from 'axios';
import { URLSearchParams } from 'url';
import { setupEnv } from '../utils/helpers.js';

export async function LoginOnWebsite(username, password) {
  try {
    console.log("Asking FlareSolverr to login...");

    // format data to be sent out
    const postData = new URLSearchParams({
      username: username,
      password: password,
      captcha: "",
    }).toString();

    // send request to FlareSloverr instance
    const response = await axios.post('http://127.0.0.1:8191/v1', {
      cmd: 'request.post',
      url: process.env.BASE_URL + '/api/v1/auth/login',
      postData: postData,
      maxTimeout: 60000
    });

    const data = response.data;

    // send out if successfully completed the request
    if (data.status === 'ok') {
      console.log("FlareSolverr successfully executed the login request.");
      
      // extract cookies after logging in
      const cookiesArray = data.solution.cookies;
      
      const cookieHeaderString = cookiesArray
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join('; ');

      // need to use this userAgent in future requests
      const userAgent = data.solution.userAgent;
      
      console.log("Successfully extracted cookies!");

      return {
        cookies: cookieHeaderString,
        userAgent: userAgent
      };
    } else {
      throw new Error(`FlareSolverr failed: ${data.message}`);
    }
    
  } catch (err) {
    console.error("Couldn't log in into account via FlareSolverr: ", err.message);
    throw new Error("Error while logging into account: " + err.message);
  }
}