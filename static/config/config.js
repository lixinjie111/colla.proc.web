window.config = {    
    
    //公司测试 外网地址
    // staticUrl: "http://120.133.21.14:9090/", //静态文件路径
    // url:'http://120.133.21.14:9094/collaProcApp/',                  //望京环境 
    // operateUrl: 'http://120.133.21.14:9090/operateApp/',    //运营平台
    // iconPath:'http://120.133.21.14:9090/file/pic/trafficType/',       // 图片服务器地址
    // mapWaPianPath:'http://120.133.21.14:8086/',   //地图瓦片
    // websocketUrl:'ws://120.133.21.14:49996/colla', 
    // dlUrl: 'http://117.114.144.227:8085/', //迪路
    // dlWmsUrl: 'http://117.114.144.227:8080/', //迪路

    //上海正式环境 外网
    staticUrl: "http://116.236.72.204:49090/", //静态文件路径
    url:'http://116.236.72.204:49094/collaProcApp/',  // 交通平台
    operateUrl: 'http://116.236.72.204:49090/operateApp/', //运营平台登陆
    iconPath:'http://116.236.72.204:49090/file/pic/trafficType/',  // 图片服务器地址
    mapWaPianPath:'http://116.236.72.204:48086/',   //地图瓦片
    websocketUrl:'ws://116.236.72.204:49996/colla',
    dlUrl: 'http://116.236.72.204:48085/', //迪路
    dlWmsUrl: 'http://116.236.72.204:48080/', //迪路

    version: "1.0",       // 版本号
}
//地图额外配置项添加
window.defaultMapOption = {
    center: [121.1882114,31.2771320], // 上海 -- gps坐标点
    zoom: 14
}
//路网配置参数
window.dlWmsDefaultOption = {
    url: window.config.dlWmsUrl+'geoserver/shanghai_qcc/wms',
    LAYERS: 'shanghai_qcc:dl_shcsq_wgs84_zc_0708'
}