<template>
<el-dialog
    :title="popData.title"
    width="30%"
    :before-close="handleCancel"
    :visible.sync="popData.visible"
    class="yk-left"
    >
    <el-form ref="ruleForm" size="mini" label-width="120px">
        <el-form-item label="信息所属分类：">
            <!-- <el-input size="mini" v-model="data.eventCategory" disabled></el-input> -->
            <!-- {{data.eventCategory}} -->
            <span v-if="ruleForm.eventCategory == 'TI01'">车辆异常信息</span>
            <span v-else-if="ruleForm.eventCategory == 'TI02'">道路异常信息</span>
            <span v-else-if="ruleForm.eventCategory == 'TI03'">交通管制信息</span>
            <span v-else-if="ruleForm.eventCategory == 'TI04'">天气服务信息</span>
            <span v-else>{{ruleForm.eventCategory}}</span>

        </el-form-item>
        <el-form-item label="信息类型名称：">
            <!-- <el-input size="mini" v-model="data.name" disabled></el-input> -->
            {{ruleForm.name}}
        </el-form-item>
        <el-form-item label="信息类型图标：">
            
            <!-- <el-image :src="iconPath"></el-image> -->

            <div class="image-box">
                <img :src="iconPath" class="image">
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
            iconPath: '',
            disabled: true,
        }
    },
    methods: {
      handleCancel() {
        this.$emit("closeDialog");
      }
    },
    watch:{
        'ruleForm.icon': {
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
