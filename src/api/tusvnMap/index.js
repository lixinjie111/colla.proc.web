// import axios from 'axios';
import {HTTPURL,DLURL} from '../requestUrl';


export const taskSave = params => { return axios.post(`${HTTPURL}event/task/save`, params).then(res => res.data); };

export const taskUpdate = params => { return axios.post(`${HTTPURL}event/task/update`, params).then(res => res.data); };

export const taskCancel = params => { return axios.post(`${HTTPURL}event/task/cancel`, params).then(res => res.data); };

export const queryDictionary = params => { return axios.post(`${HTTPURL}common/queryDictionary`, params).then(res => res.data); };

export const findDetail = params => { return axios.post(`${HTTPURL}event/task/findDetail`, params).then(res => res.data); };

export const Coordinate = (params,config) => { return axios.post(`${DLURL}route/getRoadCoornatesByCoordinate.do`, params,config).then(res => res.data); };


