<!-- Komponenta za prikaz uređaja -->
<!-- Čita potrebne podatke iz baze te ih prikazuje korisniku na ekran, radi vrlo slično kao HomeIndex.vue i RoomIndex.vue komponente -->
<!-- Također ima funkciju za filtriranje prostorija po virtualnim kućama - linije 18-28 -->
<template>
  <div class="column">

    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el label="Homes" icon="apartment" to="/homes" />
        <q-breadcrumbs-el label="Rooms" icon="chair" to="/rooms" />
        <q-breadcrumbs-el label="Devices" icon="print" />
      </q-breadcrumbs>
    </div>

    <div class="q-pa-md row items-start q-gutter-md items-center">
      <div>
        <q-select
          clearable
          style="width: 200px"
          outlined
          v-model="select"
          option-value="id"
          option-label="name"
          :options=homes
          label="Filter by the house"
          @input="findSelectedHouse()"
        />
      </div>
      <q-btn @click="onNewDevice()" icon="playlist_add" label="Add new device" color="primary"/>
      <q-btn @click="onScanDevices()" label="Scan nearby" icon="loop" color="primary"/>
    </div>

    <div class="center-content q-pa-md row items-start q-gutter-md">
      <!-- for every device in database, render a new q-card -->
      <q-card v-for="device in filteredDevices" :key="device.id"
      inline style="width: 250px; height: 330px">
        <div align="right" style="padding: 5px">
          <q-btn @click="onUpdateRow(device)" round size="sm" icon="edit" style="margin: 5px" />
          <q-btn @click="onDeleteRow(device)" round size="sm" icon="delete" />
        </div>
        <img alt="Icon of a device." :src="device.icon">
        <q-card-section>
          <p class="text-bold text-h6" align="center">{{ device.name }}</p>
          <p align="center">{{ device.roomID.homeID.name }} - {{ device.roomID.name }}</p>
          <!-- depending on type of each device (on/off or slider), render q-toggle or q-slider -->
          <q-toggle
            @input="updateToggleValue(device, device.id, device.currentState)"
            v-if="device.type === 'On / Off'"
            v-model="device.currentState"
            checked-icon="check"
            unchecked-icon="clear"
            color="green"
          />
          <q-slider
            @change="updateSliderValue(device, device.id, device.sliderValue)"
            v-if="device.type === 'Slider'"
            v-model="device.sliderValue"
            :min="0" :max="100"
            color="amber" />
        </q-card-section>
      </q-card>
    </div>

    <!--- DIALOG for adding and editing devices -->
    <q-dialog
      v-if="openDeviceDialog"
      v-model="openDeviceDialog"
    >
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="text-h6">Device info</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-select
            ref="roomID"
            v-model="device.roomID"
            option-value="id"
            :options=rooms
            label="Select a room for this device"
            :rules="[ val => val && val != null || 'Room is required.']"
          />
          <q-input
            ref="Name"
            label="Name of the device"
            v-model="device.name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Name is required.']"
          />
          <q-input
            ref="Icon"
            label="Icon url"
            v-model="device.icon"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Icon is required.']"
          />
          <q-select
            ref="Type"
            v-model="device.type"
            :options="['On / Off', 'Slider']"
            label="Type of this device"
            :rules="[ val => val && val.length > 0 || 'Type is required.']"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            @click="onOKClick"
            color="primary"
            label="OK"
          />
          <q-btn
            @click="onCancelClick"
            color="primary"
            label="Cancel"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog with a spinner, opens before DeviceTemplate dialog -->
    <q-dialog
      v-if="openLoading"
      v-model="openLoading">
      <q-spinner-hourglass size="7em"></q-spinner-hourglass>
    </q-dialog>

    <!-- Dialog for choosing a device from template -->
    <q-dialog
      v-if="openDeviceTemplate"
      v-model="openDeviceTemplate"
    >
      <div class="row justify-center" style="max-width: 700px;background-color: antiquewhite">
        <q-card v-for="device in allDevicesTemplate" :key="device.id" inline style="width: 200px;height: 200px;margin: 16px"
                v-ripple class="cursor-pointer q-hoverable" clickable @click="onSelectTemplate(device)">
          <span class="q-focus-helper"></span>
          <div style="text-align: center;font-weight: bold;">
            <p>{{ device.name }}</p>
            <img alt="Icon of a device." :src="device.icon">
            <q-spinner-radio color="amber" />
          </div>
        </q-card>
      </div>
    </q-dialog>

  </div>
</template>

<script>
import json from './../../assets/demo.json'
export default {
  name: 'DeviceIndex',

  data () {
    return {
      allDevicesTemplate: json,
      openLoading: false,
      openDeviceTemplate: false,
      openDeviceDialog: false,
      devices: [],
      filteredDevices: [],
      homes: [],
      rooms: [],
      select: this.$route.query.selectedHouse,
      device: null,
      deviceTemplate: {
        UIDDevice: null,
        id: this.makeID(5),
        roomID: null,
        name: null,
        type: null,
        icon: null,
        currentState: false,
        sliderValue: 0,
        lastChange: this.getDate(),
        numberOfChanges: 0
      },
      columns: [
        {
          name: 'id',
          label: 'id',
          align: 'left',
          field: 'id',
          sortable: true
        },
        {
          name: 'roomID',
          label: 'roomID',
          align: 'left',
          field: 'roomID',
          sortable: true
        },
        {
          name: 'name',
          label: 'Name',
          align: 'left',
          field: 'name',
          sortable: true
        },
        {
          name: 'type',
          label: 'Type',
          align: 'left',
          field: 'type',
          sortable: true
        },
        {
          name: 'icon',
          label: 'Icon',
          align: 'left',
          field: 'icon',
          sortable: true
        },
        {
          name: 'currentState',
          label: 'Current State',
          align: 'left',
          field: 'currentState',
          sortable: true
        },
        {
          name: 'sliderValue',
          label: 'Slider Value',
          align: 'left',
          field: 'sliderValue',
          sortable: true
        },
        {
          name: 'actions',
          label: 'Actions',
          align: 'left',
          field: null,
          sortable: false
        }
      ]
    }
  },

  mounted: async function () {
    await this.$db.collection('devices').get()
      .then((rows) => {
        rows.forEach((row) => {
          // read each room from database, then save it in "rooms" array
          this.devices.push(row.data())
          // if current room has "homeID.name" same as url query, display it on load
          if (row.data().roomID.homeID.name === this.$route.query.selectedHouse || this.$route.query.selectedHouse == null) {
            this.filteredDevices.push(row.data())
          }
        })
        console.log(this.filteredDevices)
      })
    await this.$db.collection('homes').get()
      .then((rows) => {
        rows.forEach((row) => {
          this.homes.push(row.data())
        })
        this.device = JSON.parse(JSON.stringify(this.deviceTemplate))
      })
    await this.$db.collection('rooms').get()
      .then((rows) => {
        rows.forEach((row) => {
          const room = row.data()
          room.label = row.data().name + ' - ' + row.data().homeID.name
          this.rooms.push(room)
        })
        this.device = JSON.parse(JSON.stringify(this.deviceTemplate))
      })
  },
  methods: {
    getDate: function () {
      const today = new Date()
      const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      // const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
      // const dateTime = date + ' ' + time
      this.timestamp = date
      return this.timestamp
    },
    updateSliderValue: async function (device, id, val) {
      let uid = ''
      let currentChanges = 0
      await this.$db.collection('devices')
        .get()
        .then((rows) => {
          rows.forEach((row) => {
            if (row.data().id === id) {
              uid = row.id
              currentChanges = row.data().numberOfChanges + 1
            }
          })
        })
      await this.$db.collection('devices')
        .doc(uid)
        .update({
          sliderValue: val,
          numberOfChanges: currentChanges
        })
    },
    updateToggleValue: async function (device, id, val) {
      let uid = ''
      let currentChanges = 0
      await this.$db.collection('devices')
        .get()
        .then((rows) => {
          rows.forEach((row) => {
            if (row.data().id === id) {
              uid = row.id
              currentChanges = row.data().numberOfChanges + 1
            }
          })
        })
      await this.$db.collection('devices')
        .doc(uid)
        .update({
          currentState: val,
          numberOfChanges: currentChanges
        })
      console.log(val)
    },
    findSelectedHouse () {
      // clearable option in q-select sets "this.select" to null, so all devices are displayed
      // otherwise, filtered devices are ones in the selected home
      if (this.select === null) {
        this.filteredDevices = this.devices
      } else {
        this.filteredDevices = []
        this.devices.forEach(device => {
          if (device.roomID.homeID.id === this.select.id) {
            this.filteredDevices.push(device)
          }
        })
      }
    },
    onNewDevice () {
      this.device = JSON.parse(JSON.stringify(this.deviceTemplate))
      console.log(this.device)
      this.openDeviceDialog = true
    },
    onScanDevices () {
      this.openLoading = true
      setTimeout(() => {
        this.openLoading = false
        this.openDeviceTemplate = true
      }, 2000)
    },
    makeID (length) {
      let result = ''
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      const charactersLength = characters.length
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
    },
    onOKClick () {
      if (this.$refs.Name.hasValue && this.$refs.Type.hasValue && this.$refs.roomID.hasValue) {
        const collectionRef = this.$db.collection('devices')
        if (this.device.UIDDevice === null || this.device.UIDDevice === undefined) {
          collectionRef.add(this.device)
            .then((doc) => {
              this.device.UIDDevice = doc.id
              const docRef = this.$db.collection('devices').doc(doc.id)
              docRef.update({ UIDDevice: doc.id })
                .then((response) => {
                  this.device.UIDDevice = doc.id
                  this.devices.push(this.device)
                  this.openDeviceDialog = false
                })
                .catch(function (error) {
                  console.error('Error adding document: ', error)
                })
            })
            .catch(function (error) {
              console.error('Error adding document: ', error)
            })
        } else {
          const docRef = this.$db.collection('devices').doc(this.device.UIDDevice)
          docRef.set(this.device)
            .then((response) => {
              const device = this.devices.find(device => device.UIDDevice === this.device.UIDDevice)
              if (device) {
                for (const attributeName in this.device) {
                  device[attributeName] = JSON.parse(JSON.stringify(this.device[attributeName]))
                }
              }
              this.openDeviceDialog = false
            })
            .catch(function (error) {
              console.error('Error adding document: ', error)
            })
        }
      }
    },
    onCancelClick () {
      this.openDeviceDialog = false
    },
    onSelectTemplate (device) {
      this.device = JSON.parse(JSON.stringify(device))
      for (const attributeName in this.device) {
        if (attributeName === 'lastChange') {
          this.device[attributeName] = this.getDate()
        } else if (attributeName === 'id') {
          this.device[attributeName] = this.makeID(5)
        } else {
          this.device[attributeName] = JSON.parse(JSON.stringify(device[attributeName]))
        }
      }
      this.openDeviceTemplate = false
      this.openDeviceDialog = true
    },
    onUpdateRow (device) {
      // read default values from template, all null
      this.device = JSON.parse(JSON.stringify(this.deviceTemplate))

      for (const attributeName in this.device) {
        if (attributeName === 'lastChange') {
          this.device[attributeName] = this.getDate()
        } else if (attributeName === 'numberOfChanges') {
          this.device[attributeName] = JSON.parse(JSON.stringify(device[attributeName])) + 1
        } else {
          this.device[attributeName] = JSON.parse(JSON.stringify(device[attributeName]))
        }
      }
      this.openDeviceDialog = true
    },
    onDeleteRow (row) {
      this.$q.dialog({
        title: 'Delete',
        message: 'Are you sure you want to delete this?',
        ok: true,
        cancel: true
      }).onOk(() => {
        const docRef = this.$db.collection('devices').doc(row.UIDDevice)
        docRef.delete()
          .then(() => {
            const index = this.devices.findIndex(device => device.UIDDevice === row.UIDDevice)
            if (index >= 0) {
              this.devices.splice(index, 1)
            }
          }).catch((error) => {
            console.error('Error removing document: ', error)
          })
      })
    }
  }
}
</script>

<style scoped>

img {
  width: auto;
  height: 140px;
  margin: auto;
  padding: 20px 0 20px 0;
}

p {
  margin: 0 0 5px;
}

@media only screen and (max-width: 900px) {
  .center-content {
    justify-content: center;
  }
}

</style>
