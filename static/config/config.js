window.config = {   

    url:'http://218.76.44.22:9094/collaProcApp/',                    //长沙环境
    operateUrl: 'http://218.76.44.22:9090/operateApp/',
    iconPath:'http://218.76.44.22:9090/file/pic/trafficType/',       // 图片服务器地址
    mapWaPianPath:'http://218.76.44.22:8086/',   //地图瓦片
    websocketUrl:'ws://218.76.44.22:9970/colla',
    dlUrl: 'http://218.76.44.22:8085/', //迪路
    dlWmsUrl: 'http://218.76.44.22:8080/', //迪路

    version: 1.0,       // 版本号
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