window.config = {   
 
    // 172.17.1.16
    // 10.0.1.22

    // 120.133.21.14
    // 113.208.118.62

    url:'http://111.23.140.59:9094/collaProcApp/',                    //长沙环境
    operateUrl: 'http://111.23.140.59:9090/operateApp/',
    iconPath:'http://111.23.140.59:9090/file/pic/trafficType/',       // 图片服务器地址
    mapWaPianPath:'http://111.23.140.59:8086/',   //地图瓦片
    websocketUrl:'ws://111.23.140.59:9970/colla',
    dlUrl: 'http://111.23.140.59:8085/', //迪路
    dlWmsUrl: 'http://111.23.140.59:8080/', //迪路

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