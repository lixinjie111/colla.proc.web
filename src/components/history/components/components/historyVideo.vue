<template>
 <div class="c-wrapper-20 c-detail-box">
    <p class="c-title c-border-bottom" v-if="title">{{title}}</p>
      <div class="wrapper" v-cloak>
      <ul class="c-video-list-wrapper c-detail-box c-padding-10 clearfix" v-if="videoData.length > 0">
        <li class="c-video-list" v-for="(item, index) in videoData" :key="index">
          <div class="c-video-16-9">
            <div class="c-video">
              <div class="c-video-title">
                <!-- <span>{{'序列号： ' + item.serialNum}}</span> -->
                <!-- <i class="el-icon-refresh"></i> -->
              </div>
              <div class="c-video-mask">
                <i class="el-icon-video-play" style="margin-right:10px" v-if="item.url !== ''" @click="playVideo"></i>
                <div class="c-empty-box" v-else>暂无视频</div>
                <span class="c-icon-video-info">{{'序列号： ' + item.serialNum}}</span>
              </div>
            </div>
            <vcr-player :visiblePlay="visiblePlay" :vcrData="item" @cancleFunc="cancleFunc"></vcr-player>
          </div>
        </li>
      </ul>
    </div>
    <!-- 视频播放 -->
  </div>
</template>

<script>
import vcrPlayer from './components/videoPlay';
export default {
    components: {
      vcrPlayer
    },
    props: {
        title: String,
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
        // this.videoData.map(x => {
        //   if (x.serialNum === data.serialNum) {
        //    data.url = x.url;
        //   }
        // });
        // this.vcrData = data;
        console.log('this.vcrData', this.vcrData);
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
.c-icon-video-info {
  font-size: 14px;
}
</style>