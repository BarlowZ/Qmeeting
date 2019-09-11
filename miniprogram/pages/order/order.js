const db = wx.cloud.database();
const app = getApp();

Page({
  data: {
    startTime: '09:00',
    endTime: '18:00',
    inputTime: '0.5',
    unit: 30,        // 展示时间单位（默认30分钟）
    reserveUnit: 30,  // 预约时间单位（默认60分钟）
    activedConst: 101, // 已经选中的常量标示
    disabledConst: 102, // 不可选的常量标示
    unreserveTime: [],// 三楼已被预定列表
    newunreserveTime: [], //七楼已被预订列表
    themeColor: '#fff',  // 插件的主题颜色
    orderInfo: [],
    picker: ['三楼', '七楼'],
    room: '0'
  },
  //会议室选择器
  pickerChange(e) {
    var that = this
    that.setData({
      room: e.detail.value
    })
    wx.showLoading({
      title: '加载中',
    })
    if( e.detail.value == 0){
      that.onLoad()
    } else {
      that.SevenFloor()
    }
    wx.hideLoading();
  },
  //双向绑定输入预定时间单位
  changeLimit: function (e){
    let _this = this;
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value
    let changeData = dataset.input;
    _this.data[changeData] = value
    _this.setData({
      reserveUnit: _this.data[changeData]*60
    });
  },
  //确定预约
  btnClick: function () {
    if (app.globalData.startTimeText == ''){
      wx.showToast({
        title: '请选择好预定的时间再点预定！',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        wx.hideToast();
      }, 2000)
    } else {
      var that = this
      wx.showLoading({
        title: '预约中',
        mask: true,
      })
      db.collection('order').add({
        data: {
          startTime: app.globalData.startTimeText,
          endTime: app.globalData.endTimeText,
          status: 102,
          username: app.globalData.username,
          room: that.data.room
        },
        success: function (res) {
          wx.hideLoading()
          wx.showToast({
            title: '预定成功！',
            icon: 'none',
          })
          if (that.data.room == 0) {
            that.onLoad()
          } else {
            that.SevenFloor()
          }
        },
      })
    }
  },
  btnDelete: function() {
    var that = this
    wx.showModal({
      title: '确认取消',
      content: '将取消您的最近预定，一但提交无法更改！',
      success: res => {
        if(res.confirm) {
          db.collection('order').where({
            username: app.globalData.username
          }).orderBy('startTime', 'desc').get({
            success: res => {
              db.collection('order').doc(res.data[0]._id).remove({
                success: res => {
                  wx.showToast({
                    title: '取消成功',
                    duration: 1500
                  })
                  setTimeout(function () {
                    wx.navigateBack()
                  }, 1500)
                },
                fail: err => {
                  wx.showToast({
                    icon: 'none',
                    title: '取消失败',
                  })
                }
              })
            }
          })
        }
      }
    })
  },

  detailInfo: function() {
    this.setData({
      isBackTo : false
    })
    if(this.data.room && this.data.room == 0){
      let orderInfo = JSON.stringify(this.data.orderInfo)
      wx.navigateTo({
        url: "../detail/detail?room=三楼&orderInfo=" + orderInfo
      })
    }else{
      let orderInfo = JSON.stringify(this.data.orderInfo)
      wx.navigateTo({
        url: "../detail/detail?room=七楼&orderInfo=" + orderInfo
      })
    }
  },

  onLoad: function(options) {
    var that = this;
    //查询以被预定时间
    db.collection('order').orderBy('startTime','desc').where({
      room: '0'
    }).get({
      success:res=>{
        console.log('res',res)
        let temp = []
        let temp2 = []
        for(let i=0;i<res.data.length;i++){
          temp.push({
            startTime : res.data[i].startTime,
            endTime : res.data[i].endTime,
            status : res.data[i].status
          })
          temp2.push({
            startTime: res.data[i].startTime,
            endTime: res.data[i].endTime,
            status: res.data[i].status,
            username: res.data[i].username
          })
        }
        // temp2.reverse()
        that.setData({
          unreserveTime: temp,
          orderInfo: temp2
        })
      }
    })
  },

  // onShow: function () {
  //   if(this.data.isBackTo){
  //     this.setData({
  //       hide: true
  //     })
  //   }
  // },

  SevenFloor: function(){
    var that = this;
    //查询七楼会议室已被预定时间
    db.collection('order').orderBy('startTime', 'desc').where({
      room: '1'
    }).get({
      success: res => {
        let temp = []
        let temp2 = []
        for (let i = 0; i < res.data.length; i++) {
          temp.push({
            startTime: res.data[i].startTime,
            endTime: res.data[i].endTime,
            status: res.data[i].status
          })
          temp2.push({
            startTime: res.data[i].startTime,
            endTime: res.data[i].endTime,
            status: res.data[i].status,
            username: res.data[i].username
          })
        }
        // temp2.reverse()
        that.setData({
          newunreserveTime: temp,
          orderInfo: temp2
        })
      }
    })
  },

  //每次选择将时间传入全局变量
  onSelectTime(e) {
    const { startTimeText, endTimeText } = e.detail;
    app.globalData.startTimeText = startTimeText
    app.globalData.endTimeText = endTimeText
  }

})