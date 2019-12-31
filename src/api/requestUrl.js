let HTTPURL = '';
let OPERATEURL = '';
let DLURL = '';
let TESTHTTPURL = '';



if(process.env.NODE_ENV == 'development') { // 开发环境
    HTTPURL = window.config.url;
    OPERATEURL = window.config.operateUrl;
    DLURL = window.config.dlUrl;
    // DLURL = '/apiUrl/';
    TESTHTTPURL = window.config.testUrl;
   
}else {
    HTTPURL = window.config.url;
    OPERATEURL = window.config.operateUrl;
    DLURL = window.config.dlUrl;
    // DLURL = '/apiUrl/';
    TESTHTTPURL = window.config.testUrl;
   
}

export {
    HTTPURL,
    OPERATEURL,
	DLURL,
    TESTHTTPURL

}
