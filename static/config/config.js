window.config = {   
    //长沙 测试地址
    // staticUrl: "http://111.23.140.59:9090/", //静态文件路径
    // url:'http://111.23.140.59:9094/collaProcApp/',                    //长沙环境
    // operateUrl: 'http://111.23.140.59:9090/operateApp/',
    // iconPath:'http://111.23.140.59:9090/file/pic/trafficType/',       // 图片服务器地址
    // websocketUrl:'ws://111.23.140.59:9970/colla',
    // mapWaPianPath:'http://218.76.44.22:8086/',   //地图瓦片
    // dlUrl: 'http://218.76.44.22:8085/', //迪路
    // dlWmsUrl: 'http://218.76.44.22:48080/', //迪路

    //长沙 正式地址
    staticUrl: "http://218.76.44.22:9090/", //静态文件路径
    url:'http://218.76.44.22:9094/collaProcApp/',                    //长沙环境
    operateUrl: 'http://218.76.44.22:9090/operateApp/',
    iconPath:'http://218.76.44.22:9090/file/pic/trafficType/',       // 图片服务器地址
    websocketUrl:'ws://218.76.44.22:9970/colla',
    mapWaPianPath:'http://218.76.44.22:8086/',   //地图瓦片
    dlUrl: 'http://218.76.44.22:8085/', //迪路
    dlWmsUrl: 'http://218.76.44.22:48080/', //迪路

    version: "1.0",       // 版本号
}
//地图额外配置项添加
window.defaultMapOption = {
    // center: [113.07876,28.255618], // 长沙市中心 -- 高德地图坐标点
    // center: [112.857703,28.20041], // 长沙0920演示 -- 高德地图坐标点
    // center: [112.8522728197584,28.2039102472322], // 长沙0920演示 -- gps坐标点
    // center: [113.00739171981809,28.21220959243717], // 长沙 -- 高德地图坐标点
    center: [113.0130624858725, 28.20888036847823], // 长沙 -- gps坐标点
    zoom: 12
}
//路网配置参数
window.dlWmsDefaultOption = {
    url: window.config.dlWmsUrl+'geoserver/shanghai_qcc/wms',
    LAYERS: 'shanghai_qcc:dl_shcsq_wgs84_zc_0708'
}