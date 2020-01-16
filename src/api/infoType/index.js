// import axios from 'axios';
import {HTTPURL} from '../requestUrl';


export const infoQueryPage = params => { return axios.post(`${HTTPURL}event/info/queryPage`, params).then(res => res.data); };

export const queryDictionary = params => { return axios.post(`${HTTPURL}common/queryDictionary`, params).then(res => res.data); };

export const deleteIds = params => { return axios.post(`${HTTPURL}event/info/delete/ids`, params).then(res => res.data); };

export const uploadPicNew = (params,config) => { return axios.post(`${HTTPURL}event/info/uploadPicNew`, params,config).then(res => res.data); };

export const infoSave = params => { return axios.post(`${HTTPURL}event/info/save`, params).then(res => res.data); };

export const infoUpdate = params => { return axios.post(`${HTTPURL}event/info/update`, params).then(res => res.data); };


