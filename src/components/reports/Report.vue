<template>
  <!-- 顶部面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    <el-breadcrumb-item>数据报表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片 -->
  <el-card class="box-card">
    <el-row :gutter="12">
      <el-col :span="8">
        <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
        <div id="main" style="width: 800px;height:500px;"></div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { defineComponent, getCurrentInstance, onMounted } from 'vue'
// 引入echarts
import * as echarts from 'echarts'
import _ from 'lodash'

export default defineComponent({
  name: 'Report',
  setup() {
    const { proxy } = getCurrentInstance()

    // 需要合并的数据
    const options = {
      title: {
        text: '用户来源',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#E9EEF3',
          },
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          boundaryGap: false,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
    }

    onMounted(async () => {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))

      const { data: res } = await proxy.$http.get('reports/type/1')
      if (res.meta.status != 200)
        return proxy.$message.error('获取数据失败' + res.meta.msg)
      console.log(res)

      // 合并数据
      const mergeData = _.merge(res.data, options)

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(mergeData)
    })
    return {}
  },
})
</script>

<style scoped></style>
