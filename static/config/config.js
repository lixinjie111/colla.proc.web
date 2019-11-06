window.config = {  

    //雄安 外网地址
    staticUrl: "http://144.7.122.89:9090/", //静态文件路径
    url:'http://144.7.122.89:9094/collaProcApp/',                  //望京环境 
    operateUrl: 'http://144.7.122.89:9090/operateApp/', //运营平台
    iconPath:'http://144.7.122.89:9090/file/pic/trafficType/',       // 图片服务器地址
    websocketUrl:'ws://144.7.122.89:9995/colla', 
    mapWaPianPath:'http://144.7.127.19:8086/',   //地图瓦片
    dlUrl: 'http://144.7.127.19:8085/', //迪路
    dlWmsUrl: 'http://144.7.127.19:8080/', //迪路

    version: 1.0,       // 版本号
}
//地图额外配置项添加
window.defaultMapOption = {
    // center: [115.912987,39.049487], // 雄安雄安市民服务中心 -- 高德地图坐标点
    center: [115.90861899966421,39.05021886389959], // 雄安雄安市民服务中心 -- gps坐标点
    zoom: 14
}
//路网配置参数
window.dlWmsDefaultOption = {
    url: window.config.dlWmsUrl+'geoserver/shanghai_qcc/wms',
    LAYERS: 'shanghai_qcc:dl_shcsq_wgs84_zc_0708'
}