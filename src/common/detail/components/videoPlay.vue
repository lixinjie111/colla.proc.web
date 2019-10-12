<template>
<div class="m-video-player">   
    <el-dialog 
        :title="'序列号： ' + vcrData.serialNum" 
        :visible.sync="visiblePlay"
        :before-close="cancleFunc"
        :close-on-click-modal="false"
        width="50%">
       <video-player 
            class="vjs-custom-skin"
            ref="videoPlayer"
            :options="playerOptions"
            :playsinline="true">
        </video-player>
    </el-dialog>
</div>
    
</template>

<script>
import { videoPlayer }  from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
export default {
    props: {
        visiblePlay: Boolean,
        vcrData: Object
    },
    components: {
        videoPlayer
    },
    data() {
        return {
            playerOptions:{
                playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                overNative: true,
                controls: true,
                autoplay: false, //如果true,浏览器准备好时开始回放。
                muted: true, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [{
                    type: "video/mp4",
                    src: this.vcrData.url
                }],
                poster: "", //你的封面地址
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                    timeDivider: false,
                    durationDisplay: false,
                    currentTimeDisplay:false,
                    fullscreenToggle: true, //全屏按钮
                    remainingTimeDisplay: false,
                    captionsButton : false,
                    chaptersButton: false,
                    subtitlesButton:false,
                    liveDisplay:false,
                    playbackRateMenuButton:false
                }
            },
        }
    },
    methods: {
       cancleFunc() {
        //    this.vcrData.url = '';
            this.$emit('cancleFunc',this.vcrData);
            
       }
    },
    computed: { 
        player() {
            return this.$refs.videoPlayer.player;
        }
    },
    beforeDestroy() {
        this.player.pause();
        setTimeout(() => {
            this.player.dispose();
        }, 0);
    }
}
</script>

<style lang="scss">
// @import '@/assets/scss/theme.scss';
.m-video-player {
    .el-dialog__body {
        padding: 10px 20px 20px;
    }
}
</style>