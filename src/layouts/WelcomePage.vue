<style scoped>

</style>

<template>
  <q-layout>
    <q-header elevated>
      <q-toolbar style="background-color: antiquewhite; color: #454444;font-family: monospace">
        <q-img src="./../../public/logo.jpg" width="80px" />
        <q-toolbar-title>
          Sirius
        </q-toolbar-title>
        <q-btn
          flat
          dense
          @click="openLoginPage"
          label="Login"
        />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'WelcomePage',
  methods: {
    openLoginPage () {
      this.$router.push('Login')
    }
  }
}
</script>
