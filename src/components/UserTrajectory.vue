<template>
    <div class="container">
        <div class="row">
            <div class="col-md-8">
                <el-input
                        placeholder="输入用户ud 即可搜索"
                        icon="search"
                        v-model="query"
                        :on-icon-click="handleIconClick">
                </el-input>
            </div>
        </div>
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
            <el-table v-loading.body="loading"
                      :data="userList"
                      border
                      style="width: 100%">
                <el-table-column
                        prop="Time"
                        label="时间"
                        width="170">
                </el-table-column>
                <el-table-column
                        prop="Host"
                        label="动作">
                </el-table-column>
                <el-table-column
                        prop="TimeConsuming"
                        label="耗费时间"
                        width="170">
                </el-table-column>
                <el-table-column
                        prop="TimeConsuming"
                        label="系统版本">
                </el-table-column>
                <el-table-column
                        prop="TimeConsuming"
                        label="网络状态">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<style>
</style>

<script>
    export default {
        name: 'Add',
        mounted: function () {
        },
        data () {
            return {
                loading: false
            }
        }
    }
</script>
