<template>
  <div class="wrapper" v-cloak>
    <p class="c-title c-border-bottom" v-if="title">{{title}}</p>
    <ul class="c-video-list-wrapper c-wrapper-20 c-detail-box c-padding-10 clearfix" >
      <li class="c-video-list" >
        <div class="c-video-16-9">
          <div class="c-video">
            <div class="c-video-title">
              <span>路侧点：*******</span>
              <i class="el-icon-refresh"></i>
            </div>
            <div class="c-video-mask">
              <i class="el-icon-video-play"></i>
            </div>
          </div>
        </div>
      </li>
      <li class="c-video-list">
        <div class="c-video-16-9">
          <div class="c-video">
            <div class="c-video-title">
              <span>路侧点：*******</span>
              <i class="el-icon-refresh"></i>
            </div>
            <div class="c-video-mask">
              <span class="c-video-tip">设备离线，暂无视频</span>
            </div>
          </div>
        </div>
      </li>
      <li class="c-video-list" >
        <div class="c-video-16-9">
          <div class="c-video">
            <div class="c-video-title">
              <span>路侧点：*******</span>
              <i class="el-icon-refresh"></i>
            </div>
            <div class="c-video-mask">
              <i class="el-icon-loading"></i>
            </div>
          </div>
        </div>
      </li>
      <li class="c-video-list" >
        <div class="c-video-16-9">
          <div class="c-video">
            <div class="c-video-title">
              <span>路侧点：*******</span>
              <i class="el-icon-refresh"></i>
            </div>
            <div class="c-video-mask">
              <span class="c-video-tip">设备不存在，暂无视频</span>
            </div>
          </div>
        </div>
      </li>
      <li class="c-video-list" >
        <div class="c-video-16-9">
          <div class="c-video">
            <div class="c-video-title">
              <span>路侧点：*******</span>
              <i class="el-icon-refresh"></i>
            </div>
            <div class="c-video-mask">
              <span class="c-video-tip">请求超时， 点击刷新</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "TempleteSeven",
  props: {
      title: String
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