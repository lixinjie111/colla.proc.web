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
          <div class="c-wrapper-20 c-detail-box">
            <p class="c-title c-border-bottom">内容详情</p>
            <div class="c-padding-20" v-if="infoData">{{infoData}}</div>
            <div class="c-empty-box" v-else>暂无数据</div>
          </div>
        <!-- 视频内容 -->
          <history-video v-show="isShowVideo" :videoData="videoData" title="历史视频"></history-video>
      </div>
    </div>
  </div>
</template>
<script>
import HistoryBasicInfo from "../../../common/detail/historyBasicInfo";
import HistoryVideo from '../../../common/detail/historyVideo';
export default {
  props: {
    detailData: Array,
    infoData: String,
    taskCode: String
  },
  components: {
    HistoryBasicInfo,
    HistoryVideo
  },
  data() {
    return {
      isScaleMap: false,
      isShowVideo: false,
      videoData: []
    };
  },
  mounted() {
    this.getHistoryDetail();
  },
  watch: {
    taskCode(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getHistoryDetail();
      }
    }
  },
  methods: {
    getHistoryDetail() {
      let url = 'event/task/getEventDetail';
      let params = {
        'taskCode': this.taskCode
      }
      this.$api.post(url, params, res => {
        if (res.data.status === 200) {
            this.videoData = res.data.data.videoList;
            this.isShowVideo = true;
            console.log('this.videoData', this.videoData);
        } else {
            this.$message({
              type: 'error',
              message: '暂无视频数据'
            })
            this.isShowVideo = true;
        }
      });
    },
    backClick() {
      this.$emit("infoHistoryBack");
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/scss/theme.scss";
</style>
