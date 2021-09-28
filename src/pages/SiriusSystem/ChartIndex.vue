<!-- Komponenta za računanje potrebnih informacija za prikaz u grafu, kao što su broj korištenja uređaja i filtriranje uređaja po kućama -->
<!-- Šalje informacije u PieChart.vue komponentu -->
<template>
  <div>
    <div class="q-pl-md q-pt-md row">
      <q-select
        style="width: 220px"
        outlined
        clearable
        label="Filter stats by house"
        v-model="selectedOption"
        :options=allHouses
        @input="onChange()"
      />
    </div>

    <q-card class="bg-white chart-container" inline>
      <q-card-section class="bg-blue-grey-5">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6 text-white text-center">Statistics</div>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <PieChart
          :PieChartData="chartData"
        />
      </q-card-section>
      <q-btn @click="onReset()" size="sm" style="margin: 10px" label="RESET DATA" class="bg-blue-grey-2"/>
    </q-card>

  </div>

</template>

<script>
import PieChart from './../../components/PieChart'

export default {
  data () {
    return {
      selectedOption: '',
      allHouses: [],
      devices: [],
      changes: [],
      devicesInHouse: {},
      devicesData: {},
      chartData: {}
    }
  },
  mounted: async function () {
    const deviceData = {}

    await this.$db.collection('homes').get().then((rows) => {
      rows.forEach((row) => {
        this.allHouses.push(row.data().name)
      })
    })
    this.allHouses.forEach(house => {
      this.devicesInHouse[house] = []
    })

    await this.$db.collection('devices').get().then((rows) => {
      rows.forEach((row) => {
        deviceData[row.data().name] = row.data().numberOfChanges
        this.devices.push(row.data().name)
        this.changes.push(row.data().numberOfChanges)

        this.devicesInHouse[row.data().roomID.homeID.name].push(row.data().name)
      })

      this.devicesData = deviceData
      this.chartData = deviceData
    })
  },
  methods: {
    onReset: function () {
      this.$q.dialog({
        title: 'Reset',
        message: 'Are you sure you want to reset data?',
        ok: true,
        cancel: true
      }).onOk(async () => {
        const uids = []
        await this.$db.collection('devices').get().then((rows) => {
          rows.forEach((row) => {
            uids.push(row.id)
          })
        })
        for (let i = 0; i < uids.length; i++) {
          await this.$db.collection('devices').doc(uids[i]).update({
            numberOfChanges: 0
          })
        }
      })
    },
    onChange () {
      console.log(this.selectedOption)
      // selected option is null when cleared
      if (this.selectedOption != null) {
        const filteredData = {}
        this.devicesInHouse[this.selectedOption].forEach(device => {
          filteredData[device] = this.devicesData[device]
        })

        this.chartData = filteredData
      } else {
        this.chartData = this.devicesData
      }
    }
  },

  components: {
    PieChart
  }
}
</script>

<style scoped>
.chart-container {
  max-width: 700px;
  margin: 30px 0 0 15px;
}
@media only screen and (max-width: 600px) {
  .chart-container {
    margin: 10px 0 0;
  }
}
</style>
