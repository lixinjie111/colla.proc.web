<template>

<!-- :model="ruleForm" -->
  <el-dialog
    :title="popData.title"
    width="30%"
    :before-close="handleCancel"
    :visible.sync="popData.visible"
    class="yk-left"
    >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="mini" label-width="120px">
        
        <el-form-item label="信息所属分类" prop="eventCategory">
            <el-select v-model.trim="ruleForm.eventCategory" placeholder="请选择">

              <template v-for="(item,index) in typeList">
                <el-option :key="index" :label="item.name" :value="item.key">{{item.name}}</el-option>
              </template>
              
            </el-select>
        </el-form-item>

        <el-form-item label="告警类别(国标)" v-if="ruleForm.eventCategory == 'TI02'">
             <el-input v-model.trim="ruleForm.alertCategory"></el-input>
        </el-form-item>

        <el-form-item label="信息类型名称" prop="name">
            <el-input v-model.trim="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="信息类型图标" prop="icon">
                       
          <el-input placeholder="请上传信息类型图标" v-model.trim="ruleForm.icon">
            <template slot="append">
              <label class="yk_input_append" for="xFile">上传</label>
            </template>
          </el-input>

          <form>
              <input ref="refUploadInput" class="yk-file" type="file" id="xFile" @change="selectFile">
          </form>

        </el-form-item>

        <el-form-item label="默认广播频率" prop="frequency">
            <el-input v-model.trim="ruleForm.frequency">             
            
              <template slot="append">
                <select class="yk-w-60 yk-border-left-none yk-input-select" v-model.trim="ruleForm.frequencyUnit" placeholder="请选择">
                    <option v-for="(item,index) in frequencyUnitList" :key="index" :value="item.key">{{item.name}}</option>
                </select>
              </template>
            
            </el-input>
        </el-form-item>

        <el-form-item label="默认信息内容" prop="content">
            <el-input type="textarea" v-model.trim="ruleForm.content"></el-input>
        </el-form-item>

        <el-form-item label="默认影响范围" prop="alertRadius">
            <el-input-number v-model.trim="ruleForm.alertRadius" controls-position="right" :min="1" :max="1024"></el-input-number>
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
  import axios from 'axios'

  export default {
    props: {
      popData: Object
    },
    computed: {
      ruleForm() {
        return this.popData.data
      }
    },
    data() {
      return {
        submitLoading: false,
        uploadPath: window.cfg.url + 'event/info/uploadPic',
        fileList: [],
        typeList: [
          // { id: 1 ,name: '车辆异常',value: 1},
          // { id: 2 ,name: '道路异常',value: 2},
          // { id: 3 ,name: '交通管制',value: 3},
          // { id: 4 ,name: '天气信息',value: 4},
        ],
        frequencyUnitList: [],
        // ruleForm: {
        //   name: '',
        //   eventCategory: '',
        //   frequency: '',
        //   frequencyUnit: '',
        //   delivery: false,
        //   content: '',
        //   infoType: '',
        // },
        rules: {
          eventCategory: [
            { required: true, message: '请选择信息所属分类', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入信息类型名称', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请输入默认信息内容', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          icon: [
            { required: true, message: '请上传信息类型图标', trigger: 'blur' },
            { message: '请上传信息类型图标', trigger: 'input' },

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
        ]
      };
    },
    created(){
      this.init();
    },
    methods: {
      init(){        
        this.initTypeList();
        this.initUnintList();
      },
      initTypeList(){
        let url = 'common/queryDictionary';
        let params = {
          parentCode: 'trafficType',
        };
        this.$api.post( url,params,
            response => {
                if (response.status >= 200 && response.status < 300) {

                    this.typeList = response.data ? response.data : [];
                    
                } else {                     
                    this.$message.error( "获取类型失败 ！"); 
                }
            }
        );
      },
      initUnintList(){
        let url = 'common/queryDictionary';
        let params = {
          parentCode: 'timeUnit',
        };
        this.$api.post( url,params,
            response => {
                if (response.status >= 200 && response.status < 300) {

                    this.frequencyUnitList = response.data ? response.data : [];
                    if(this.frequencyUnitList.length){                                           
                      this.select.frequencyUnit = this.frequencyUnitList[0];
                    }
                   
                } else {                     
                    this.$message.error("获取单位失败 ！"); 
                }
            }
        );
      },
      selectFile(e){
        this.$refs.ruleForm.clearValidate('icon');
        let file = e.target.files[0];
        this.ruleForm.icon = file.name;
        let param = new FormData(); //创建form对象
        param.append('upfile',file); //通过append向form对象添加数据
        //  console.log('upload --------------- ' + this.param.get('upfile')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去

        // this.validator.isFile = true;
        this.uploadFile(param);
      },
      uploadFile(formData){
        let url = this.uploadPath;
        let config = {
          headers:{'Content-Type':'multipart/form-data'}
        };
        axios.post(url, formData, config)
          .then(response=>{
              console.log('文件上传结果 ： -------------- ' + JSON.stringify(response.data) );              

              if(response.data.status == '200'){
                  this.ruleForm.icon = response.data.data;
                    // 隐藏批量导入面板
                  this.$message.success('上传成功！');
              }

              if(response.data.status != '200'){              
                  this.$message.error('上传失败！');
                  console.log('error data --- ' + JSON.stringify(response.data.data))
              }
          }
        ).catch( (error) => {

            let msg =  '导入失败  ！' + error;
            console.log(msg)

        }) ; 
      },
  
      frequencyUnitChange(e){
        this.data.frequencyUnit = this.ruleForm.frequencyUnit.key;
      },
      handleCancel() {
        this.$emit("closeDialog");
      },
      handleOk() {
        // this.$refs.ruleForm.submitForm();
        // console.log("确定-----");
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {           
            this.submitLoading = true;
            if(this.popData.type == 'info-type-add'){
                this.addFn();
            }else if(this.popData.type == 'info-type-update'){
                this.updateFn();
            }
          }
        });
      },
      addFn(){
          let url = 'event/info/save';
          // let params = {
          //     eventCategory: data.eventCategory,
          //     name: data.name,

          // };
          let params = this.ruleForm;
          console.log(params);
          this.$api.post( url,params,
              response => {
                  if (response.status >= 200 && response.status < 300) {

                      this.$emit("successBack");
                      this.$message.success("新增信息类型成功 ！"); 
                      this.submitLoading = false;
                  } else {                     
                      this.$message.error("新增信息类型失败 ！"); 
                  }
              }
          );
      },
      updateFn(){

          let url = 'event/info/update';
          let params = {
              id: this.ruleForm.id,
              code: this.ruleForm.code,
              eventCategory: this.ruleForm.eventCategory,
              name: this.ruleForm.name,
              frequency: this.ruleForm.frequency,
              frequencyUnit: this.ruleForm.frequencyUnit,
              icon: this.ruleForm.icon,
              content: this.ruleForm.content,
              sendChannel: this.ruleForm.sendChannel,
              infoType: this.ruleForm.infoType,
              alertRadius: this.ruleForm.alertRadius,
              alertCategory: this.ruleForm.alertCategory
          };
          this.$api.post( url,params,
              response => {
                  if (response.status == 200) {

                      this.$emit("successBack");
                      this.$message.success("修改信息类型成功 ！"); 
                      this.submitLoading = false;
                  } else {                     
                      this.$message.error("修改信息类型失败 ！"); 
                  }
              }
          );
      }
    }
  }
</script>
<style scoped>
.yk-file{
    position: absolute;
    clip: rect(0 0 0 0);
}
.yk-unit{
  width: 90px;
  /* width: 100px;
  float: right; */
}

.yk_input_append{
  /* border: 1px solid #DCDFE6!important; */
  /* padding: 0 20px!important; */
  padding-top: 5px;
  padding-left: 20px;
  padding-right: 20px;
}


</style>
