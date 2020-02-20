<template>
<div class="c-page clearfix">
    <el-pagination
        background
        @current-change="changePageCurrent" 
        :current-page.sync="currentPage" 
        :total="total"
        @size-change="changePageSize"
        :page-sizes="pageSizes"
        :page-size.sync="pageSize"
        :layout="layout">
    </el-pagination>
</div>
</template>
<script>
export default {
    props: {
        pageSizes: {
            type: Array,
            default() {
                return [10,20,50,100,200]
            }
        },
        layout: {
            type: String,
            default: "total, sizes, prev, pager, next"
        },
        page: Number,
        size: Number,
        total: Number
    },
    data() {
        return {
        }
    },
    methods: {
        changePageCurrent(val) {
            this.$emit('pagination', {page: val, size: this.pageSize});
        },
        changePageSize(val) {
            this.$emit('pagination', {page: this.currentPage, size: val});
        }
    },
    computed: {
        currentPage: {
            get() {
                return this.page;
            },
            set(val) {
                this.$emit('update:page', val);
            }
        },  
        pageSize: {
            get() {
                return this.size;
            },
            set(val) {
                this.$emit('update:size', val);
            }
        }
    }
}
</script>
<style>
</style>