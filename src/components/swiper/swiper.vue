<template>
  <div class="swiper-container">
    <swiper :options="swiperOption">
      <swiper-slide v-for="(item, index) in message" :key="index">{{item.text}}</swiper-slide>
      <!--<swiper-slide>text11</swiper-slide>-->
      <!--<swiper-slide>text12</swiper-slide>-->
      <!--<swiper-slide>text13</swiper-slide>-->
    </swiper>
    <!--以下看需要添加-->
    <div class="swiper-scrollbar"></div>
    <!--//滚动条-->
    <div class="swiper-button-next"></div>
    <!--//下一项-->
    <div class="swiper-button-prev"></div>
    <!--//上一项-->
    <div class="swiper-pagination"></div>
    <!--//标页码-->
  </div>
</template>

<script type="text/ecmascript-6">
  import 'swiper/dist/css/swiper.css';
  import {swiper, swiperSlide} from 'vue-awesome-swiper';

  export default {
    data() {
      return {
        message: [
          {text: 'msgname1'},
          {text: 'msgname2'},
          {text: 'msgname3'}
        ],
        swiperOption: {
          autoplay: true,
          scrollbar: {
            el: '.swiper-scrollbar'
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          pagination: {
            el: '.swiper-pagination'
          },
          spaceBetween: 30,
          loop: true,
          keyboard: true
        }
      };
    },
    components: {
      swiper,
      swiperSlide
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .swiper-container
    height: 500px
    text-align: center
    margin: 20px
</style>
