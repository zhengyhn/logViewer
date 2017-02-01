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
         placeholder="任意内容"
         icon="search"
         v-model="query"
         :on-icon-click="handleIconClick">
      </el-input>
    </div>
  </div>
  <div class="row">
    <div class="col-md-12" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
      <el-table
         :data="appLogList"
         border
         style="width: 100%">
        <el-table-column
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
        <el-table-column
          prop="Log"
          label="日志">
        </el-table-column>
      </el-table>
    </div>
  </div>
</div>
</template>

<style>

.container .row {
  margin-bottom: 30px
}

.el-table .cell {
  white-space: pre-line
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
      appLogTotal: 0
    }
  },
  methods: {
    handleIconClick(ev) {
      console.log(this.times, this.query);
      const param = {
        startTime: new Date(this.times[0]).getTime() * 1000000,
        endTime: new Date(this.times[1]).getTime() * 1000000,
        query: this.query,
        page: 0,
        limit: DEFAULT_LIMIT
      }
      appLogService.list(param).then((data) => {
        console.log(data.Total, data.List)
        this.appLogTotal = data.Total
        this.appLogList = _.map(data.List, (item) => {
          item.Time = dateUtil.format(item.Time / 1000000)
          return item
        })
      })
    },
    loadMore: function() {
      console.log(this.appLogList.length, this.appLogTotal)
      if (this.appLogList.length >= this.appLogTotal) {
        return
      }
      this.busy = true;

      const param = {
        startTime: new Date(this.times[0]).getTime() * 1000000,
        endTime: new Date(this.times[1]).getTime() * 1000000,
        query: this.query,
        page: parseInt(this.appLogList.length / DEFAULT_LIMIT),
        limit: DEFAULT_LIMIT
      }
      appLogService.list(param).then((data) => {
        console.log(data.Total, data.List)
        const newList = _.map(data.List, (item) => {
          item.Time = dateUtil.format(item.Time / 1000000)
          return item
        })
        this.appLogList = this.appLogList.concat(newList)
      })
    }
  },
  mounted: function () {
  }
}
</script>
