<template>
    <ul class="c-video-list-wrapper c-detail-box c-padding-10 clearfix">
      <template v-if="videoData.length">
        <li class="c-video-list" v-for="(item, index) in videoData" :key="index">
          <div class="c-video-16-9">
            <div class="c-video">
              <div class="c-video-title">
                <span>{{'序列号： ' + item.serialNum}}</span>
              </div>
              <div class="c-video-mask">
                <i class="el-icon-video-play" @click="playVideo"></i>
              </div>
            </div>
            <video-player v-if="visiblePlay" :visiblePlay="visiblePlay" :vcrData="item" @cancleFunc="cancleFunc"></video-player>
          </div>
        </li>
      </template>
      <li class="c-video-list" v-else>
        <div class="c-video-16-9">
          <div class="c-video">
            <div class="c-video-mask">
              <div class="c-empty-box">暂无视频</div>
            </div>
          </div>
        </div>
      </li>
    </ul>
</template>

<script>
import VideoPlayer from './components/videoPlay';
export default {
    components: {
      VideoPlayer
    },
    props: {
        videoData: Array
    },
    data() {
      return {
        visiblePlay: false,
        vcrData: null
      };
    },
    mounted() {},
    methods: {
      playVideo(data) {
        this.visiblePlay = true;
      },
      cancleFunc() {
        this.visiblePlay = false;
      }
    }
};
</script>

<style lang="scss">
@import "@/assets/scss/theme.scss";

</style>