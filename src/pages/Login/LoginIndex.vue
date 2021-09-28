<!-- Komponenta za login korisnika -->
<!-- Sastoji se od forme za email i password, te Firebase funkcije za autentifikaciju -->
<style scoped>

</style>

<template>
  <div class="q-pa-lg row justify-center">
    <div class="col" style="max-width: 400px;margin-top: 60px;">
      <q-form @submit="onLogin">
        <q-card>
          <q-card-section style="text-align: center">
            <img src="./../../../public/logo.png" width="100">
            <div class="text-h6">Sirius Login</div>
          </q-card-section>
          <q-card-section>
            <div class="q-gutter-md">
              <q-input
                outlined
                rounded
                type="email"
                v-model="email"
                label="Your email"
                hint="Email to login"
                lazy-rules
                :rules="[ val => emailPattern.test(val) || 'Please type valid email']"
              />
              <q-input
                outlined
                rounded
                :type="isPwd ? 'password' : 'text'"
                v-model="password"
                label="Your password"
                hint="Password to login"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type password']"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn :loading="loading1" size="15px" label="Log In" type="submit"
                   style="background-color: #3bae3bd6;color: white;padding: 0 15px; margin-bottom: 10px"/>
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginIndex',
  data () {
    return {
      emailPattern: /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/,
      email: null,
      password: null,
      isPwd: true,
      loading1: false
    }
  },
  mounted: function () {
    if (this.$auth.currentUser) {
      this.$router.push('/homes')
    }
  },
  methods: {
    onLogin () {
      this.$auth.signInWithEmailAndPassword(this.email, this.password)
        .then(response => {
          this.$router.push('/homes')
        })
        .catch(error => {
          console.log(error)
          this.$q.notify({
            type: 'negative',
            message: 'Login failed.'
          })
        })
    }

  }
}

</script>
