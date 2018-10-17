<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <!--当选择商品大于0高亮显示，判断添加class-->
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
            </div>
            <!--当选择商品大于0显示数量，v-show接收表达式，绝对定位-->
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop="pay">
          <div class="pay" :class="payClass">{{payDesc}}</div>
        </div>
      </div>
      <div class="ball-container"><!--购物车小球落下过渡-->
        <transition name="ball-fade" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter" v-for="(ball, index) in balls" :key="index">
          <div v-show="ball.show" class="ball" >
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
      <transition name="shopcart-list-fade"><!--购物车展开过渡-->
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="(food, index) in selectFoods" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="list-mask-fade"> <!--购物车展开背景过渡-->
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import cartcontrol from '../../components/cartcontrol/cartcontrol';

  export default {
    props: {
      selectFoods: { // 接收选择的商品，统计价格及数量的数组，所有状态变化依赖的值
        type: Array,
        default() {
          return [
            {
              price: 10,
              count: 0
            }
          ];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        balls: [ // 小球
          {show: false},
          {show: false},
          {show: false},
          {show: false},
          {show: false}
        ],
        dropBalls: [], // 已经下落的小球
        fold: true // 展开购物车清单
      };
    },
    computed: { // 计算属性
      totalPrice() { // 选择商品总金额
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() { // 选择商品总数量
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() { // 计算价格，判断结算显示
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      payClass() { // 改变结算状态的class，vue数据驱动
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      listShow() { // 是否展示购物车清单的属性
        let _this = this; // 两个地方的this？？？
        if (!this.totalCount) {
          _this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) { // 因为show是不断变化的，所以不必要在每次show的时候new一个，只需要更新
              _this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
              // console.log('scroll.refresh'); // 在异步$nextTick中，每次更改数据都会执行一次
            }
          });
        }
        return show;
      }
    },
    components: {
      cartcontrol
    },
    methods: {
      drop(el) { // el是点击的元素，来自父组件goods调用这个方法传入的参数
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) { // 取到一个false小球
            ball.show = true; // 触发动画
            ball.el = el; // 小球添加对象保留el
            // console.log(ball); // {el:div元素,show:true}
            this.dropBalls.push(ball); // 已经下落的小球放入dropBalls
            return; // 这个方法是通过在组件cartcontrol中的点击事件addCart函数触发的
          }
        }
      },
      beforeEnter(el) { // 这个方法是通过drop方法触发的动画事件，执行的函数，参数就是动画对象
        // console.log('before');
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count]; // 拿到小球
          if (ball.show) { // true的小球
            let rect = ball.el.getBoundingClientRect(); // 获得元素相对视口位置
            // console.log(ball.el.getBoundingClientRect().top);（left,top相对视口的偏移）
            let x = rect.left - 32; // 小球横向偏移量
            let y = -(window.innerHeight - rect.top - 22); // 小球纵向偏移量
            el.style.display = ''; // 显示小球
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
            // 外层元素纵向滚动动画，内层元素横向滚动动画，为什么不在一起都设置在外层元素？？
            // 实现两个方向的不同滑动路线
          }
        }
      },
      enter(el) { // 动画完成
        // console.log('enter');
        /* eslint-disable no-unused-vars */ // 关闭被申明却未被调用的变量报错
        let rf = el.offsetHeight; // 手动触发重绘
        this.$nextTick(() => { // 状态重置
          el.style.webkitTransform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = `translate3d(0,0,0)`;
          inner.style.transform = 'translate3d(0,0,0)';
        });
      },
      afterEnter(el) { // 重置小球：把ball变为true的更改为false
        // console.log('after');
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleList() { // 折叠展开切换
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      empty() { // 清空
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      hideList() {
        this.fold = true;
      },
      pay() {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`支付${this.totalPrice}元`);
      }
    }
  }
  ;
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 2
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        font-size: 0
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            background: #2b343c
            text-align: center
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            color: #ffffff
            font-weight: 700
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          line-height: 24px
          margin: 12px 0 0 12px
          font-size: 10px
          font-weight: bold
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          background: #2b333b
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container // 下落小球
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 3
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list
      position: absolute
      top: 0
      left: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)

      .list-content
        padding: 0 18px
        max-height: 217px
        background: #ffffff
        overflow: hidden
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px

  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 1
    // backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.5)
    &.list-mask-fade-enter, &.list-mask-fade-leave-to
      opacity: 0
    &.list-mask-fade-enter-active, &.list-mask-fade-leave-active
      transition: all 1s
</style>
