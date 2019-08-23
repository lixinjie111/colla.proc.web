<template>
 <div class="c-wrapper-20 c-detail-box">
    <p class="c-title c-border-bottom" v-if="title">{{title}}</p>
      <div class="wrapper" v-cloak>
      <ul class="c-video-list-wrapper c-detail-box c-padding-10 clearfix" v-if="videoData.length > 0">
        <li class="c-video-list" v-for="(item, index) in videoData" :key="index">
          <div class="c-video-16-9">
            <div class="c-video">
              <div class="c-video-title">
                <span>{{item.name}}</span>
                <i class="el-icon-refresh"></i>
              </div>
              <div class="c-video-mask">
                <i class="el-icon-video-play" v-if="item.status === 1"></i>
                <span class="c-video-tip" v-if="item.status === 2">设备离线，暂无视频</span>
                <span class="c-video-tip" v-if="item.status === 3">设备不存在，暂无视频</span>
                <div class="c-empty-box" v-if="item.status === 0">暂无视频</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>



</template>

<script>
export default {
  name: "TempleteSeven",
  props: {
      title: String,
      videoData: Array
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss">
@import "@/assets/scss/theme.scss";
</style>