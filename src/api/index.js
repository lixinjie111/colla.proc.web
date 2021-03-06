// import axios from 'axios'

// import router from '../router'
// import queryString from 'querystring';

import store from '@/store/index.js'

let http = axios.create({
    baseURL: window.config.url,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        // 'Content-Type': 'application/x-www-form-urlencoded'
        // ,
        // 'Content-Type': 'application/x-www-urlencoded;charset=UTF-8',
        // 'Access-Control-Allow-Origin': '*'
    },
    responseType: 'json',
    // ,"Access-Control-Allow-Methods":"PUT,POST,GET,DELETE,OPTIONS"
    transformResponse: [function(data) { //后端发送过来的数据
        // console.log('transformResponse' + data);
        return data;
    }],
    transformRequest: [function(data) {
        // console.log('transformRequest  data : ' + data);

        return data;
        // let newData = '';
        // for (let k in data) {
        //     if (data.hasOwnProperty(k) === true) {
        //         newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
        //     }
        // }
        // newData = newData.slice(0, newData.length - 1);
        // console.log('transformRequest  newData : ' + newData);
        // return newData;
    }]
});
function cancelRequest(){
    sourceArr.forEach(item=>{
        if(typeof item ==='function'){
            item('终止请求')  //取消上一次请求啦
        }
    });
    sourceArr = [];
}

function apiAxios(method, url, params, response, err = function(){} ,type) {

    params = JSON.stringify(params);
    let headers = {
        'Content-Type': 'application/json;charset=UTF-8'
    };
    if(type && type=='login'){
        axios.defaults.baseURL = window.config.operateUrl;
    }else {
        axios.defaults.baseURL = window.config.url;
    }
    url = axios.defaults.baseURL + url;
    http({
        method: method,
        headers: headers,
        url: url,
        data: method === 'POST' || method === 'PUT' ? params : null,
        params: method === 'GET' || method === 'DELETE' ? params : null,
        cancelToken: new axios.CancelToken(function executor(c) {
            let CancelToken = axios.CancelToken;
            let source = CancelToken.source();
            source = c;
            sourceArr.push(source);
        })
    }).then(function(res) {
         // console.log('success !!! ------------- ' + res.status);

        response(res);       

    }).catch(function(err) {
        if (axios.isCancel(err)) {
            console.log("请求被取消"+err); //请求如果被取消，这里是返回取消的message
        } else {
            window.vm.$message({
                type: 'error',
                duration: '1500',
                message: '网络异常,请稍候重试!',
                showClose: true
            });
        }
        if(typeof err == 'function') {
            err();
        }
        // console.log(err.response);
        // console.log('fail !!! --------------- ' + err);
        // if(res.response == undefined){
        //     this.$router.push({path:'login'})
        //     return;
        // };
        // response(err);
    });
}

/**
 * 请求超时，停止loading
 */
function requestOverTime(){

    let timer = setTimeout(() => {
        if(store.state.action.isLoading){
            store.dispatch('showPrompt','请求超时！');
            store.dispatch('hideLoading');
        }
        clearTimeout(timer);
        timer = null;
    }, 5000);
}

function downloadFile(url,params){
    axios.post(window.config.url + url, params, {
        responseType: 'blob'
      }).then(res => {

        // console.log('res ----downloadFile-------- ' + res + ' ----------- : ' + JSON.stringify(res))

        if (res.data) {
          if ('msSaveBlob' in navigator) { // 对IE和Edge的兼容
            window.navigator.msSaveBlob(res.data, decodeURI(res.headers['content-disposition'].split('filename=')[1]))
          } else {
            let blob = res.data

            // console.log('res.data ----------- ' + JSON.stringify(res))

            let a = document.createElement('a');
            a.setAttribute('id','exportLog');
            a.style.display = 'none'

            // let a = document.getElementById('exportLog')
            let url = window.URL.createObjectURL(blob)

            let filename = decodeURI(res.headers['content-disposition'].split('filename=')[1])
            // let filename = 'car_' + (new Date()).getTime() + '.txt';
            // let filename = 'filename.txt';

            var evt = document.createEvent('HTMLEvents') // 对firefox的兼容
            evt.initEvent('click', false, false) // 对firefox的兼容
            a.href = url
            a.download = filename
            a.dispatchEvent(evt) // 对firefox的兼容
            a.click()
            window.URL.revokeObjectURL(url)
          }
        }
      })

}

export default {
    get: function(url, params, response, err, type) {
        return apiAxios('GET', url, params, response, err, type);
    },

    // post: function(url, params, response,isLoading=true,type='normal') {
    //     return apiAxios('POST', url+"?token="+token, params, response,isLoading,type);
    // },
    post: function(url, params, response, err, type) {
        return apiAxios('POST', url, params, response, err, type);
    },
    put: function(url, params, response, err, type) {
        return apiAxios('PUT', url, params, response, err, type);
    },
    delete: function(url, params, response, err, type) {
        return apiAxios('DELETE', url, params, response, err, type);
    } ,
    download: function(url,params){
        console.log('download ----------------');
        // return downLoadApiAxios222(url,params);
        // return downLoadApiAxios(url,params);
        return downloadFile(url,params);
    },
    cancelRequest:function(){
        return cancelRequest();
    },
}
