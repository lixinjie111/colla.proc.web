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
        <!-- 信息模块 -->
        <div class="c-detail-lable-list clearfix c-detail-box c-wrapper-20 c-padding-20">
          <p class="c-detail-lable">
            <span class="name">信息编号：</span>
            <span class="value">{{detailData.taskCode}}</span>
          </p>
          <p class="c-detail-lable">
            <span class="name">信息类型：</span>
            <span class="value">{{detailData.eventName}}</span>
          </p>
          <p class="c-detail-lable">
            <span class="name">事件编号：</span>
            <span class="value">{{detailData.eventCode}}</span>
          </p>
          <p class="c-detail-lable">
            <span class="name">事件发生时间：</span>
            <span class="value">{{detailData.createTime}}</span>
          </p>
          <p class="c-detail-lable">
            <span class="name">事件结束时间:</span>
            <span class="value">{{detailData.updateTime}}</span>
          </p>
          <p class="c-detail-lable">
            <span class="name">事件发生位置：</span>
            <span
              class="value"
            >{{detailData.longitude.toFixed(8) + ' ，'}}{{detailData.latitude.toFixed(8)}}</span>
          </p>
          <p class="c-detail-lable">
            <span class="name">发布开始时间：</span>
            <span class="value">{{detailData.beginTime}}</span>
          </p>
          <p class="c-detail-lable">
            <span class="name">发布结束时间：</span>
            <span class="value">{{detailData.endTime}}</span>
          </p>
          <p class="c-detail-lable">
            <span class="name">累计发生次数：</span>
            <span class="value">{{detailData.sendNumber}}</span>
          </p>
          <p class="c-detail-lable c-flex info-con">
            <span class="name info-title c-inline-block">信息内容详情：</span>
            <span class="value info-detail c-inline-block">{{detailData.content}}</span>
          </p>
          <p class="c-detail-lable c-flex info-con">
            <span class="name info-title c-inline-block">历史视频查看：</span>
            <span class="value info-detail c-inline-block">
              <ul class="c-flex" style="width:100%">
                <li
                  class="c-mr-20"
                  style="width:100%;padding-bottom:75%;background-color:red;"
                >121212</li>
                <li
                  class="c-mr-20"
                  style="width:100%; padding-bottom:75%;background-color:red;"
                >121212</li>
                <li
                  class="c-mr-20"
                  style="width:100%; padding-bottom:75%;background-color:red;"
                >121212</li>
                <li
                  class="c-mr-20"
                  style="width:100%; padding-bottom:75%;background-color:red;"
                >121212</li>
              </ul>
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    detailData: Object
  },
  components: {},
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
.info-con {
  width: 100%;

  .info-title {
    min-width: 7%;
  }
  .info-detail {
    height: 100px;
    width: 93%;
    background-color: #f7f7f7;
  }
}
</style>
