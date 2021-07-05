<style>
body {
  background-color: #000000;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg fill-opacity='0.72'%3E%3Cpolygon fill='%23071a02' points='1600 160 0 460 0 350 1600 50'/%3E%3Cpolygon fill='%230e3403' points='1600 260 0 560 0 450 1600 150'/%3E%3Cpolygon fill='%23154f05' points='1600 360 0 660 0 550 1600 250'/%3E%3Cpolygon fill='%231c6906' points='1600 460 0 760 0 650 1600 350'/%3E%3Cpolygon fill='%23238308' points='1600 800 0 800 0 750 1600 450'/%3E%3C/g%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;
}

</style>

<template>
  <div class="q-pa-lg row justify-center">
    <div class="col" style="max-width: 400px">
      <q-form @submit="onLogin">
        <q-card>
          <q-card-section>
            <div class="text-h6">Login</div>
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
            <q-btn :loading="loading1" size="15px" label="Log In" type="submit" />
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
      this.$router.push('/Administration')
    }
  },
  methods: {
    onLogin () {
      this.$auth.signInWithEmailAndPassword(this.email, this.password)
        .then(response => {
          this.$router.push('/Administration')
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
