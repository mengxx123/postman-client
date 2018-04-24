import Vue from 'vue'
import App from './App'
import router from './router'
import http from '@/util/http'
import qs from 'qs'
import storage from '@/util/storage'
import ui from './components/index'
// 全部加载
import YunserUI from 'yunser-ui-vue'
import 'yunser-ui-vue/dist/yunser-ui.css'
import './scss/main.scss'
// import { VTree, VSelectTree } from 'vue-tree-halower'
import 'vue-tree-halower/dist/halower-tree.min.css' // 你可以自定义树的样式
import VTree from 'vue-tree-halower'

Vue.use(VTree)
// Vue.use(VSelectTree)

// 全部加载
Vue.use(YunserUI)

Vue.config.productionTip = false

Vue.prototype.$http = http
Vue.prototype.$qs = qs
Vue.prototype.$storage = storage

Vue.use(ui)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App}
})
