// import axios from 'axios';
import {HTTPURL} from '../requestUrl';


export const taskQueryPage = params => { return axios.post(`${HTTPURL}event/task/queryPage`, params).then(res => res.data); };

export const queryDictionary = params => { return axios.post(`${HTTPURL}common/queryDictionary`, params).then(res => res.data); };

export const getEventDetail = params => { return axios.post(`${HTTPURL}event/task/getEventDetail`, params).then(res => res.data); };

