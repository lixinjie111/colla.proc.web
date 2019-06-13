<template>
 
    <div id="ykMap" class="yk-map">

        <!-- 高德地图组件 -->
        <el-amap vid="amapDemo" :mapStyle="mapStyle"></el-amap>

        <!-- 左侧信息 -->
        <div class="yk-left">
            <el-card :body-style="{ padding: '0px' }"> 
                <img src="static/images/ico1.png" class="image">
                <div class="yk-card-title">
                    <span >27</span>
                </div>
            </el-card>

            <el-card :body-style="{ padding: '0px' }">
                <img src="static/images/ico2.png" class="image">
                <div class="yk-card-title">
                    <span>30</span>                    
                </div>
            </el-card>

            <el-card :body-style="{ padding: '0px' }">
                <img src="static/images/ico3.png" class="image">
                <div class="yk-card-title">
                    <span>22</span>
                </div>
            </el-card>

        </div>

        <!-- 右侧信息 -->
        <div class="yk-right">
            <el-form size="mini">

                <el-form-item class="yk-f-right">
                    <el-select placeholder="发布信息">
                        <!-- <el-option value="发布信息">发布信息</el-option> -->
                        <template v-for="(item,index) in pubMsgList">
                            <el-option :key="index" :value="item.value">{{item.value}}</el-option>
                        </template>
                    </el-select>
                </el-form-item>

                <el-form-item class="yk-f-right">
                    <el-select placeholder="POI">
                        <!-- <el-option value="POI">POI</el-option> -->
                        <template v-for="(item,index) in poiList">
                            <el-option :key="index" :value="item.value">{{item.value}}</el-option>
                        </template>
                    </el-select>
                </el-form-item>
                
            </el-form>
        </div>

        <!-- 提交数据 -->
        <!-- <div class="yk-form">
            <el-form>
                <el-form-item label="信息类型名称" prop="name">
                    <el-input size="mini" value="test"></el-input>
                </el-form-item>
            </el-form>
        </div> -->
    </div>

</template>
<script>
export default {
    data(){
        return {
            mapStyle: 'amap://styles/macaron',
            popData: {
                title: '提示',
                type: 'info-type-normal',
                msg: '这是一段信息',
                data: {},
                visible: true,
            },
            poiList: [
                { id: 1, name: 'RSU', value: 'RSU'},
                { id: 2, name: '路侧单元', value: '路侧单元'},
                { id: 3, name: '红绿灯', value: '红绿灯'},
            ],
            pubMsgList: [
                { id: 1, name: 'ICON障碍物', value: 'ICON障碍物'},
                { id: 2, name: 'ICON道路施工', value: 'ICON道路施工'},
                { id: 3, name: 'ICON货物散落', value: 'ICON货物散落'},
            ],
        }
    },
    methods: {
        handleClose(){

        },

    },
    created(){
        
    },

}
</script>
<style scoped>
    .el-card{
        width: 60px;
        height: 60px;
        padding: 6px;
        margin-bottom: 20px;
    }
   
    .image{
        margin-top: 3px;
        width: 32px;
    }
    #ykMap {
        width: 100%;
        height: 100%;
    }
    .yk-map{
        width:100%;
        height: 100%;
        position: relative;
    }

    .yk-left{
        left: 30px;
        top: 30px;
        position: absolute;
    }

    .yk-right{
        right: 30px;
        top: 30px;
        position: absolute;
    }

    .yk-f-right{
        float: right;
        margin-right: 10px;
    }

    .yk-card-title{
        color: #F59307;
        padding-top: 5px;
        font-weight: bold;
        font-size: 16px;
        user-select: none;
    }

    .yk-form{
        top: 200px;
        left: 200px;
        position: absolute;
        background: #ffffff;
    }

   

</style>

