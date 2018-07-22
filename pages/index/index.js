//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    viewShow:false,
    userInfo: {},
    item:{
      avatar: app.globalData.imgs["null"],
      userRank: '',
      userStar: '',
      canUse: false,
      imgs: app.globalData.imgs
    },
    imgs: app.globalData.imgs,
    canUse: false,
    beRewarded:false,
    modalFlag:false
  },
  
  onLoad: function () {
    //console.log('onLoad')
    if (app.globalData.openId && app.globalData.openId != '') {
      console.log('onLoad1')
      console.log(app.globalData.openId)
      this.setData({
        viewShow: true
      })
    }
    else{
      app.userInfoReadyCallback = openid => {
        console.log('onLoad3')
        console.log(app.globalData.openId)
        this.setData({
          viewShow: true
        })
      }
    }
    
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getIntroduce: function () {
    wx.navigateTo({
      url: '../introduce/introduce'
    })
  },
  dealData: function (questions) {
    console.log(questions)
    console.log(questions[0].choices)
    if (questions[0].choices[0].value)
      return questions
    var n = questions.length
    for (var i = 0; i < n; ++i) {
      var tmp = questions[i].choices
      var ans = questions[i].answer
      var choices = new Array()
      for (var j = 0; j < tmp.length; ++j) {
        if (app.in_array(tmp[j],ans)) {
          choices[j] = { value: tmp[j], flag: 'choiceGreen' }
        }
        else {
          choices[j] = { value: tmp[j] }
        }
      }
      questions[i].choices = choices
    }
    console.log(questions)
    return questions
  },
  onGotUserInfo: function (e) {

    if(e.detail.errMsg == "getUserInfo:ok"){
      console.log(e.detail.userInfo)
      app.globalData.canUse = true
      app.globalData.userInfo = e.detail.userInfo
      console.log(app.globalData.userInfo)
      this.getRankStar()
      this.getReward()
      //console.log(this.data)
      this.setData({
        userInfo: app.globalData.userInfo,
        item: {
          avatar: app.globalData.userInfo.avatarUrl ? app.globalData.userInfo.avatarUrl : this.data.item.avatar,
          userRank: app.globalData.userRank,
          userStar: app.globalData.userStar,
          canUse: app.globalData.canUse,
          imgs: app.globalData.imgs
        },
        canUse: app.globalData.canUse,
        beRewarded: app.globalData.beRewarded
      })
      console.log(this.data)
    }
    else{
      wx.showModal({
        title: '警告',
        content: '网络故障，您将无法正常使用该小程序的功能。请稍后重试。',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log("getRankStar else")
            that.getRankStar()
          }
        }
      })
    }
    
    
    
  },
  getRankStar: function () {
    console.log('in getRankStar')
    var that = this
    wx.request({
      url: 'https://54.gmair.net/getRankStar?openId=' + app.globalData.openId,
      success: function (res) {
        console.log(res)
        if (res.data.status == 0) {
          console.log('res getRankStar')
          console.log(res)
          if (res.data.resultMsg.userRank == "SUN"){
            app.globalData.userRank = 3
          }
          else if (res.data.resultMsg.userRank == "MOON") {
            app.globalData.userRank = 2
          }
          else if (res.data.resultMsg.userRank == "GALAXY") {
            app.globalData.userRank = 4
          }
          else if (res.data.resultMsg.userRank == "UNIVERSE") {
            app.globalData.userRank = 5
          }
          else{
            app.globalData.userRank = 1
          }
          //app.globalData.userRank = res.data.resultMsg.userRank
          app.globalData.userStar = res.data.resultMsg.star
          that.setData({
            item: {
              avatar: app.globalData.userInfo.avatarUrl ? app.globalData.userInfo.avatarUrl : this.data.item.avatar,           
              userRank: app.globalData.userRank,
              userStar: app.globalData.userStar,
              canUse: app.globalData.canUse,
              imgs: app.globalData.imgs
            },
          })
          console.log(app.globalData.userRank + ' ' + app.globalData.userStar)
        }
        else {
          wx.showModal({
            title: '警告',
            content: '网络故障，您将无法正常使用该小程序的功能。请稍后重试。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log("getRankStar else")
                that.getRankStar()
              }
            }
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '警告',
          content: '网络故障，您将无法正常使用该小程序的功能。请稍后重试。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log("getRankStar fail")
              that.getRankStar()
            }
          }
        })
      }
    })
    console.log('out getRankStar')
  },
  getReward: function () {
    console.log('in getReward')
    var openId = app.globalData.openId
    var that = this
    wx.request({
      url: 'https://54.gmair.net/getWeekRankList?openId=' + openId,
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          app.globalData.beRewarded = res.data.resultMsg.reward
        }
        else {
          console.log('goToQuestion网络故障')
          wx.showModal({
            title: '警告',
            content: '网络故障，您将无法正常使用该小程序的功能。请确保网络可用后重试。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      },
      fail: function (res) {
        console.log('goToQuestion网络故障')
        wx.showModal({
          title: '警告',
          content: '网络故障，您将无法正常使用该小程序的功能。请确保网络可用后重试。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })

      }
    })
    console.log(app.globalData.beRewarded)
    console.log('out getReward')
  },
  goToQuestion: function() {
    //generateQuiz接口
    console.log('in goToQuestion')
    var openId = app.globalData.openId
    var that =this
    wx.request({
      url: 'https://54.gmair.net/generateQuiz?openId=' + openId,
      success: function (res) {
        console.log(res)
        if (res.data.status == 0) {
          console.log(res)
          app.globalData.questions = that.dealData(res.data.resultMsg)
          app.globalData.score = 0
          app.globalData.result = []
          wx.navigateTo({
            url: '../question/question'
          })
        }
        else {
          console.log('goToQuestion网络故障')
          wx.showModal({
            title: '警告',
            content: '网络故障，您将无法正常使用该小程序的功能。请确保网络可用后重试。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      },
      fail: function (res) {
        console.log('goToQuestion网络故障')
        wx.showModal({
          title: '警告',
          content: '网络故障，您将无法正常使用该小程序的功能。请确保网络可用后重试。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })

      }
    })//generateQuiz接口
    /*
    //删除---
    app.globalData.questions = this.dealData(app.globalData.questions)
    app.globalData.score = 0
    wx.navigateTo({
      url: '../question/question'
    })
    //删除---
    */
  },
  goToRank: function () {
    //getAllRankList接口
    
    var openId = app.globalData.openId
    wx.request({
      url: 'https://54.gmair.net/getWeekRankList?openId=' + openId,
      success: function (res) {
        if (res.data.status == 0) {
          app.globalData.rank = res.data.resultMsg
          wx.navigateTo({
            url: '../rank/rank'
          })
        }
        else {
          console.log('goToQuestion网络故障')
          wx.showModal({
            title: '警告',
            content: '网络故障，您将无法正常使用该小程序的功能。请确保网络可用后重试。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      },
      fail: function (res) {
        console.log('goToQuestion网络故障')
        wx.showModal({
          title: '警告',
          content: '网络故障，您将无法正常使用该小程序的功能。请确保网络可用后重试。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })

      }
    })//getAllRankList接口
    /*
    //删除---
    wx.navigateTo({
      url: '../rank/rank'
    })
    //删除---
    */
  },
  modalShow: function () {
    this.setData({
      modalFlag: true
    })
  },
  modalOk: function () {
    this.setData({
      modalFlag: false
    })
  },
})
