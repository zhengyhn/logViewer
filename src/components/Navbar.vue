<template>
  <el-menu theme="light" default-active="/" class="el-menu-demo logo" mode="horizontal" router=true>
    <el-menu-item index="/">日志分析系统</el-menu-item>
    <el-menu-item index="/user/trajectory">用户轨迹</el-menu-item>
    <el-menu-item index="/anyConfig/add">报警配置</el-menu-item>
  </el-menu>
</template>


<!--<script>-->
  <!--export default {-->
    <!--methods: {-->
      <!--handleSelect(key, keyPath) {-->
        <!--console.log(key, keyPath);-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</script>-->

<style>
  .el-menu{
    margin-bottom: 30px;
  }
  .logo{
    padding-left: 280px;
    background-image: url(../assets/logo.png);
    background-repeat: no-repeat;
    background-size: 250px;
  }
</style>