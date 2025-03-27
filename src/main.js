import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import Galleria from 'primevue/galleria'
// ... other imports

// ... rest of the setup
// Import PrimeVue styles
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

// Import your CSS
import './index.css'

import App from './App.vue'

const app = createApp(App)
app.component('Dialog', Dialog)
app.component('Dropdown', Dropdown)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Galleria', Galleria)
// Initialize PrimeVue
app.use(PrimeVue)

app.mount('#root')