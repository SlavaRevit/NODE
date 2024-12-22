import request from './request.mjs'
import response from './response.mjs'

function customRequest(url, data) {
	request.send(url, data);
	return response.read();
}

const respData = customRequest('https://google.com', 'hello');