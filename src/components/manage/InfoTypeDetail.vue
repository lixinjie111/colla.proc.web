<template>
    <el-form ref="ruleForm" size="mini" label-width="120px" class="demo-ruleForm yk-left">
        <el-form-item label="信息所属分类：" prop="name">
            <!-- <el-input size="mini" v-model="data.eventCategory" disabled></el-input> -->
            {{data.eventCategory}}
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
            {{data.frequency + ' ' + data.frequencyUnit}}
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
    width: 44px;
    height: 44px;
    /* margin: 0 auto; */
    background-image: url('./ico-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    text-align: center;
}
.image{
    margin: 0 auto;
    position: relative;
    top: 50%; /*偏移*/
    transform: translateY(-50%);
}
</style>
