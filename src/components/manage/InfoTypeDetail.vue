<template>
    <el-form ref="ruleForm" size="mini" label-width="120px" class="demo-ruleForm yk-left">
        <el-form-item label="信息所属分类：" prop="name">
            <!-- <el-input size="mini" v-model="data.eventCategory" disabled></el-input> -->
            <!-- {{data.eventCategory}} -->
            <span v-if="data.eventCategory == 'TI01'">车辆异常信息</span>
            <span v-else-if="data.eventCategory == 'TI02'">道路异常信息</span>
            <span v-else-if="data.eventCategory == 'TI03'">交通管制信息</span>
            <span v-else-if="data.eventCategory == 'TI04'">天气服务信息</span>
            <span v-else>{{data.eventCategory}}</span>

        </el-form-item>
        <el-form-item label="信息类型名称：" prop="name">
            <!-- <el-input size="mini" v-model="data.name" disabled></el-input> -->
            {{data.name}}
        </el-form-item>
        <el-form-item label="信息类型图标：" prop="name">
            
            <!-- <el-image :src="iconPath"></el-image> -->

            <div class="image-box">
                <img :src="iconPath" class="image">
            </div>

        </el-form-item>
        <el-form-item label="默认广播频率：" prop="name">
            <!-- <el-input size="mini" v-model="data.name" disabled></el-input> -->
            {{data.frequency + ' ' }}
            <span v-if="data.frequencyUnit == 1">毫秒</span>
            <span v-else-if="data.frequencyUnit == 2">秒</span>
            <span v-else-if="data.frequencyUnit == 3">分钟</span>
            <span v-else>{{data.frequencyUnit}}</span>
        </el-form-item>
        <el-form-item label="默认信息内容：" prop="name">
            <!-- <el-input type="textarea" size="mini" v-model="data.name" disabled></el-input> -->
            {{data.content}}
        </el-form-item>
    </el-form>
</template>
<script>
export default {
    props: ['data'],
    data(){
        return {
            iconPath: '',
            disabled: true,
        }
    },
    watch:{
        'data.icon': {
            handler(newVal,oldVal){                
                this.iconPath = window.cfg.iconPath + newVal;
            },
            deep: true,
            immediate: true,
        }
    }
}
</script>
<style scoped>
.image-box{
    width: 34px;
    height: 34px;
    /* margin: 0 auto; */
    background-image: url('./ico-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    text-align: center;
}
.image{
    width: 20px;
    margin: 0 auto;
    position: relative;
    top: 50%; /*偏移*/
    transform: translateY(-50%);
}
</style>
