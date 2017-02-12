<template>
<div class="container">
  <div class="row">
    <div class="col-md-4">
      <el-date-picker
         v-model="times"
         type="datetimerange"
         :picker-options="pickerOptions"
         placeholder="时间">
      </el-date-picker>
    </div>
    <div class="col-md-8">
      <el-input
         placeholder="输入关键字即可搜索"
         icon="search"
         v-model="query"
         :on-icon-click="handleIconClick">
      </el-input>
    </div>
  </div>
  <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
    <el-table v-loading.body="loading"
       :data="appLogList"
       border
       style="width: 100%">
      <el-table-column :formatter="timeFormatter"
       prop="Time"
       label="时间"
       width="170">
      </el-table-column>
      <el-table-column
       prop="Host"
       label="Host"
       width="70">
      </el-table-column>
      <el-table-column
       prop="Name"
       label="App"
       width="120">
      </el-table-column>
      <el-table-column :formatter="logFormatter"
        prop="Log"
        label="日志">
      </el-table-column>
      <el-table-column label="操作" inline-template width="120">
       <el-button @click.native="queryDetail(row)">查看详情</el-button>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog title="日志详情" v-model="dialogTableVisible">
      <div class="dialogContent">
        <el-button type="text" :loading="prevLoading" @click="queryPrev()">查看上一篇日志</el-button>
        <div v-for="content in detail.prevDetail" v-html="content.Log" class="prevDetail"></div>
        <div v-html="detail.Log"></div>
        <div v-for="content in detail.nextDetail" v-html="content.Log" class="nextDetail"></div>
        <el-button type="text" :loading="nextLoading"  @click="queryNext()">查看下一篇日志</el-button>
      </div>
  </el-dialog>
</div>
</template>

<style>

.container .row {
  margin-bottom: 30px
}

.el-table .cell {
  white-space: pre-line
}

.red{
  color: red;
  font-weight: bold;
  font-size: 18px
}

.dialogContent{
  line-height: 24px;
  padding: 20px;
  height: 800px;
  word-wrap: break-word;
  background: black;
  color: #ffffff;
  overflow-y: auto;
}

.prevDetail{
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #dedede;
}
.nextDetail{
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid #dedede;
}

</style>

<script>
import _ from 'lodash'
import infiniteScroll from 'vue-infinite-scroll'
import appLogService from 'SERVICE/appLogService'
import dateUtil from 'LIB/dateUtil'

const pickerOptions = {
  shortcuts: [
    {
      text: 'Last Hour',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: 'Last 12 Hours',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 12);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: 'Last Day',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: 'Last 3 Days',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: 'Last week',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: 'Last month',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: 'Last 3 months',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit('pick', [start, end]);
      }
    }
  ]
}
const DEFAULT_LIMIT = 10

export default {
  name: 'Search',
  components: {
  },
  directives: {infiniteScroll},
  data () {
    return {
      pickerOptions,
      times: [new Date().getTime() - 3600 * 1000 * 6, new Date().getTime()],
      query: '',
      appLogList: [],
      busy: false,
      loading: false,
      prevLoading: false,
      nextLoading: false,
      dialogTableVisible: false,
      appLogTotal: 0,
      detail: {}
    }
  },
  methods: {
    timeFormatter(row, column) {
      return dateUtil.format(row.Time / 1000000)
    },
    logFormatter(row, column) {
      var arr = row.Log.split('\n')
      var text = arr[0]
      var _this = this
      _.each(arr, function (list, index) {
        if (list.indexOf(_this.query)>=0) {
          text = list
          return
        }
      });
      return text
    },
    handleIconClick(ev) {
      const param = {
        page: 0,
        limit: DEFAULT_LIMIT
      }
      var _this = this
      this.httpLogs(param, function (data) {
        _this.appLogTotal = data.Total
        _this.appLogList = data.List
      })
    },
    queryDetail(rowData) {
      this.dialogTableVisible = true
      var detail = _.clone(rowData)
      detail.Log = detail.Log.replace(/\n/ig,"<br/>")
      detail.Log = detail.Log.replace(this.query,"<span class='red'>" +this.query+ "</span>")
      this.detail = detail
      this.detail.prevDetail = []
      this.detail.nextDetail = []
    },
    queryPrev() {
      this.prevLoading = true
      var param = {
        direction: -1,
        id: this.detail.Id
      }
      if (this.detail.prevDetail.length) {
        param.id = this.detail.prevDetail[0].Id
      }
      this.context(param)

    },
    queryNext() {
      this.nextLoading = true
      var param = {
        direction: 1,
        id: this.detail.Id
      }
      if (this.detail.nextDetail.length) {
        param.id = this.detail.nextDetail[this.detail.nextDetail.length-1].Id
      }
      this.context(param)
    },
    loadMore: function() {
      if (this.appLogList.length >= this.appLogTotal) {
        return
      }
      this.busy = true;

      const param = {
        page: parseInt(this.appLogList.length / DEFAULT_LIMIT),
        limit: DEFAULT_LIMIT
      }
      var _this = this
      this.httpLogs(param, function (data) {
        _this.appLogList = _this.appLogList.concat(data.List)
      })
    },
    httpLogs (param, suc) {
      this.loading = true;
      param.startTime = new Date(this.times[0]).getTime() * 1000000
      param.endTime = new Date(this.times[1]).getTime() * 1000000
      param.query = this.query
      appLogService.list(param).then((data) => {
        this.loading = false
        suc(data)
      }).catch ((error) => {
        this.loading = false
        if (error.statusText === 'error') {
          this.$message('网络错误，请稍候再试');
        }
      })
    },
    context: function (param) {
      appLogService.context(param).then((data) => {
        var content = []
        _.map(data.List, (item) => {
          item.Log = item.Log.replace(/\n/ig,"<br/>")
          item.Log = item.Log.replace(this.query,"<span class='red'>" +this.query+ "</span>")
          content.push(item)
        })
        if (param.direction > 0) {
          this.nextLoading = false
          this.detail.nextDetail = this.detail.nextDetail.concat(content)
        } else {
          this.prevLoading = false
          this.detail.prevDetail = this.detail.prevDetail.concat(content)
        }
      }).catch ((error) => {
        if (param.direction > 0) {
          this.nextLoading = false
        } else {
          this.prevLoading = false
        }
        if (error.statusText === 'error') {
          this.$message('网络错误，请稍候再试');
        }
      })
    }
  },
  mounted: function () {
  }
}
</script>
