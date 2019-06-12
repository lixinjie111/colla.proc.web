<template>
    <div class="yk-container">
        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                prop="date"
                label="序号"
               >
            </el-table-column>
            <el-table-column
                prop="name"
                label="信息类型"
                >
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

        <el-row class="yk-paging">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="1000">
            </el-pagination>
        </el-row>
    </div>
</template>
<script>
export default {
    data(){
        return {
            tableData: [
                {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区'
                }, 
                {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区'
                }, 
                {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区'
                }, 
                {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区'
                }
            ]
        }
    },
    methods: {
        initData(){
            
        }
    },
    created(){

    },

}
</script>
<style scoped>
.yk-container{
    padding: 20px;
}

.el-table td, .el-table th{
    padding: 5px 0px!important;
}

.yk-paging{
    padding: 5px 10px;
    text-align: right;
}
</style>

