<template>
  <div class="column">

    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el label="Homes" icon="apartment" to="/homes" />
        <q-breadcrumbs-el label="Rooms" icon="chair" to="/rooms" /> <!--to="/homes/rooms"-->
        <q-breadcrumbs-el label="Devices" icon="print" />
      </q-breadcrumbs>
    </div>

    <div class="q-pa-md row items-start q-gutter-md">
      <q-btn @click="onNewDevice()" icon="playlist_add" label="Add new device" color="primary"/>
      <q-btn @click="onScanDevices()" label="Scan nearby" icon="loop" color="primary"/>
    </div>

    <div class="q-pa-md row items-start q-gutter-md">
      <q-card v-for="device in devices" :key="device.id"
      inline style="width: 250px; height: 310px">
        <div align="right" style="padding: 5px">
          <q-btn @click="onUpdateRow(device)" round size="sm" icon="edit" style="margin: 5px" />
          <q-btn @click="onDeleteRow(device)" round size="sm" icon="delete" />
        </div>
        <img alt="Icon of a device." :src="device.icon">
        <q-card-section>
          <p class="text-bold text-h6" align="center">{{ device.name }}</p>
          <q-toggle
            @input="updateToggleValue(device.id, device.currentState)"
            v-if="device.type === 'On / Off'"
            v-model="device.currentState"
            checked-icon="check"
            unchecked-icon="clear"
            color="green"
          />
          <q-slider
            @change="updateSliderValue(device.id, device.sliderValue)"
            v-if="device.type === 'Slider'"
            v-model="device.sliderValue"
            :min="0" :max="100"
            color="amber" />
        </q-card-section>
      </q-card>

    </div>

    <!--- DIALOG for adding new device -->
    <q-dialog
      v-if="openDeviceDialog"
      v-model="openDeviceDialog"
    >
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="text-h6">New device</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input
            outlined
            ref="id"
            label="ID"
            v-model="device.id"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'ID is required.']"
          />
          <q-select
            outlined
            ref="roomID"
            v-model="device.roomID"
            option-value="id"
            option-label="name"
            :options=rooms
            label="Select a room for this device"
            :rules="[ val => val && val != null || 'Room is required.']"
          />
          <q-input
            outlined
            ref="Name"
            label="Name of the device"
            v-model="device.name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Name is required.']"
          />
          <q-input
            outlined
            ref="Icon"
            label="Icon url"
            v-model="device.icon"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Icon is required.']"
          />
          <q-select
            outlined
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

    <!-- Dialog for choosing a device -->
    <q-dialog
      v-if="openDeviceTemplate"
      v-model="openDeviceTemplate"
    >
      <div class="row justify-center" style="max-width: 700px;background-color: antiquewhite">
        <q-card v-for="device in allDevicesTemplate" :key="device.id" inline style="width: 200px;height: 200px;margin: 16px"
                v-ripple class="cursor-pointer q-hoverable" clickable>
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
      openDeviceTemplate: false,
      openDeviceDialog: false,
      devices: [],
      homes: [],
      rooms: [],
      device: null,
      deviceTemplate: {
        UIDDevice: null,
        id: null,
        roomID: null,
        name: null,
        type: null,
        icon: null,
        currentState: false,
        sliderValue: 0,
        lastChange: this.getDate()
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
          console.log(row.id, row.data().id)
          this.devices.push(row.data())
        })
        console.log(this.devices)
      })
    await this.$db.collection('homes').get()
      .then((rows) => {
        rows.forEach((row) => {
          this.homes.push(row.data())
        })
        this.device = JSON.parse(JSON.stringify(this.deviceTemplate))
        console.log(this.homes)
      })
    await this.$db.collection('rooms').get()
      .then((rows) => {
        rows.forEach((row) => {
          this.rooms.push(row.data())
        })
        this.device = JSON.parse(JSON.stringify(this.deviceTemplate))
        console.log(this.rooms)
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
    updateSliderValue: async function (id, val) {
      let uid = ''
      await this.$db.collection('devices')
        .get()
        .then((rows) => {
          rows.forEach((row) => {
            if (row.data().id === id) {
              uid = row.id
            }
          })
        })
      await this.$db.collection('devices')
        .doc(uid)
        .update({
          sliderValue: val
        })
    },
    updateToggleValue: async function (id, val) {
      let uid = ''
      console.log('hi')
      await this.$db.collection('devices')
        .get()
        .then((rows) => {
          rows.forEach((row) => {
            if (row.data().id === id) {
              uid = row.id
            }
          })
        })
      await this.$db.collection('devices')
        .doc(uid)
        .update({
          currentState: val
        })
      console.log(val)
    },
    onNewDevice () {
      this.device = JSON.parse(JSON.stringify(this.deviceTemplate))
      this.openDeviceDialog = true
    },
    onScanDevices () {
      this.openDeviceTemplate = true
    },
    onOKClick () {
      if (!this.$refs.id.hasError) {
        const collectionRef = this.$db.collection('devices')
        if (this.device.UIDDevice === null) {
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
    onUpdateRow (device) {
      this.device = JSON.parse(JSON.stringify(this.deviceTemplate))
      for (const attributeName in this.device) {
        this.device[attributeName] = JSON.parse(JSON.stringify(device[attributeName]))
      }
      this.openDeviceDialog = true
    },
    onDeleteRow (row) {
      this.$q.dialog({
        title: 'Delete',
        message: 'Confirm deletion.',
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

</style>
