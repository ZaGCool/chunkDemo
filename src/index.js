import Vue from "vue"

import App from './App.vue'

// import "jquery"

import "bootstrap"

import axios from "axios"

import * as Filters from './VueFilter'
console.log(Object.keys(Filters));
Object.keys(Filters).forEach(key => {
    // console.log(key);
    // console.log(Filters[key]);
    Vue.filter(key, Filters[key]);

})

import "./VueDirectives"

Vue.prototype.$http = axios;
Vue.prototype.$http.defaults.baseURL = 'http://localhost:5000';

const vm = new Vue({
    components: { App },
    render: h => h(App)
}).$mount('#app')