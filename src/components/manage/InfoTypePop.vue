 <template>

<!-- :model="ruleForm" -->
  <el-dialog
    :close-on-click-modal="false"
    :title="popData.title"
    width="30%"
    :before-close="handleCancel"
    :visible.sync="popData.visible"
    >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="mini" label-width="120px">
        
        <el-form-item label="信息所属分类" prop="eventCategory">
            <el-select v-model.trim="ruleForm.eventCategory" placeholder="请选择">

              <template v-for="(item,index) in typeList">
                <el-option :key="index" :label="item.name" :value="item.key">{{item.name}}</el-option>
              </template>
              
            </el-select>
        </el-form-item>

        <el-form-item label="告警类别(国标)" prop="alertCategory">
             <el-input v-model.trim="ruleForm.alertCategory"></el-input>
        </el-form-item>

        <el-form-item label="信息类型名称" prop="name">
            <el-input v-model.trim="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="信息类型图标" prop="icon">
          <template v-for="(item, index) in uploadFileBase64">
            <div @click="getImageTypeIndex(index)" class="c-upload-wrapper">
              <el-upload
                ref="upload"
                action
                :auto-upload="false"
                :show-file-list="false"
                :on-change="imgPreview"
              >
                <img v-if="uploadFileBase64[index].url" :src="uploadFileBase64[index].url | isBaseImg"  class="c-upload-size" @error="errorImg($event)">
                <i v-else class="el-icon-plus c-upload-size"></i>
                <el-button type="warning">上传图标</el-button>
                <span class="c-form-tip">尺寸：{{item.width}}*{{item.height}}</span>
              </el-upload>
            </div>
          </template>
        </el-form-item>

        <el-form-item label="默认广播频率" prop="frequency">
            <el-input v-model.trim="ruleForm.frequency">             
            
              <template slot="append">
                <select class="yk-border-left-none yk-input-select" v-model.trim="ruleForm.frequencyUnit" placeholder="请选择">
                    <option v-for="(item,index) in frequencyUnitList" :key="index" :value="item.key">{{item.name}}</option>
                </select>
              </template>
            
            </el-input>
        </el-form-item>

        <el-form-item label="默认信息内容" prop="content">
            <el-input type="textarea" v-model.trim="ruleForm.content"></el-input>
        </el-form-item>

        <el-form-item label="默认影响范围" prop="alertRadius">
            <el-input-number v-model.trim="ruleForm.alertRadius" class="c-input-number" controls-position="right" :min="1" :max="1024"></el-input-number>
            <span class="c-form-tip">单位:10cm</span>
        </el-form-item>

        <el-form-item label="下发通道" prop="sendChannel">
          <el-select v-model.trim="ruleForm.sendChannel" placeholder="请选择">
              <template v-for="(item,index) in sendChannelList">
                <el-option :key="index" :label="item.key" :value="item.key">{{item.key}}</el-option>
              </template>               
            </el-select>
        </el-form-item>

        <el-form-item label="子类型代码" prop="infoType">
            <el-input v-model.trim="ruleForm.infoType"></el-input>
        </el-form-item>        
   
        <el-form-item style="text-align: right;">
            <el-button type="warning" @click="handleOk" :loading="submitLoading">确 定</el-button>
            <el-button type="warning" plain @click="handleCancel">取 消</el-button>
        </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import { imgPreviewBase64, getImgSize } from '@/common/imgPreviewBase64';
  import { uploadPicNew,queryDictionary,infoUpdate,infoSave } from '@/api/infoType'; 
  export default {
    props: {
      popData: Object,
      typeList:Array
    },
    computed: {
      ruleForm() {
        return this.popData.data
      }
    },
    filters: {
      isBaseImg: function (val) {
        return val.indexOf("base64")==-1 ? window.config.iconPath+val+"?t="+new Date().getTime(): val
      }
    },
    data() {
      let _uploadOption = [      // 图片上传
        {
          width: '80',
          height: '80',
          iconType: 'rsi',
          category:'',
          url: '', //base64编码
        },
        {
          width: '44',
          height: '59',
          iconType: 'rsi_map',
          category:'',
          url: '', //base64编码
        },
      ];
      return {
        iconPath: window.config.iconPath,
        uploadFileBase64: _uploadOption,
        submitLoading: false,
        fileList: [],
        frequencyUnitList: [],
        rules: {
          eventCategory: [
            { required: true, message: '请选择信息所属分类', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入信息类型名称', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          alertCategory: [
            { required: true, message: '请填写告警类别', trigger: 'blur' },
          ],
          frequency: [
            { required: true, message: '请填写默认广播频率', trigger: 'blur' },
          ],
          sendChannel: [
            { required: true, message: '请选择下发通道', trigger: 'change' }
          ],
          infoType: [
            { required: true, message: '请填写子类型代码', trigger: 'blur' },
          ]
        },
        select: {
          sendChannel: '',
          frequencyUnit: '',
        },
        sendChannelList: [
          { id: 1, name: '道路施工/路面打滑' , key: 'DM0202'},
          { id: 2, name: '前方有障碍物' , key: 'DM0203'},
          { id: 3, name: '公交专用车道' , key: 'DM0208'},
          { id: 4, name: '无' , key: 'None'},
        ]
      };
    },
    created(){
      if(this.popData.type=="info-type-update"){
        this.uploadFileBase64.forEach(item=>{
         item.url=item.iconType+"_"+this.ruleForm.alertCategory+".png";
        })
      }
      console.log(this.uploadFileBase64)
      this.init();
    },
    methods: {
      init(){        
        this.initUnintList();
      },
      errorImg(event){
        if(event.target.src.indexOf('rsi_map')==-1){
            event.target.src=this.iconPath+"rsi_0.png";
        }else{
            event.target.src=this.iconPath+"rsi_map_0.png";
        }
      },
      initUnintList(){
        let params = {
          parentCode: 'timeUnit',
        };
        queryDictionary(params).then(res=>{
            if (res.status == 200) {
                this.frequencyUnitList = res.data ? res.data : [];
                if(this.frequencyUnitList.length){                                           
                  this.select.frequencyUnit = this.frequencyUnitList[0];
                }
            }
        });
      },
      getImageTypeIndex(index) {
        this.uploadCurrentIndex = index;
      },
      imgPreview(file) {
        let _this = this;
        imgPreviewBase64(_this, file.raw, function(base64){
          getImgSize(_this, base64).then(res => {
            let _option = _this.uploadFileBase64[_this.uploadCurrentIndex];
            if(res.width == _option.width && res.height == _option.height) {
              _this.uploadFileBase64[_this.uploadCurrentIndex].url = base64;
              _this.uploadFileBase64 = JSON.parse(JSON.stringify(_this.uploadFileBase64));
            }else {
              _this.$message({
                type: 'error',
                duration: '1500',
                message: `请上传尺寸为${_option.width}*${_option.height}的图片`,
                showClose: true
              });
            }
          }).catch(err => {});
        });
      } ,
      frequencyUnitChange(e){
        this.data.frequencyUnit = this.ruleForm.frequencyUnit.key;
      },
      handleCancel() {
        this.$emit("closeDialog");
      },
      handleOk() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {           
            this.upload();
          }
        });
      },
      addFn(){
          let params = this.ruleForm;
          infoSave(params).then(res=>{
            if(res.status == 200) {
              this.$emit("successBack");
              this.$message({
                  type: 'success',
                  duration: '1500',
                  message: "新增信息类型成功 ！",
                  showClose: true
              });
            }    
            this.submitLoading = false;
          }).catch(err => {
          this.submitLoading = false;
        });
      },
      upload(){
        let flag=true;
        this.uploadFileBase64.forEach(item => {
          if(item.url==""){
            flag=false;
          }
          item.category=this.ruleForm.alertCategory;
        })
        if(!flag) {
          this.$message({
              type: 'error',
              duration: '1500',
              message: "请上传全部信息类型图标 ！",
              showClose: true
          });
          return;
        }
        this.submitLoading = true;
        uploadPicNew({picVOList:this.uploadFileBase64}).then(res=>{
            if (res.status == 200) {
                this.ruleForm.icon=res.data;
                if(this.popData.type == 'info-type-add'){
                    this.addFn();
                }else if(this.popData.type == 'info-type-update'){
                    this.uploadFileBase64.forEach(item=>{
                      item.url=item.iconType+"_"+this.ruleForm.alertCategory+".png";
                    })
                    this.updateFn();
                }       
            }else {
              this.submitLoading = false;
            }
        }).catch(err => {
          this.submitLoading = false;
        });
      },
      updateFn(){
          let params = {
              id: this.ruleForm.id,
              code: this.ruleForm.code,
              eventCategory: this.ruleForm.eventCategory,
              name: this.ruleForm.name,
              frequency: this.ruleForm.frequency,
              frequencyUnit: this.ruleForm.frequencyUnit,
              icon:this.ruleForm.icon,
              content: this.ruleForm.content,
              sendChannel: this.ruleForm.sendChannel,
              infoType: this.ruleForm.infoType,
              alertRadius: this.ruleForm.alertRadius,
              alertCategory: this.ruleForm.alertCategory
          };
          infoUpdate(params).then(res=>{
              if (res.status == 200) {
                  this.$emit("successBack");
                  this.$message({
                      type: 'success',
                      duration: '1500',
                      message: "修改信息类型成功 ！",
                      showClose: true
                  });
              }
              this.submitLoading = false;
          }).catch(err => {
            this.submitLoading = false;
          });         
      }
    }
  }
</script>
