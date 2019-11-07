<template>
<div class="m-video-player">   
    <el-dialog 
        :title="'序列号： ' + vcrData.serialNum" 
        :visible.sync="visiblePlay"
        :before-close="cancleFunc"
        :close-on-click-modal="false"
        width="50%">
        <live-player 
            :requestVideoUrl="videoUrl"
            :autoplay="true"
            :refreshFlag="false"
            :liveFlag="false"
            >
        </live-player>
        <!-- <video-player 
            :requestVideoUrl="videoUrl"
            :autoplay="true"
            :refreshFlag="false"
            :liveFlag="false"
            >
        </video-player> -->
    </el-dialog>
</div>
    
</template>

<script>
import LivePlayer from '@/common/livePlayer/template'
// import videoPlayer from '@/common/video/video'
export default {
    props: {
        visiblePlay: Boolean,
        vcrData: Object
    },
    components: {
        LivePlayer,
        // videoPlayer
    },
    data() {
        return {
        }
    },
    computed: {
        videoUrl() {
            // console.log(this.vcrData.url);
            let _url = this.vcrData.url;
            // let _url = "http://218.76.44.22:10080/record/video/hls/EasyGBS3402000005132000005634020000051320000056/20191105134237/20191105134253/video.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzM0NjgyODcsInB3IjoiOTU2N2VmNDQ3NWVhMmRlYjg4MmQxMDljZmNjY2VlYmEiLCJ0bSI6MTU3Mjg2MzQ4NywidW4iOiJhZG1pbiJ9.U6zB83QU5_PUyt9yUUCQhVSQ1blRutApmIS0a4Fq62Q";
            // let _reg=/218\.76\.44\.22/;
            // let _newUrl = _url.replace(_reg,"10.3.2.110");
            // console.log(_newUrl);
            return _newUrl;
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