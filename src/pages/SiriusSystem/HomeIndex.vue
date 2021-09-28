<!-- Komponenta za prikaz virtualnih kuća -->
<!-- Čita potrebne podatke iz baze te ih prikazuje korisniku na ekran -->
<template>
  <div class="column">

    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el label="Homes" icon="apartment" to="/homes" />
      </q-breadcrumbs>
    </div>

    <div class="q-pa-md row items-start q-gutter-md">
      <q-btn @click="onNewHome()" label="Add new home" color="primary"/>
    </div>

    <!-- v-for označava da je za svaku kuću iz baze podataka potrebno generirati zaseban q-card sa svim navedenim podatcima o kući -->
    <div class="center-content q-pa-md row items-start q-gutter-md">
      <q-card v-for="home in homes" :key="home.id" inline style="width: 350px; height: 370px">
        <div v-ripple class="cursor-pointer q-hoverable" clickable @click="GetHome(home)">
          <img alt="Picture of a house." :src="home.icon" width='350' height='250'>
          <span class="q-focus-helper"></span>
        </div>
        <q-card-section>
          <div class="row justify-between">
            <div v-ripple class="cursor-pointer q-hoverable" clickable @click="GetHome(home)">
              <p class="text-bold text-h5">{{ home.name }}</p>
              <span class="q-focus-helper"></span>
            </div>
            <div>
              <q-btn @click="onUpdateRow(home)" round size="sm" icon="edit" style="margin: 5px" />
              <q-btn @click="onDeleteRow(home)" round size="sm" icon="delete" />
            </div>
          </div>
          <div><q-icon name="place" /> {{ home.location }}</div>
        </q-card-section>
      </q-card>

    </div>

    <!--- DIALOG for adding new home -->
    <q-dialog
      v-if="openHomeDialog"
      v-model="openHomeDialog"
    >
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="text-h6">Home</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input
            ref="Name"
            label="Name"
            v-model="home.name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Name is required.']"
          />
          <q-input
            ref="Home address"
            label="Home address"
            v-model="home.address"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Address is required.']"
          />
          <q-input
            ref="Location"
            label="Location"
            v-model="home.location"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Location is required.']"
          />
          <q-input
            ref="Icon"
            label="Icon"
            v-model="home.icon"
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
  name: 'HomeIndex',

  data () {
    return {
      openHomeDialog: false,
      homes: [],
      home: null,
      homeTemplate: {
        UIDHome: null,
        id: this.makeID(5),
        createdAt: this.getDate(),
        name: null,
        address: null,
        location: null,
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
          name: 'name',
          label: 'Name',
          align: 'left',
          field: 'name',
          sortable: true
        },
        {
          name: 'address',
          label: 'Address',
          align: 'left',
          field: 'address',
          sortable: true
        },
        {
          name: 'location',
          label: 'Location',
          align: 'left',
          field: 'location',
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

  mounted: function () {
    const collectionRef = this.$db.collection('homes')
    collectionRef.get()
      .then((rows) => {
        rows.forEach((row) => {
          this.homes.push(row.data())
        })
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
    GetHome (house) {
      this.$router.push({ path: 'rooms', query: { selectedHouse: house.name } })
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
    onNewHome () {
      this.home = JSON.parse(JSON.stringify(this.homeTemplate))
      this.openHomeDialog = true
    },
    onOKClick () {
      if (this.$refs.Name.hasValue) {
        const collectionRef = this.$db.collection('homes')
        if (this.home.UIDHome === null) {
          collectionRef.add(this.home)
            .then((doc) => {
              this.home.UIDHome = doc.id
              const docRef = this.$db.collection('homes').doc(doc.id)
              docRef.update({ UIDHome: doc.id })
                .then((response) => {
                  this.home.UIDHome = doc.id
                  this.homes.push(this.home)
                  this.openHomeDialog = false
                })
                .catch(function (error) {
                  console.error('Error adding document: ', error)
                })
            })
            .catch(function (error) {
              console.error('Error adding document: ', error)
            })
        } else {
          const docRef = this.$db.collection('homes').doc(this.home.UIDHome)
          docRef.set(this.home)
            .then((response) => {
              const home = this.homes.find(home => home.UIDHome === this.home.UIDHome)
              if (home) {
                for (const attributeName in this.home) {
                  home[attributeName] = JSON.parse(JSON.stringify(this.home[attributeName]))
                }
              }
              this.openHomeDialog = false
            })
            .catch(function (error) {
              console.error('Error adding document: ', error)
            })
        }
      }
    },
    onCancelClick () {
      this.openHomeDialog = false
    },
    onUpdateRow (home) {
      this.home = JSON.parse(JSON.stringify(this.homeTemplate))
      for (const attributeName in this.home) {
        this.home[attributeName] = JSON.parse(JSON.stringify(home[attributeName]))
      }
      this.openHomeDialog = true
    },
    onDeleteRow (row) {
      this.$q.dialog({
        title: 'Delete',
        message: 'Confirm deletion.',
        ok: true,
        cancel: true
      }).onOk(() => {
        const docRef = this.$db.collection('homes').doc(row.UIDHome)
        docRef.delete()
          .then(() => {
            const index = this.homes.findIndex(home => home.UIDHome === row.UIDHome)
            if (index >= 0) {
              this.homes.splice(index, 1)
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
@media only screen and (max-width: 900px) {
  .center-content {
    justify-content: center;
  }
}
</style>
