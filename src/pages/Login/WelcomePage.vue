<template>
  <q-page>
    <q-card class="no-shadow">
      <q-card-section class="img-position">
        <div>
          <q-img src="./../../../public/pictures/iot.png" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'WelcomePage'
}
</script>

<style>
/* 517px break point for img */
.img-position {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  max-width: 500px;
  padding-top: 50px;
}
</style>
