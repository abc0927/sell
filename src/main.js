// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';// 必须要使用单引号
import App from './App';
// import router from './router/index.js';
import 'common/stylus/index.styl'; // 在这里引入css不需要带@符号
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings.vue';
import seller from 'components/seller/seller.vue';
// import VueAwesomeSwiper from 'vue-awesome-swiper';
// Vue.use(VueAwesomeSwiper);
Vue.use(VueResource);
Vue.config.productionTip = false;// 阻止 vue 在启动时生成生产提示
// 设置代码分割分号在eslintrc.js中配置
// 注释带有一个空格
/* eslint-disable no-new */
Vue.use(VueRouter);
let router = new VueRouter({
  routes: [
    {path: '/goods', component: goods},
    {path: '/ratings', component: ratings},
    {path: '/seller', component: seller}
  ],
  linkActiveClass: 'active'
});

let app = new Vue({
  el: '#app',
  components: {App},
  router,
  template: '<App/>',
  methods: {
    load() {
      this.$router.push('/goods');
    }
  }
});
// router.push('/goods');
// console.log(router.params, 1);
// this.$router.push('/goods')
app.load();
