//app.js
App({
  onLaunch: function () {
    //初始化云开发环境
    if (wx.cloud) {
      wx.cloud.init({
        traceUser: true
      })
    }
    //获取系统信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();   //右上角胶囊按钮坐标信息
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },
  //全局变量
  globalData: {
    openid:'',
    username:'',
    startTimeText: '',
    endTimeText: '',
    room: ''
  }
})