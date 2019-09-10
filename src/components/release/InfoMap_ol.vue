<template>
	<div :class="isPointerIco ? 'yk-pointer-ico' : 'yk-pointer-normal'">
		<tusvn-map ref="refTusvnMap" style="height: 998px;" class="ref-map" targetId="ddd" overlayContainerId="ccc" :isMasker='false' :isCircle='false' @MapClick="mapClick" @ExtentChange="extentChange" @ViewLevelChange="viewLevelChange" @MapInitComplete='mapInitComplete' @setPointer='setPointer' @PublishInfo='publishInfo' @UpdateInfo='updateInfo' @DestroyInfo='destroyInfo' @TemporaryClearPubMsg='temporaryClearPubMsg($event)'>

		</tusvn-map>
		<!--   -->
	</div>
</template>
<script>
	import TusvnMap from '@/common/TusvnMap/TusvnMap.vue';
	import TDate from '@/common/date.js'

	export default {
		name: 'InfoMapOL',
		components: {
			TusvnMap
		},
		props: ['msgTypeInfo', 'mapHeight'],
		data() {
			return {
				mapInitOk: false,
				mapLayer: {
					tabLayer: "TabLayer",
					rsuIds: [],
					roadsideUniIds: [],
					trafficSignalIds: [],
					message: 'MessageLayer', // 发布信息 图层
					messageBg: 'MessageBgLayer', // 信息的背景图片 图层
				},
				mapMarker: {

					rsu: false, // rsu
					rsuList: [],

					roadsideUnit: false, // 路侧单元
					roadsideUnitList: [],

					trafficSignal: false,
					trafficSignalList: [], // 交通信号灯

					obstacleList: [], // 障碍物
					goodsDropList: [], // 货物散落
					roadWorksList: [], // 道路施工
					msgList: [], // 障碍物 + 货物散落 + 道路施工
				},
				mapLevel: {
					value: 10,
				},
				iconPath: window.config.iconPath,
				trafficInfo: {
					id: '',
					title: '信息发布',
					isEdit: false,
					eventName: '',
					eventType: '',
					taskCode: '',
					longitude: '',
					latitude: '',
					affectRange: 1000,
					content: '',
					frequency: 500,
					frequencyUnit: '',
					beginTime: new Date().getTime(),
					endTime: new Date().getTime(),
					datasource: '',
					infoType: '',
					sendChannel: '',
					alertRadius: 1024,
					alertPath: '', //格式 "[[12.333,23.333],[12.444,23,444]]"，转换显示为 12.333,23.333;12.444,23,444
					alertCategory: '' //告警类型
				},
				isPointerIco: false, // 是否修改鼠标的图标
				pubMsgList: [],
				prevData: {},
				dyHeight: 'yk-dy-height',
				isOk: false,
				webSocket: null,
				webSocketData: {
					action: "event_efficient",
				}
			}
		},
		methods: {

			// ----------------------------信息发布-------------------------------
			setPointer(e) {
				this.isPointerIco = e.bool;
				if(!e.flag) {
					this.removeMapClickEvent();
				}
			},
			initWebSocket() {
				if("WebSocket" in window) {
					this.webSocket = new WebSocket(window.config.websocketUrl); //获得WebSocket对象
				}
				this.webSocket.onmessage = this.onmessage;
				this.webSocket.onclose = this.onclose;
				this.webSocket.onopen = this.onopen;
				this.webSocket.onerror = this.onerror;
			},
			onmessage(mesasge) {
				let _data = JSON.parse(mesasge.data);
				let _realData = JSON.parse(_data.result);
				let statistics = _realData.statistics;
				let taskList = _realData.taskList;
				this.$emit('PubMsgChange', statistics);
				//this.clearPubMsg();
				this.addPubMsg(taskList);
				//console.log(_realData)
			},
			onclose(data) {
				console.log("结束连接");
			},
			onopen(data) {
				var _traffic = JSON.stringify(this.webSocketData);
				this.sendMsg(_traffic);
			},
			sendMsg(msg) {
				if(window.WebSocket) {
					if(this.webSocket.readyState == WebSocket.OPEN) {
						//如果WebSocket是打开状态
						this.webSocket.send(msg); //send()发送消息
					}
				} else {
					return;
				}
			},
			destroyed() {
				this.webSocket && this.webSocket.close();
			},
			//      initPubMsgList(){
			//
			//          //this.clearPubMsg();
			//          let url = 'event/task/findEffectiveList';
			//          let params = {                
			//              status: 1,
			//          };
			//          this.$api.post( url,params,
			//              response => {
			//                  if (response.status >= 200 && response.status < 300) {
			//
			//                      this.pubMsgList = response.data ? response.data : [];                        
			//                      let t = this.pubMsgList;
			//                      this.addPubMsg(this.pubMsgList);
			//                      
			//                      // if(t.length){
			//                      //     this.$refs.refTusvnMap.centerAt( t.length, t[0], t[1])
			//                      // }
			//
			//                  } else {                     
			//                      this.$message.error("获取信息列表失败 ！"); 
			//                  }
			//              }
			//          );
			//      },
			addPubMsg(_result) {
				let _this = this;
				let _filterData = {};
				_result.forEach((item, index) => {
					_filterData[item.taskCode] = {
						lon: item.longitude,
						lat: item.latitude,
						id: item.taskCode,
						icon: item.icon ? this.iconPath + item.icon : 'static/images/position.png',
						bgImgId: 'bg_' + item.taskCode,
						bgImgSrc: 'static/images/ico-bg2.png',
						bgImgSize: [44, 58],
						bgImgOffset: [0, 0],
						size: [30, 30],
						imgOffset: [0, -34],
						alertCategory: item.alertCategory,
						beginTime: item.beginTime,
						cameraId: item.cameraId,
						endTime: item.endTime,
						eventType: item.eventType,
					};
				});

				for(let id in _this.prevData) {
					if(_filterData[id]) { //表示有该点，做setPosition
						//console.log(_filterData[id],"更新")
					} else { //表示没有该点，做remove
						this.$refs.refTusvnMap.removeOverlayById(_this.prevData[id].id);
						this.$refs.refTusvnMap.removeFeature(_this.prevData[id].bgImgId, this.mapLayer.messageBg);
						this.$refs.refTusvnMap.closeInforWindow;
						delete _this.prevData[id];
					}
				}

				for(let id in _filterData) {
					if(!_this.prevData[id]) { //表示新增该点，做add
						//console.log(_filterData[id].imgOffset,_filterData[id])
						this.$refs.refTusvnMap.addImg(_filterData[id].lon, _filterData[id].lat, _filterData[id].bgImgId, this.mapLayer.messageBg, _filterData[id].bgImgSrc, _filterData[id].bgImgSize, 0, true, 1, _filterData[id].bgImgOffset, 1, [0.5, 1]);
						this.$refs.refTusvnMap.addImgOverlay(_filterData[id].id, _filterData[id].icon, null, _filterData[id].lon, _filterData[id].lat, _filterData[id].id, _filterData[id].imgOffset, (e) => {
							e.preventDefault();
							e.stopPropagation();
							let marker = {
								id: _filterData[id].id,
								lon: _filterData[id].lon,
								lat: _filterData[id].lat,
								isEdit: true,
								icon: this.iconPath + this.msgTypeInfo.icon,
								trafficInfo: this.trafficInfo,
							};
							this.cricleID = 'icon_' + _filterData[id].id;
							this.$refs.refTusvnMap.addMyInfoWindow(marker);

						});
					}
				}
				_this.prevData = _filterData;

				//          for(let i=0;i<this.pubMsgList.length;i++){
				//              let item = this.pubMsgList[i];
				//              let icon = 'static/images/position.png';
				//              // let icon = 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png';
				//              if(item.icon){                               
				//                  icon = this.iconPath + item.icon;
				//              }              
				//              
				//              let lon = item.longitude;
				//              let lat = item.latitude;                            
				//              let id = item.taskCode;
				//              let taskCode = item.taskCode;
				//              let size = [30,30];                           
				//
				//              let bgImgId = 'bg_' + id;
				//              let bgImgSrc = 'static/images/ico-bg2.png';                            
				//              let bgImgSize = [44,58];
				//              let bgImgOffset = [0,0];                            
				//              this.$refs.refTusvnMap.addImg(lon, lat, bgImgId,this.mapLayer.messageBg,bgImgSrc,bgImgSize,0,true,1,bgImgOffset,1,[0.5,1]);                            
				//
				//              let imgOffset = [0,-34];
				//              this.$refs.refTusvnMap.addImgOverlay( id, icon, null, lon, lat, id, imgOffset, (e) => {
				//                  
				//                  e.preventDefault();
				//                  e.stopPropagation();
				//
				//                  let marker = {
				//                      id: item.id,
				//                      lon: lon,
				//                      lat: lat,
				//                      taskCode:taskCode,
				//                      isEdit: true,
				//                      icon: this.iconPath + this.msgTypeInfo.icon,
				//                      trafficInfo: this.trafficInfo,
				//
				//                  };
				//
				//                  this.cricleID = 'icon_' + item.id;
				//                  this.$refs.refTusvnMap.addMyInfoWindow(marker);
				//
				//              }); 
				//              
				//          }
			},
			temporaryClearPubMsg(e) {
				if(e.bool) { //删除地图上的点;关掉webscoket;
					this.webscoket && this.webscoket.close();
					this.clearPubMsg();
				}
			},
			clearPubMsgIco() {
				this.$refs.refTusvnMap.removeAllFeature(this.mapLayer.messageBg);
				if(Object.keys(this.prevData).length < 1) {
					return;
				}
				for(let item in this.prevData) {
					this.$refs.refTusvnMap.removeOverlayById(this.prevData[item].id);
				}
			},
			clearPubMsg() {
				this.clearPubMsgIco();
				this.prevData = {};
			},
			publishInfo(e) { //发布成功后：建立webscoket连接；清空数据
				this.clearPubMsg();
				this.initWebSocket();
			},
			updateInfo(e) { //更新不需要操作
				this.clearPubMsg();
				this.initWebSocket();
			},
			destroyInfo(e) { //手动失效也不需要操作
				this.initWebSocket();
				this.clearPubMsg();
			},
			showMarker(type, bool) {
				switch(type) {
					case 'rsu':
						bool ? this.showRsu() : this.clearRsu();
						break;
					case 'roadsideUnit':
						bool ? this.showRoadsideUnit() : this.clearRoadsideUnit();
						break;
					case 'trafficSignal':
						bool ? this.showTrafficSignal() : this.clearTrafficSignal();
						break;
					case 'roadNet':
						bool ? this.$refs.refTusvnMap.showRoadNet() : this.$refs.refTusvnMap.clearRoadNet();
						break;
				}
			},
			// 显示rsu
			showRsu() {
				let url = 'common/queryRsu';
				let params = {
					// "distcode": this.$store.state.region.code //"110108"
				};
				this.$api.post(url, params,
					response => {
						if(response.status >= 200 && response.status < 300) {

							let rsuList = response.data ? response.data : [];
							this.mapLayer.rsuIds = [];
							for(let i = 0; i < rsuList.length; i++) {
								let item = rsuList[i];
								let lon = item.longitude;
								let lat = item.latitude;
								let id = this.generataIcoName('rsu', i);
								let icon = "static/images/poi_2.png";
								let size = [30, 30];
								this.mapLayer.rsuIds.push(id);
								this.$refs.refTusvnMap.addImg(lon, lat, id, this.mapLayer.tabLayer, icon, size);
							}

						} else {
							this.$message({
								type: 'error',
								duration: '1500',
								message: "获取设备列表失败 ！",
								showClose: true
							});
						}
					}
				);
			},
			// 清除rsu
			clearRsu() {
				this.mapLayer.rsuIds.forEach(item => {
					this.$refs.refTusvnMap.removeFeature(item, this.mapLayer.tabLayer);
				});
			},
			// 显示路侧单元
			showRoadsideUnit() {
				let url = 'common/queryRoadSide';
				let params = {
					// "distcode": this.$store.state.region.code //"110108"
				};
				this.$api.post(url, params,
					response => {
						if(response.status >= 200 && response.status < 300) {

							let roadsideUnitList = response.data ? response.data : [];

							this.mapLayer.roadsideUniIds = [];
							for(let i = 0; i < roadsideUnitList.length; i++) {
								let item = roadsideUnitList[i];
								let lon = item.longitude;
								let lat = item.latitude;
								let id = this.generataIcoName('roadsideUnit', i);
								let icon = "static/images/poi_1.png";
								let size = [30, 30];
								this.mapLayer.roadsideUniIds.push(id);
								this.$refs.refTusvnMap.addImg(lon, lat, id, this.mapLayer.tabLayer, icon, size);
							}
						} else {
							this.$message({
								type: 'error',
								duration: '1500',
								message: "获取路侧单元失败 ！",
								showClose: true
							});
						}
					}
				);
			},
			// 清除路侧单元
			clearRoadsideUnit() {
				this.mapLayer.roadsideUniIds.forEach(item => {
					this.$refs.refTusvnMap.removeFeature(item, this.mapLayer.tabLayer);
				});
			},
			// 显示红绿灯
			showTrafficSignal() {
				let url = 'common/queryLight';
				let params = {
					// "distcode": this.$store.state.region.code//"310104"
				};
				this.$api.post(url, params,
					response => {
						if(response.status >= 200 && response.status < 300) {

							let trafficSignalList = response.data ? response.data : [];
							this.mapLayer.trafficSignalIds = [];
							for(let i = 0; i < trafficSignalList.length; i++) {
								let item = trafficSignalList[i];
								let lon = item.longitude;
								let lat = item.latitude;
								let id = this.generataIcoName('trafficSignal', i);
								let icon = "static/images/poi_3.png";
								let size = [30, 30];
								this.mapLayer.trafficSignalIds.push(id);
								this.$refs.refTusvnMap.addImg(lon, lat, id, this.mapLayer.tabLayer, icon, size);
							}

						} else {
							this.$message({
								type: 'error',
								duration: '1500',
								message: "获取红绿灯失败 ！",
								showClose: true
							});
						}
					}
				);
			},
			// 清除红绿灯
			clearTrafficSignal() {
				this.mapLayer.trafficSignalIds.forEach(item => {
					this.$refs.refTusvnMap.removeFeature(item, this.mapLayer.tabLayer);
				});
			},

			// 生成 类型+随机数 格式的图标名称
			generataIcoName(value, index) {
				return value + (new Date()).getTime() + index;
			},

			// shaking
			avoidShake(height) {
				let inval = 400;
				let timer = null;
				if(!this.isOk) {
					this.isOk = true;
					timer = setTimeout(() => {
						this.isOk = false;
						this.pageHeight = height;
						clearTimeout(timer);
						timer = null;
					}, inval);
				}
			},

			//------------------------------- 地图回调函数------------------------------
			// 添加 地图点击事件
			addMapClickEvent(item) {
				this.$refs.refTusvnMap.initSelect();
				this.$refs.refTusvnMap.initTrafficInof();

				this.$refs.refTusvnMap.addClickEvent(item);
				this.isPointerIco = true;

				this.$refs.refTusvnMap.closeMyInfoWindow();
				this.$refs.refTusvnMap.clearTempLayer();
				this.temporaryClearPubMsg({
					bool: false
				});
			},
			// // 移除 地图点击事件
			removeMapClickEvent() {
				this.$refs.refTusvnMap.removeClickEvent();
			},
			mapClick: function(map, evt) {

				// this.isPointerIco = false;

				if(!this.msgTypeInfo) {
					this.$message({
						type: 'warning',
						duration: '1500',
						message: "请选择信息类型 ！",
						showClose: true
					});
					return;
				}
				let lon = evt.coordinate[0];
				let lat = evt.coordinate[1];

				// 生效时间 当前时间
				let beginTime = new Date().getTime();
				// 失效时间 当前时间 +24 小时
				let endTime = (new Date()).getTime() + 24 * 60 * 60 * 1000;
				this.trafficInfo = {
					title: '信息发布',
					isEdit: false,
					eventName: this.msgTypeInfo.name,
					eventType: this.msgTypeInfo.code,
					taskCode: this.msgTypeInfo.taskCode,
					longitude: lon,
					latitude: lat,
					affectRange: 1000,
					content: this.msgTypeInfo.content,
					frequency: this.msgTypeInfo.frequency,
					frequencyUnit: this.msgTypeInfo.frequencyUnit,
					beginTime: beginTime,
					endTime: endTime,
					datasource: '',
					infoType: this.msgTypeInfo.infoType,
					sendChannel: this.msgTypeInfo.sendChannel,
					alertRadius: this.msgTypeInfo.alertRadius,
					alertPath: '', //格式 "[[12.333,23.333],[12.444,23,444]]"，转换显示为 12.333,23.333;12.444,23,444
					alertCategory: '' //告警类型
				};
				//console.log('this.msgTypeInfo.icon', this.iconPath + this.msgTypeInfo.icon);
				let marker = {
					id: 'marker' + (new Date()).getTime(),
					lon: lon,
					lat: lat,
					trafficInfo: this.trafficInfo,
					isEdit: false,
					icon: this.iconPath + this.msgTypeInfo.icon,
				};

				this.$refs.refTusvnMap.addMyInfoWindow(marker);
			},

			mapInitComplete: function(tusvnmap) {
				//创建图层
				this.$refs.refTusvnMap.addVectorLayer(this.mapLayer.tabLayer);
				this.$refs.refTusvnMap.addVectorLayer(this.mapLayer.message);
				this.$refs.refTusvnMap.addVectorLayer(this.mapLayer.messageBg);
				this.mapInitOk = true;
				// 设置地图中心点及级别
				this.$refs.refTusvnMap.centerAt(window.defaultMapOption.center[0], window.defaultMapOption.center[1]);
				this.$refs.refTusvnMap.zoomTo(window.defaultMapOption.zoom);

				this.initWebSocket();
			},
			viewLevelChange: function(tusvnmap, mevent) {

				this.mapLevel.value = mevent;

			},
			extentChange: function(tusvnmap, newextent) {},
		}
	}
</script>

<style scoped>
	.yk-pointer-ico {
		cursor: url('position3.png') 8 24, url('position3.png'), auto;
	}
	
	.yk-pointer-normal {
		cursor: default;
	}
	
	.yk-dy-height {
		height: calc(100vh - 100px);
	}
</style>