<template>
    <div class="yk-container">
        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                prop="date"
                label="序号"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="信息类型"
                width="180">
            </el-table-column>
            <el-table-column
                prop="address"
                label="信息分类">
            </el-table-column>
            <el-table-column
                prop="date"
                label="ICON">
            </el-table-column>
            <el-table-column
                prop="name"
                label="默认信息内容">
            </el-table-column>
            <el-table-column
                prop="address"
                label="默认广播范围">
            </el-table-column>
            <el-table-column
                prop="address"
                label="管理">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    methods: {

    },
    created(){

    },

}
</script>
<style scoped>
.yk-container{
    padding: 20px;
}
</style>

