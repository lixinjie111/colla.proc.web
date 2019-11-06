<template>
<div class="m-video-player">   
    <el-dialog 
        :title="'序列号： ' + vcrData.serialNum" 
        :visible.sync="visiblePlay"
        :before-close="cancleFunc"
        :close-on-click-modal="false"
        width="50%">
        <!-- <live-player 
            :requestVideoUrl="url"
            :autoplay="true"
            :refreshFlag="false"
            :liveFlag="false"
            >
        </live-player> -->
        <video-player 
            :requestVideoUrl="vcrData.url"
            :autoplay="true"
            :refreshFlag="false"
            :liveFlag="false"
            >
        </video-player>
    </el-dialog>
</div>
    
</template>

<script>
// import LivePlayer from '@/common/livePlayer/template'
import videoPlayer from '@/common/video/video'
export default {
    props: {
        visiblePlay: Boolean,
        vcrData: Object
    },
    components: {
        // LivePlayer,
        videoPlayer
    },
    data() {
        return {
        }
    },
    methods: {
       cancleFunc() {
            this.$emit('cancleFunc', this.vcrData);
            
       }
    }
}
</script>

<style lang="scss">
.m-video-player {
    .el-dialog__body {
        padding: 10px 20px 20px;
    }
}
</style>