<template>
<el-dialog
    :close-on-click-modal="false"
    :title="popData.title"
    width="30%"
    :before-close="handleCancel"
    :visible.sync="popData.visible"
    class="yk-left"
    >
    <el-form ref="ruleForm" size="mini" label-width="120px">
        <el-form-item label="信息所属分类：">
            <span v-if="ruleForm.eventCategory == 'TI01'">车辆异常信息</span>
            <span v-else-if="ruleForm.eventCategory == 'TI02'">道路异常信息</span>
            <span v-else-if="ruleForm.eventCategory == 'TI03'">交通管制信息</span>
            <span v-else-if="ruleForm.eventCategory == 'TI04'">天气服务信息</span>
            <span v-else>{{ruleForm.eventCategory}}</span>

        </el-form-item>
        <el-form-item label="信息类型名称：">
            {{ruleForm.name}}
        </el-form-item>
        <el-form-item label="告警类别(国标)：">
            {{ruleForm.alertCategory}}
        </el-form-item>
        <el-form-item label="信息类型图标：">
            <div class="picBox">
                <div v-for="item in iconPath" :key="item" :class="item.indexOf('rsi_map')==-1?'image-box':'image-pic'">
                    <img  :src="item" class="image" @error="errorImg($event)">
                </div>
            </div>
        </el-form-item>
        <el-form-item label="默认广播频率：">
            <!-- <el-input size="mini" v-model="data.name" disabled></el-input> -->
            {{ruleForm.frequency + ' ' }}
            <span v-if="ruleForm.frequencyUnit == 1">毫秒</span>
            <span v-else-if="ruleForm.frequencyUnit == 2">秒</span>
            <span v-else-if="ruleForm.frequencyUnit == 3">分钟</span>
            <span v-else>{{ruleForm.frequencyUnit}}</span>
        </el-form-item>
        <el-form-item label="默认信息内容：" prop="name">
            <!-- <el-input type="textarea" size="mini" v-model="data.name" disabled></el-input> -->
            {{ruleForm.content}}
        </el-form-item>
    </el-form>
</el-dialog>
</template>
<script>
export default {
    props: {
      popData: Object
    },
    computed: {
      ruleForm() {
        return this.popData.data
      }
    },
    data(){
        return {
            iconPath: [],
            disabled: true,
        }
    },
    created(){
        let _arr=this.popData.data.icon.split(",");  
        _arr.forEach(item =>{
            this.iconPath.push(window.config.iconPath+item)
        }) 
    },
    methods: {
        handleCancel() {
            this.$emit("closeDialog");
        }, 
        errorImg(event){
            if(event.target.src.indexOf('rsi_map')==-1){
                event.target.src=this.iconPath+"rsi_0.png";
            }else{
                event.target.src=this.iconPath+"rsi_map_0.png";
            }
        },
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
.yk-right {
    float: right;
}
.picBox{
     height: 34px;
    display: flex;
    .image-pic{
        width: 27px;
        margin-right: 5px;  
        @include layoutMode();
        .image{
                width: 100%;
            }
    }
    .image-box{
        width: 34px;
        height: 34px;
        background:#f59307;  
        border-radius:50%;     
        @include layoutMode();
        .image{
            width: 25px;
        }
    }
}

</style>
