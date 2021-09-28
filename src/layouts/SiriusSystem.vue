<!-- Komponenta koja sadrži meni, prikazuje se kroz cijelu aplikaciju osim homepage-a -->
<!-- Služi za navigiranje između kuća, prostorija, uređaja i statistike -->
<template>
  <q-layout class="shadow-2 rounded-borders">
      <q-header elevated style="position: fixed">
        <q-toolbar style="background-color: antiquewhite; color: #454444;font-family: monospace">
          <q-btn
            flat
            dense
            round
            @click="drawer = !drawer"
            icon="menu"
            aria-label="Menu"
          />
          <q-toolbar-title class="font text-h4">
            Sirius
          </q-toolbar-title>
        </q-toolbar>
      </q-header>
    <q-drawer
      v-model="drawer"
      show-if-above
    >
      <q-list class="menu-list">
        <q-item-label header>Menu</q-item-label>
        <q-item
          clickable
          v-ripple
          to="/homes"
        >
          <q-item-section avatar>
            <q-icon name="apartment" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Homes</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          to="/rooms"
        >
          <q-item-section avatar>
            <q-icon name="chair" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Rooms</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          to="/devices"
        >
          <q-item-section avatar>
            <q-icon name="print" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Devices</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          to="/charts"
        >
          <q-item-section avatar>
            <q-icon name="style" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Statistics</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item
          clickable
          @click="home"
        >
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home page</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item
          clickable
          @click="logout"
        >
          <q-item-section avatar>
            <q-icon name="power_settings_new" />
          </q-item-section>
          <q-item-section>
            <q-item-label>LogOut</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'SiriusSystem',
  data () {
    return {
      drawer: false
    }
  },
  methods: {
    logout () {
      this.$auth.signOut()
        .then(() => {
          this.$router.push('/')
        })
    },
    home () {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>

</style>
