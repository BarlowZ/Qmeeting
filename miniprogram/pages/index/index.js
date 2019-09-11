const db = wx.cloud.database();
const app = getApp();
Page({
  options: {
    addGlobalClass: true,
  },
  data: {
    avatarUrl: '',
    userInfo:{},
    userName: 'null',
    userPhone: 'null',
    elements:[
      {
        title: '预定',
        name: 'order',
        icon: 'like',
        color: 'blue'
      },
      {
        title: '关于',
        name: 'about',
        icon: 'settings',
        color: 'cyan'
      }
    ]

  },

  onLoad: function(options) {
    db.collection('userInfo').where({
      _openid: app.globalData.openid,
    }).get({
      success: res => {
        db.collection('userInfo').doc(res.data[0]._id).get({
          success: res => {
           this.setData({
            userInfo:res.data.userInfo,
            avatarUrl:res.data.avatarUrl,
            userName:res.data.name,
            userPhone:res.data.phone
           })
           app.globalData.username = res.data.name
          }
        })
      }
    })
  } 
})