// pages/home/home.js
import {
  getMultidata,
  getGoodsData
} from '../../service/home.js'


const titles = ['pop', 'new', 'sell'];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播数据
    banners: [],
    // 推荐栏数据
    recommends: [],
    titles: ['流行', '新款', '精选'],
    isTabFixed: false,
    // 当前w-tab-control的位置
    scrollTabTop: 0,
    // 当前w-tab-control选中的title，方便请求对应的数据
    currentIndex: 0,
    // 当前选择的title
    currentType: 'pop',
    // tab-control对应的数据
    goods: {
      // 流行
      pop: {page: 0, list: []},
      // 新款
      new: {page: 0, list: []},
      // 精选
      sell: {page: 0, list: []}
    },
    // 控制backTop的显示
    isShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getMultidata();
    // 避免点击其他title时出现短暂闪屏，一开始就要请求各个title的数据
    this._getGoodsData('pop');
    this._getGoodsData('new');
    this._getGoodsData('sell');
  },
  onShow(){
    // wx.createSelectorQuery().select('#tab-control').boundingClientRect(rect => {
    //   console.log(rect);
    // }).exec();
    
  },
  // 当页面滚动到底部触发
  onReachBottom(){
    this._getGoodsData();
  },

  // 监听用户滑动页面事件
  onPageScroll(options){
    const backTopFlag = options.scrollTop >= 667;
    const tabControlFlag = options.scrollTop >= this.data.scrollTabTop;
    if (backTopFlag != this.data.isShow) {
      this.setData({
        isShow: backTopFlag
      })
    }
    if (tabControlFlag != this.data.isTabFixed) {
      this.setData({
        isTabFixed: tabControlFlag
      })
      console.log(this.data.isTabFixed);
    }
  },

  
  // 网络请求方法
  // 获取轮播，推荐数据
  async _getMultidata(){
    const result = await getMultidata();
    this.setData({
      banners: result.data.banner.list,
      recommends: result.data.recommend.list
    })
  },
  // 获取商品数据
  async _getGoodsData(type){
    const _type = type ? type : this.data.currentType;
    let page = this.data.goods[_type].page + 1;
    // 获取数据
    const result = await getGoodsData(_type, page);
    // 设置data需要的数据key
    const pageKey = `goods.${_type}.page`;
    const typeKey = `goods.${_type}.list`;
    // 获取原来list数据，再添加新的内容到数组中
    const oldList = this.data.goods[_type].list;
    oldList.push(...result.data.list);
    // 修改data数据
    this.setData({
      [pageKey]: page,
      [typeKey]: oldList
    })
  },
  // 监听w-recommends组件发出的事件
  handleImageLoad(){
    wx.createSelectorQuery().select('#tab-control').boundingClientRect(rect => {
      this.setData({
        scrollTabTop: rect.top
      })
    }).exec();
  },

  // w-tab-control组件发出的事件
  handleTabClick(event){
    const index = event.detail;
    if(this.data.currentIndex != index){
      this.setData({
        currentIndex: index,
        currentType: titles[index]
      })
      // 当list为空时，获取对应的数据，避免多次点击产生多次网络请求
      if (this.data.goods[titles[index]].list.length == 0) {
        this._getGoodsData();
      }
    }
  }
})