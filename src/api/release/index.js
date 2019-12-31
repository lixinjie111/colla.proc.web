// import axios from 'axios';
import {HTTPURL} from '../requestUrl';


export const statisticsTask = params => { return axios.post(`${HTTPURL}event/task/statisticsTask`, params).then(res => res.data); };

export const queryAll = params => { return axios.post(`${HTTPURL}event/info/queryAll`, params).then(res => res.data); };

export const findEffectiveList = params => { return axios.post(`${HTTPURL}event/task/findEffectiveList`, params).then(res => res.data); };

export const queryRsu = params => { return axios.post(`${HTTPURL}common/queryRsu`, params).then(res => res.data); };

export const queryRoadSide = params => { return axios.post(`${HTTPURL}common/queryRoadSide`, params).then(res => res.data); };

export const queryLight = params => { return axios.post(`${HTTPURL}common/queryLight`, params).then(res => res.data); };


