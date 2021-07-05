import Vue from 'vue'

import * as VueGoogleMaps from 'vue2-google-maps'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCVBEAgmqzaEVCci63AFhUgciYpebEm4g0',
  authDomain: 'sirius-7872e.firebaseapp.com',
  projectId: 'sirius-7872e',
  storageBucket: 'sirius-7872e.appspot.com',
  messagingSenderId: '813030533473',
  appId: '1:813030533473:web:4d1f5591884c9520efbd20',
  measurementId: 'G-525XE6E7CD'
}

firebase.initializeApp(firebaseConfig)

export default ({ Vue }) => {
  Vue.prototype.$auth = firebase.auth()
  Vue.prototype.$db = firebase.firestore()
  Vue.prototype.$storage = firebase.storage()
}

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyA9PltFCljsi3FigwEXv-aJbxetBYGafZ0'
    // libraries: 'places' // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)

    // If you want to set the version, you can do so:
    // v: '3.26',
  },

  // If you intend to programmatically custom event listener code
  // (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  // instead of going through Vue templates (e.g. `<GmapMap @zoom_changed='someFunc'>`)
  // you might need to turn this on.
  // autobindAllEvents: false,

  // If you want to manually install components, e.g.
  // import {GmapMarker} from 'vue2-google-maps/src/components/marker'
  // Vue.component('GmapMarker', GmapMarker)
  // then set installComponents to 'false'.
  // If you want to automatically install all the components this property must be set to 'true':
  installComponents: true
})
