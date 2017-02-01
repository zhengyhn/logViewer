import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'
import Search from './components/Search.vue'
import Add from './components/Add.vue'

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.config.debug = true

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      component: Search
    },
    {
      path: '/anyConfig/add',
      component: Add
    }
  ]
})
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
