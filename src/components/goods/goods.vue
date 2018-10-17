<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item, index) in goods" :key="index" class="menu-item"
            :class="{'current':currentIndex===index}" @click="selectMenu(index, $event)">
          <span class="text border-1px">
            <span v-show="item.type" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item, index) in goods" class="food-list food-list-hook" :key="index">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food, $event)" v-for="(food,index) in item.foods" :key="index"
                class="food-item border-1px">
              <div class="icon">
                <img :src="food.icon" width="57" height="57">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc" v-show="food.description">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" @card-add='_drop'></cartcontrol>
                  <!--card-add自定义事件，点击获取到点击的对象，用于制作小球下落动画
                  _drop调用子组件shopcart的drop方法，出入点击对象-->
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice"
              :min-price="seller.minPrice"></shopcart>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import food from '../../components/food/food';
  import BScroll from 'better-scroll';
  import shopcart from '../../components/shopcart/shopcart';
  import cartcontrol from '../../components/cartcontrol/cartcontrol';
  import data from '../../../data.json';

  // const ERR_OK = 0;
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [], // 储存goods数据
        listHeight: [], // 储存左右联动右边的区间累加高度,
        scrollY: 0, // 储存左右映射时右边滚动的距离
        selectedFood: {}
      };
    },
    computed: {// 计算属性，当滚动的时候scrollY变化，currentIndex也就会跟着变化
      currentIndex() { // 右侧滚动，左侧联动高亮
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() { // 返回选中的产品数据：子组件cartcontrol决定选中的产品，把数据传给子组件shopcart
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
              // console.log(food.count);
            }
          });
        });
        return foods;
      }
    },
    created() {
      this.goods = data.goods; // 获取本地数据
      // console.log('goods.created');
      // this.$http.get('/api/goods').then((response) => {
      //   response = response.body;
      //   if (response.errno === ERR_OK) {
      //     this.goods = response.data;
          this.$nextTick(() => { // 异步,回调函数在 DOM 更新完成后调用
            this._initScroll();// 加载better-scroll
            this._calculateHeight();// 获取右侧区间距离
          });
      //   }
      // });
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    methods: {
      selectMenu(index, event) { // 左侧点击，右侧联动滚动
        if (!event._constructed) {
          return;// better-scroll派发的click，阻止掉原始click
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300); // 滚动到目标元素，后面的参数是动画曲线，表示快慢
      },
      _initScroll() {
        if (!this.scroll) {
          this.meunScroll = new BScroll(this.$refs.menuWrapper, {
            click: true // 是否派发click事件
          });
          this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
            click: true,
            probeType: 3 // 滚动时时反馈位置，探针
          });
        } else {
          this.scroll.refresh();
        }
        this.foodsScroll.on('scroll', (pos) => { // 监听滚动事件，获取滚动距离，这个的位置放在created？？
            this.$nextTick(() => {
              this.scrollY = Math.abs(Math.round(pos.y));
            });
        });
      },
      _calculateHeight() { // 获取右侧区间距离
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight; // 每个项目的高度累加后得到区间高度
          this.listHeight.push(height);
        }
      },
      _drop(target) { // 调用子组件shopcart的drop方法，传入来自子组件cartcontrol的自定义事件监听数据
        this.$nextTick(() => { // 体验优化，异步执行，防止动画卡顿,
          this.$refs.shopcart.drop(target);
        });
      },
      selectFood(food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food; // 子组件food通过props接受父组件数据，父组件:food='selectedFood',selectedFood绑定于子元素中的数据
        this.$refs.food.show(); // 父组件调用子组件方法，显示子组件
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .goods
    display: flex
    position: absolute
    width: 100%
    top: 174px
    bottom: 64px
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 2
          margin-top: -1px
          backfround: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vetical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          font-size: 12px
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f9f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            margin-bottom: 8px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .extra
            line-height: 10px
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              color: rgb(147, 153, 159)
              font-size: 10px
          .cartcontrol-wrapper
            position: absolute
            bottom: 12px
            right: 0
</style>
