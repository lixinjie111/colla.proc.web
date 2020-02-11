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
             <span v-for="item in typeList" :key="item.key"  v-if="ruleForm.eventCategory == item.key">{{item.name}}</span>
        </el-form-item>
        <el-form-item label="信息类型名称：">
            {{ruleForm.name}}
        </el-form-item>
        <el-form-item label="告警类别(国标)：">
            {{ruleForm.alertCategory}}
        </el-form-item>
        <el-form-item label="信息类型图标：">
            <div class="m-pic-box image-box">
                <img :src="iconPath+'rsi_'+popData.data.alertCategory+'.png'+'?t='+new Date().getTime()" class="image" @error="errorImg($event)">
            </div>
            <div class="m-pic-box image-pic">
                <img :src="iconPath+'rsi_map_'+popData.data.alertCategory+'.png'+'?t='+new Date().getTime()" class="image" @error="errorImg($event)">
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
      popData: Object,
      typeList:Array
    },
    computed: {
      ruleForm() {
        return this.popData.data
      }
    },
    data(){
        return {
            iconPath: window.config.iconPath,
            disabled: true,
        }
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
.m-pic-box {
    overflow: hidden;
    display: inline-block;
    margin: 0 3px; 
    width: 34px;
    vertical-align: middle;
    overflow: hidden;
    line-height: 0;
    &.image-box{
        height: 34px;
        background: #f59307;  
        border-radius:50%;
        position: relative;
        .image{
           position: absolute;
           width: 76% !important;
            top:0;
            bottom:0;
            left:0;
            right: 0;
            margin:auto
        }
    } 
    .image{
        display: inline-block;
        width: 100%;
    }
}
</style>
