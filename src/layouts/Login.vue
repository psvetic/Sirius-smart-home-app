<template>
  <q-layout>
    <q-header elevated>
      <q-toolbar style="background-color: antiquewhite; color: #454444;font-family: monospace">
        <q-img src="./../../public/logo.jpg" width="80px" />
        <q-toolbar-title>
          Sirius Smart Home System
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'Login',
  methods: {
    openWelcomePage () {
      this.$router.push('/')
    }
  }
}
</script>

<style>

</style>
