<template>
  <div class="cartcontrol">
    <div class="cart-decrease" @click.stop="decreaseCart($event)">
      <transition name="fade">
        <div class="inner icon-remove_circle_outline" v-show="food.count>0"></div>
      </transition>
    </div>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop="addCart($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    created() {
    },
    methods: {
      addCart(event) {
        if (!event._constructed) { // 通过es派发的事件才可以点击，屏蔽掉原生点击
          return;
        }
        if (!this.food.count) {
          // 给观测对象新添加不存在属性或删除属性，需要引入Vue，使用set接口，
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        this.$emit('card-add', event.target); // 监听父组件事件，并传入参数：点击的对象
      },
      decreaseCart(event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px // 通过padding增加可点击区域
      .inner
        display: inline-block
        font-size: 24px
        line-height: 24px
        color: rgb(0, 160, 220)
        &.fade-enter, &.fade-leave
          opacity: 0
          transform: translate3d(24px, 0, 0) rotate(360deg)
        &.fade-enter-active, &.fade-leave-active
          transition: all 0.4s
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 6px // 通过padding增加可点击区域
      font-size: 24px
      line-height: 24px
      color: rgb(0, 160, 220)
</style>
