<template>
  <div class="c-view-dialog" v-cloak>
    <div class="c-scroll-wrap">
      <div class="c-scroll-inner">
        <div class="c-title-fixed">
          <h3 class="c-title">
            信息历史
            <i class="el-icon-arrow-right"></i>详情
            <el-page-header @back="backClick" class="c-return-btn"></el-page-header>
          </h3>
        </div>
        <!-- 信息模块(基础信息) -->
          <history-basic-info title="基本信息" :detailData="detailData"></history-basic-info>
        <!-- 内容详情 -->
          <history-content title="内容详情" :infoData="infoData"></history-content>
        <!-- 视频内容 -->
          <history-video title="历史视频"></history-video>
      </div>
       
    </div>
  </div>
</template>
<script>
import HistoryBasicInfo from "./components/historyBasicInfo";
import HistoryContent from './components/historyContent';
import HistoryVideo from './components/historyVideo';
export default {
  props: {
    detailData: Array,
    infoData: Array
  },
  components: {
    HistoryBasicInfo,
    HistoryContent,
    HistoryVideo
  },
  data() {
    return {
      isScaleMap: false
    };
  },
  methods: {
    backClick() {
      this.$emit("infoHistoryBack");
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/scss/theme.scss";
</style>
