<!-- Komponenta za prikaz grafa u aplikaciji -->
<!-- Dobiva potrebne podatke iz ChartIndex.vue komponente -->
<template>
  <canvas id="pie-chart" class="my-chart"></canvas>
</template>

<style scoped>
.my-chart {
  min-height: 500px;
}
@media only screen and (max-width: 600px) {
  .my-chart {
    min-height: 300px;
  }
}
</style>

<script>
import { Chart } from 'chart.js'

export default {
  name: 'PieChart',
  props: ['PieChartData'],
  mounted () {
    this.createPieChart('pie-chart')
  },
  methods: {
    createPieChart (chartId) {
      const ctx = document.getElementById(chartId)
      const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(this.PieChartData),
          datasets: [{
            label: 'Number of changes on each device',
            backgroundColor: ['#005f73', '#0a9396', '#94d2bd', '#e9d8a6', '#ee9b00', '#ca6702', '#bb3e03', '#ae2012', '#9b2226'],
            data: Object.values(this.PieChartData)
          }]
        },
        options: {
          title: {
            display: true,
            text: 'Usage of each device on your Sirius account'
          },
          responsive: true,
          maintainAspectRatio: false
        }
      })
      return myChart
    }
  },
  watch: {
    PieChartData: function (val) {
      this.createPieChart('pie-chart')
    }
  }
}
</script>
