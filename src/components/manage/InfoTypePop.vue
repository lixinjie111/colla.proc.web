<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="mini" label-width="120px" class="demo-ruleForm yk-left">
        
        <el-form-item label="信息所属分类" prop="eventCategory">
            <el-select size="mini" v-model="data.eventCategory" placeholder="请选择">

              <template v-for="(item,index) in typeList">
                <el-option :key="index" :label="item.name" :value="item.key">{{item.name}}</el-option>
              </template>
              
            </el-select>
        </el-form-item>

        <el-form-item label="信息类型名称" prop="name">
            <el-input size="mini" v-model="data.name"></el-input>
        </el-form-item>

        <el-form-item label="信息类型图标" required>
                       
          <el-input size="mini" placeholder="请输入内容" v-model="data.icon">
            <template slot="append">
              <label class="yk_input_append" for="xFile">上传</label>
            </template>
          </el-input>

          <form>
              <input ref="refUploadInput" class="yk-file" type="file" id="xFile" @change="selectFile">
          </form>

        </el-form-item>

        <el-form-item label="默认广播频率" prop="frequency">
            <el-input size="mini" v-model="data.frequency">             
            
              <template slot="append">
                <select class="yk-w-80 yk-border-left-none" v-model="data.frequencyUnit" placeholder="请选择">
                    <option v-for="(item,index) in frequencyUnitList" :key="index" :value="item.key">{{item.name}}</option>
                </select>
              </template>
            
            </el-input>
        </el-form-item>

        <el-form-item label="默认信息内容" prop="content">
            <el-input type="textarea" v-model="data.content"></el-input>
        </el-form-item>

        <el-form-item label="下发通道" prop="">
          <el-select size="mini" v-model="data.sendChannel" placeholder="请选择">
              <template v-for="(item,index) in sendChannelList">
                <el-option :key="index" :label="item.name" :value="item.key">{{item.name}}</el-option>
              </template>               
            </el-select>
        </el-form-item>

        <el-form-item label="子类型代码" prop="name">
            <el-input size="mini" v-model="data.infoType"></el-input>
        </el-form-item>
        
   
    </el-form>
</template>

<script>
  import axios from 'axios'

  export default {
    props: ['data'],
    data() {
      return {
        
        uploadPath: window.cfg.url + 'event/info/uploadPic',
        fileList: [],
        typeList: [
          // { id: 1 ,name: '车辆异常',value: 1},
          // { id: 2 ,name: '道路异常',value: 2},
          // { id: 3 ,name: '交通管制',value: 3},
          // { id: 4 ,name: '天气信息',value: 4},
        ],
        frequencyUnitList: [],
        ruleForm: {
          name: '',
          eventCategory: '',
          frequency: '',
          frequencyUnit: '',
          delivery: false,
          content: '',
        },
        rules: {
          eventCategory: [
            { required: true, message: '请选择信息所属分类', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入信息类型名称', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          icon: [
            { required: true, message: '请上传信息类型图标', trigger: 'blur' },
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
          // region: [
          //   { required: true, message: '请选择活动区域', trigger: 'change' }
          // ],
          // date1: [
          //   { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          // ],
          // date2: [
          //   { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          // ],
          // type: [
          //   { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          // ],
          // resource: [
          //   { required: true, message: '请选择活动资源', trigger: 'change' }
          // ],
          // desc: [
          //   { required: true, message: '请填写活动形式', trigger: 'blur' }
          // ]
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
                    this.$message( "获取类型失败 ！"); 
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
                    this.$message("获取单位失败 ！"); 
                }
            }
        );
      },
      selectFile(e){

        let file = e.target.files[0];
        this.data.icon = file.name;
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
                  this.data.icon = response.data.data;
                    // 隐藏批量导入面板
                  this.$message('上传成功！');
              }

              if(response.data.status != '200'){
              
                  this.$message('上传失败！');
                  console.log('error data --- ' + JSON.stringify(response.data.data))

              }


          }
        ).catch( (error) => {

            let msg =  '导入失败  ！' + error;
            console.log(msg)

        }) ; 
      },
  
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      frequencyUnitChange(e){
        this.data.frequencyUnit = this.ruleForm.frequencyUnit.key;
      }
    },
    created(){
      this.init();
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
