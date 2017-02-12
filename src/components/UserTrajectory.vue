<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <el-input
                        placeholder="输入用户ud 即可搜索"
                        icon="search"
                        v-model="queryUd"
                        :on-icon-click="handleIconClick">
                </el-input>
            </div>
        </div>
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
            <el-table v-loading.body="loading" :row-class-name="formatClass"
                      :data="userList"
                      border
                      style="width: 100%">
                <el-table-column :formatter="timeFormatter"
                        prop="Time"
                        label="时间"
                        width="170">
                </el-table-column>
                <el-table-column
                        prop="Action"
                        label="动作">
                </el-table-column>
                <el-table-column :formatter="statusFormatter"
                        prop="StatusCode"
                        label="请求状态">
                </el-table-column>
                <el-table-column
                        prop="CostTime"
                        label="耗费时间(毫秒)">
                </el-table-column>
                <el-table-column
                        prop="OS"
                        label="系统">
                </el-table-column>
                <el-table-column
                        prop="Version"
                        label="系统版本">
                </el-table-column>
                <el-table-column
                        prop="NetWorkState"
                        label="网络状态">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<style scoped>
    .red{
        background: red;
        font-size: 14px;
        font-weight: 100;
    }
</style>

<script>
    import infiniteScroll from 'vue-infinite-scroll'
    import appLogService from 'SERVICE/appLogService'
    import dateUtil from 'LIB/dateUtil'

    const DEFAULT_LIMIT = 10

    export default {
        name: 'Add',
        mounted: function () {
        },
        directives: {infiniteScroll},
        data () {
            return {
                queryUd: '',
                listTotal: 0,
                userList: [],
                loading: false
            }
        },
        methods: {
            timeFormatter(row, column) {
                return dateUtil.format(row.Time / 1000000)
            },
            statusFormatter(row, column) {
                if (row.StatusCode === '200') {
                    return '成功（' + row.StatusCode + '）'
                } else {
                    return '失败（' + row.StatusCode + '）'
                }
            },
            formatClass(row, index) {
                if (row.StatusCode !== '200') {
                    return 'red'
                }
            },
            handleIconClick(ev) {
                var _this = this
                var param = {
                    page: 0,
                    limit: DEFAULT_LIMIT
                }
                this.httpUser(param, function (data) {
                    _this.listTotal = data.Total
                    _this.userList = data.List
                })
            },
            loadMore () {
                if (this.userList.length >= this.listTotal) {
                    return
                }
                this.busy = true;
                var _this = this
                var param = {
                    page: parseInt(this.userList.length / DEFAULT_LIMIT),
                    limit: DEFAULT_LIMIT
                }
                this.httpUser(param, function (data) {
                    _this.userList = _this.userList.concat(data.List)
                })
            },
            httpUser (param,suc) {
                this.loading = true;
                appLogService.userHa({ud: this.queryUd, page: param.page, limit: param.limit}).then((data) => {
                    this.loading = false
                    suc(data)
                }).catch ((error) => {
                        this.loading = false;
                    if (error.statusText === 'error') {
                        this.$message('网络错误，请稍候再试');
                    }
                })
            }
        }
    }
</script>
