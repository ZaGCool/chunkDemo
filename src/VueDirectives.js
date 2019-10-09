import Vue from "vue"
// 定义v-focus
Vue.directive('focus', {
    inserted: function(el) {
        el.focus()
    }
})