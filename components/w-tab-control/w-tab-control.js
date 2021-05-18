// components/w-tab-control/w-tab-control.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titles: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabControlTap(event){
      const index = event.currentTarget.dataset.id;
      this.setData({
        currentIndex: index
      });
      // 给父组件发送事件传递参数
      this.triggerEvent('tabClick', index);
    }
  }
})
