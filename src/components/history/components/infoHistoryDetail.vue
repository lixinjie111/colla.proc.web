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
        <vehicle-info-tag title="基本信息" :infoTagData="detailData"></vehicle-info-tag>
        <!-- 内容详情 -->
        <div class="c-wrapper-20 c-detail-box m-desc c-flex">
          <span class="title">内容详情</span>
          <span class="desc" :title="infoData || '--'">{{infoData || '--'}}</span>
        </div>
        <!-- 视频内容 -->

        <div class="c-wrapper-20 c-detail-box" v-cloak>
          <p class="c-title c-border-bottom">历史视频</p>
          <history-video v-show="isShowVideo" :videoData="videoData"></history-video>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VehicleInfoTag from "../../../common/detail/vehicleInfoTag";
import HistoryVideo from '../../../common/detail/historyVideo';
export default {
  props: {
    detailData: Array,
    infoData: String,
    taskCode: String
  },
  components: {
    VehicleInfoTag,
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
        } else {
          if(res.data.message) {
            this.$message({
                type: 'error',
                duration: '1500',
                message: res.data.message,
                showClose: true
            });    
          }
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
<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
.m-desc {
  margin-top: -20px;
  border: 1px solid #e6e6e6;
  border-top: none;
  line-height: 24px;
  .title {
    position: relative;
    flex: 1;
    text-align: center;
    background-color: #fafafa;
    padding: 10px 0;
    &:before {
      content: "";
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background-color: #e6e6e6;
    }
  }
  .desc {
    flex: 5;
    padding: 10px 0;
    text-indent: 10px;
  }
}
</style>
