<template>
  <div class="column">

    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el label="Homes" icon="apartment" to="/homes" />
        <q-breadcrumbs-el label="Rooms" icon="chair" to="/rooms" /> <!--to="/homes/rooms"-->
      </q-breadcrumbs>
    </div>

    <div class="q-pa-md row items-start q-gutter-md items-center">
      <div>
        <q-select
          style="width: 200px"
          outlined
          v-model="roomTemplate.homeID"
          option-value="id"
          option-label="name"
          :options=homes
          label="Filter by the house"
          @input="findSelectedHome()"
        />
      </div>
      <div>
        <q-btn @click="onNewRoom()" label="Add new room" color="primary" />
      </div>
    </div>

    <div class="q-pa-md row items-start q-gutter-md">
      <q-card
        v-for="currentRoom in filteredRooms"
        :key="currentRoom.id"
        v-ripple
        class="cursor-pointer q-hoverable"
        clickable inline style="width: 300px; height: 320px"
      >
        <span class="q-focus-helper"></span>
        <div class="icon_placeholder" style="width: 150px; height: 200px">
          <img alt="Icon of a room." :src="currentRoom.icon">
        </div>
        <q-card-section>
          <div class="row justify-between">
            <div><p class="text-bold text-h5">{{ currentRoom.name }}</p></div>
            <div>
              <q-btn @click="onUpdateRow(currentRoom)" round size="sm" icon="edit" style="margin: 5px" />
              <q-btn @click="onDeleteRow(currentRoom)" round size="sm" icon="delete" />
            </div>
          </div>
          <div>
            <p>Home: {{ currentRoom.homeID.name }}</p>
          </div>
        </q-card-section>
      </q-card>

    </div>

    <!--- DIALOG for adding new room -->
    <q-dialog
      v-if="openRoomDialog"
      v-model="openRoomDialog"
    >
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="text-h6">Room</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input
            outlined
            ref="id"
            label="ID"
            v-model="room.id"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'ID is required.']"
          />
          <q-select
            outlined
            ref="homeID"
            v-model="room.homeID"
            option-value="id"
            option-label="name"
            :options=homes
            label="Select a home where this room belongs."
            :rules="[ val => val && val != null || 'Home is required.']"
          />
          <q-input
            outlined
            ref="Name"
            label="Name of the room"
            v-model="room.name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Name is required.']"
          />
          <q-input
            outlined
            ref="Icon"
            label="Icon url"
            v-model="room.icon"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Icon is required.']"
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

  </div>
</template>

<script>
export default {
  name: 'RoomIndex',

  data () {
    return {
      openRoomDialog: false,
      rooms: [],
      filteredRooms: [],
      homes: [],
      room: null,
      select: null,
      roomTemplate: {
        UIDRoom: null,
        id: null,
        homeID: null,
        createdAt: this.getDate(),
        name: null,
        icon: null
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
          name: 'homeID',
          label: 'homeID',
          align: 'left',
          field: 'homeID',
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
          name: 'icon',
          label: 'Icon',
          align: 'left',
          field: 'icon',
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
    const collectionRef = this.$db.collection('rooms')
    await collectionRef.get()
      .then((rows) => {
        rows.forEach((row) => {
          this.rooms.push(row.data())
          this.filteredRooms = this.rooms.slice(0)
        })
        console.log(this.rooms)
      })
    this.$db.collection('homes').get()
      .then((rows) => {
        rows.forEach((row) => {
          this.homes.push(row.data())
        })
        this.room = JSON.parse(JSON.stringify(this.roomTemplate))
        console.log(this.homes)
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
    findSelectedHome () {
      this.filteredRooms = []
      this.rooms.forEach(room => {
        if (room.homeID.name === this.roomTemplate.homeID.name) {
          this.filteredRooms.push(room)
        }
      })
    },
    selectOption (key) {
      this.filteredRooms = []
      this.filteredRooms.push(this.selectedHome)
    },
    onNewRoom () {
      this.room = JSON.parse(JSON.stringify(this.roomTemplate))
      this.openRoomDialog = true
    },
    onOKClick () {
      if (!this.$refs.id.hasError) {
        const collectionRef = this.$db.collection('rooms')
        if (this.room.UIDRoom === null) {
          collectionRef.add(this.room)
            .then((doc) => {
              this.room.UIDRoom = doc.id
              const docRef = this.$db.collection('rooms').doc(doc.id)
              docRef.update({ UIDRoom: doc.id })
                .then((response) => {
                  this.room.UIDRoom = doc.id
                  this.rooms.push(this.room)
                  this.openRoomDialog = false
                })
                .catch(function (error) {
                  console.error('Error adding document: ', error)
                })
            })
            .catch(function (error) {
              console.error('Error adding document: ', error)
            })
        } else {
          const docRef = this.$db.collection('rooms').doc(this.room.UIDRoom)
          docRef.set(this.room)
            .then((response) => {
              const room = this.rooms.find(room => room.UIDRoom === this.room.UIDRoom)
              if (room) {
                for (const attributeName in this.room) {
                  room[attributeName] = JSON.parse(JSON.stringify(this.room[attributeName]))
                }
              }
              this.openRoomDialog = false
            })
            .catch(function (error) {
              console.error('Error adding document: ', error)
            })
        }
      }
    },
    onCancelClick () {
      this.openRoomDialog = false
    },
    onUpdateRow (room) {
      this.room = JSON.parse(JSON.stringify(this.roomTemplate))
      for (const attributeName in this.room) {
        this.room[attributeName] = JSON.parse(JSON.stringify(room[attributeName]))
      }
      this.openRoomDialog = true
    },
    onDeleteRow (row) {
      this.$q.dialog({
        title: 'Delete',
        message: 'Confirm deletion.',
        ok: true,
        cancel: true
      }).onOk(() => {
        const docRef = this.$db.collection('rooms').doc(row.UIDRoom)
        docRef.delete()
          .then(() => {
            const index = this.rooms.findIndex(room => room.UIDRoom === row.UIDRoom)
            if (index >= 0) {
              this.rooms.splice(index, 1)
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

.icon_placeholder {
  width: 150px;
  height: auto;
  margin: auto;
  padding: 20px 0 30px 0;
}
img {
  width: 100%;
}

</style>
