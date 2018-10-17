<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <router-link to="/goods">商品</router-link>
      <router-link to="/ratings">评价</router-link>
      <router-link to="/seller">商家</router-link>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>
<script type="text/ecmascript-6">
  import {urlParse} from 'common/js/util';
  import header from 'components/header/header.vue';
  import data from '../data.json';

  // const ERR_OK = 0;// 状态码统一更改
  export default {
    components: {
      'v-header': header
    },
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            // console.log(queryParam);
            return queryParam.id;
          })()
        }
      };
    },
    created() { // 从服务器获取数据，使用本地数据
      // console.log(this.seller.id); // 可以获取到id值
      // this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
        // console.log(response);
        // console.log(response.body);
        // response = response.body;
        // if (response.errno === ERR_OK) {
          // this.seller = response.data;
          // console.log(this.seller.id); // undefined，对象被覆盖掉
          // this.seller = Object.assign({}, this.seller, response.data); // 合并后面对象到第一个参数上面并返回
          // console.log(this.seller.id); // 可以获取到id值
      //   }
      // });
      // console.log(data.seller);
      this.seller = Object.assign({}, this.seller, data.seller);
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import './common/stylus/mixin.styl';

.tab {
  display: flex;
  width: 100%;
  height: 40px;
  line-height: 40px;
  // border-bottom: 1px solid rgba(4, 17, 27, 0.1)
  border-1px(rgba(4, 17, 27, 0.1));

  & > a {
    display: block;
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: rgb(77, 85, 93);
    text-decoration: none;
    cursor: pointer;

    &.active {
      color: red;
    }
  }
}
</style>
