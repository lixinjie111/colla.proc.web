<template>
  <div class="c-wrapper-20">
    <el-form :inline="true" size="mini">
      <el-form-item label="信息类型：">
        <el-input v-model.trim="search.eventType"></el-input>
      </el-form-item>
      <el-form-item label="信息状态：">
        <el-select v-model="search.status" placeholder="请选择">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.name"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间：">
        <el-date-picker
          v-model="search.publishTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="信息来源：">
        <el-select v-model="search.datasource" placeholder="请选择">
          <el-option
            v-for="item in datasourceList"
            :key="item.value"
            :label="item.name"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="handleSearch">查询</el-button>
        <el-button type="warning" plain @click="handleFlush">刷新</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="table"
      class="c-mb-70"
      max-height="724"
      :data="dataList"
      border
      stripe
      :header-cell-style="{background:'#E6E6E6',color:'#606266',border: '0px'}"
      v-loading="isLoading"
    >
      <el-table-column label="序号" type="index">
        <template slot-scope="scope">
          <span>{{scope.$index + paging.index * paging.size + 1}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="taskCode" label="信息编号" min-width="13%"></el-table-column>

      <el-table-column prop="eventName" label="信息类型" min-width="6%"></el-table-column>

      <el-table-column prop="status" label="信息状态" min-width="6%">
        <template slot-scope="scope">
          <!-- {{scope.row.status}} -->
          <span v-show="scope.row.status == 1">有效</span>
          <span v-show="scope.row.status == 2">失效</span>
          <span v-show="scope.row.status == 3">完成</span>
        </template>
      </el-table-column>

      <el-table-column prop="longitude,latitude " label="中心位置" min-width="15%">
        <template slot-scope="scope">{{scope.row.longitude ? parseFloat(scope.row.longitude).toFixed(8) : '--'}} , {{scope.row.latitude ? parseFloat(scope.row.latitude).toFixed(8) : '--'}}</template>
      </el-table-column>

      <el-table-column label="实际开始时间" min-width="12%">
        <template slot-scope="scope">{{TDate.formatTime(scope.row.beginTime)}}</template>
      </el-table-column>

      <el-table-column label="实际结束时间" min-width="12%">
        <template slot-scope="scope">{{scope.row.expirationTime==0?"--":TDate.formatTime(scope.row.expirationTime)}}</template>
      </el-table-column>

      <el-table-column label="信息内容" min-width="15%">
         <template slot-scope="scope">
            <el-popover placement="top" width="350" trigger="hover" popper-class="c-table-popover">
                <div class="c-table-popover-content" v-text="scope.row.content"></div>
                <p class="c-table-popover-text-2" slot="reference" v-text='scope.row.content'></p>
            </el-popover>
        </template>
        <!-- <template slot-scope="scope">{{scope.row.content ? scope.row.content : '--'}}</template> -->
      </el-table-column>

      <el-table-column prop="sendNumber" label="下发次数" min-width="6%"></el-table-column>

      <el-table-column prop="datasource" label="信息来源" min-width="8%">
        <template slot-scope="scope">
          <span v-for="item in datasourceList" :key="item.key">
             <span v-if="item.key==scope.row.datasource">{{item.name}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column min-width="5%" label="操作">
        <template slot-scope="scope">
          <el-button
            @click.native="checkDetail(scope.row)"
            size="small"
            icon="el-icon-view"
            circle
            type="warning"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row class="c-page">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="this.paging.size"
        :total="this.paging.total"
        @current-change="pagingChange"
      ></el-pagination>
    </el-row>
    <info-history-detail v-if="isShow" :taskCode="taskCode" :detailData="detailData" :content="detailContent" @infoHistoryBack="infoHistoryBack"></info-history-detail>
  </div>
</template>
<script>
import TDate from "@/common/date.js";
import InfoHistoryDetail from "./components/infoHistoryDetail";
import { taskQueryPage,queryDictionary} from '@/api/infoHistory'; 
export default {
  components: {
    InfoHistoryDetail
  },
  data() {
    return {
      dataList: [],
      TDate: TDate,
      search: {
        eventType: "",
        status: "",
        publishTime: "",
        startTime: "",
        endTime: "",
        datasource: ""
      },
      paging: {
        index: 0,
        size: 10,
        total: 0
      },
      statusList: [
        { id: 1, name: "有效", key: 1 },
        { id: 2, name: "失效", key: 2 },
        { id: 3, name: "完成", key: 3 }
      ],
      datasourceList: [],
      oldTime: null,
      timeInterval: 400,
      isLoading: false,
      detailData: [],
      detailContent: '',
      isShow: false,
      taskCode: ''
    };
  },
  created() {
    this.initDatasourceList();
    this.init();
  },
  mounted() {
  },
  methods: {
    handleScroll(el) {
      console.log(el);
    },
    init() {
      this.initSearch();
      this.initPaging();
      this.initData();
    },
    initPaging() {
      this.paging.index = 0;
      this.paging.total = 0;
      this.paging.size = 10;
    },
    initSearch() {
      this.search = {
        eventType: "",
        status: "",
        publishTime: "",
        startTime: "",
        endTime: "",
        datasource: ""
      };
    },
    initData(type) {
      this.isLoading = true;
      let params = {
        // code: this.search.code,
        eventType: this.search.eventType,
        status: this.search.status,
        beginTime: this.search.startTime,
        endTime: this.search.endTime,
        datasource: this.search.datasource,
        page: {
          pageIndex: this.paging.index,
          pageSize: this.paging.size
        }
      };
     taskQueryPage(params).then(res => {
        if (res.status == 200) {
          this.dataList = res.data.list;
          this.$refs.table.bodyWrapper.scrollTop = 0;
          this.paging.total = res.data.totalCount;
        }
        this.isLoading = false;
      });
    },
    initDatasourceList() {
      let params = {
        parentCode: "trafficSource"
      };
      queryDictionary(params).then(res=>{
        if (res.status == 200) {
          this.datasourceList = res.data ? res.data : [];
        }
      });
    },
    handleSearch() {
      if (Array.isArray(this.search.publishTime)) {
        let start = this.search.publishTime[0];
        let end = this.search.publishTime[1];
        this.search.startTime = TDate.dateToMs(start);
        this.search.endTime = TDate.dateToMs(end);
      }
      this.initPaging();
      this.initData();
    },
    handleFlush() {
      this.initSearch();
      this.initData();
    },
    pagingChange(value) {
      this.paging.index = value - 1;
      this.initData();

      // this.saveWater();
    },

    // saving
    saveWater() {
      let newTime = new Date().getTime();

      if (!this.oldTime) {
        this.oldTime = newTime;
      }

      let intval = this.newTime - this.oldTime;
      if (intval > this.timeInterval) {
        this.oldTime = newTime;

        this.initData();
      }
    },
    saveWater2() {
      let timer = null;
    },
    // 查看详情
    checkDetail(scope) {
      let info = Object.assign({},scope);
      info.beginTime=TDate.formatTime(info.beginTime);
      info.createTime=TDate.formatTime(info.createTime);
      info.endTime=TDate.formatTime(info.endTime);
      info.expirationTime=info.expirationTime==0?"--":TDate.formatTime(info.expirationTime);//updateTime
      let newArr;
      let longlat;
      
      newArr = [info];
      longlat = newArr.map(x =>(parseFloat(x.longitude).toFixed(8) + ',' + parseFloat(x.latitude).toFixed(8)));
      this.isShow = true;
      this.detailContent = info.content;
      let arr = [];
      Object.keys(info).forEach(x => {
        arr.push({
          'name': (_ => {
              if (x === 'taskCode') {
                return '信息编号';
              } else if (x === 'eventName') {
                return '信息类型';
              } else if (x === 'eventCode') {
                return '事件编号';
              } else if (x === 'createTime') {
                return '创建时间';
              } else if (x === 'longitude') {
                return '事件发生位置';
              } else if (x === 'sendNumber') {
                return '累计发送次数';
              } else if (x === 'beginTime') {
                return '实际开始时间';
              } else if (x === 'expirationTime') {//updateTime
                return '实际结束时间';
              } else if (x === 'endTime') {
                return '计划结束时间';
              } 
          })(),
          'value': (_ => {
            if (x === 'longitude') {
              return info[x] = longlat[0];
            } else {
                return info[x]
            }
          })()
        })
      });
      arr = arr.filter(x => x.name !== undefined);
      this.splitArr(arr);
      this.taskCode = info.taskCode;
    },
    splitArr(data) {
        let proportion = 3;
        let num = 0;
        this.detailData = [];
        for (let i = 0; i < data.length; i ++) {
          if (i % proportion === 0 && i !== 0) {
             this.detailData.push({
                'title': '',
                'list': data.slice(num, i)
            });
            num = i;
          }
          if (i + 1 === data.length) {
            this.detailData.push({
                'title': '',
                'list': data.slice(num, (i+1))
            });
          }
        }
        return this.detailData;
    },
    infoHistoryBack() {
      this.isShow = false;
    }
  }
};
</script>


