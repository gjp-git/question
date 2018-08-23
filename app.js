//app.js
App({
  onLaunch: function () {
    // 登录
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          var code = res.code
          console.log(code)
          
          wx.request({
            url: 'https://54.gmair.net/getOpenId?code=' + code,
            success: function (res) {
              console.log(res)
              if (res.data.status == 0 && res.data.resultMsg) {
                that.globalData.openId = res.data.resultMsg.openid
                if (that.userInfoReadyCallback) {
                  that.userInfoReadyCallback(res.data.resultMsg.openid)
                }
              }
            
              else {
              wx.showModal({
                title: '警告',
                content: '网络故障，您将无法正常使用该小程序的功能。请稍后重试。',
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
              console.log("getopenid fail")
              wx.showModal({
                title: '警告',
                content: '网络故障，您将无法正常使用该小程序的功能。请稍后重试。',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
            }
          })
          
          //getOpenId接口
          /*
          wx.request({
            url: 'https://54.nju.edu.cn/getOpenId?code=' + code,
            success: function (res) {
              console.log(res)
              if (res.data.status == 0) {
                that.globalData.openId = res.data.resultMsg.openid
                wx.getSetting({
                  success: res => {
                    console.log(res)
                    if (!res.authSetting['scope.userInfo']) {
                      console.log('in')
                      wx.getUserInfo({
                        success: res => {
                          // 可以将 res 发送给后台解码出 unionId
                          that.globalData.canUse = true
                          that.globalData.userInfo = res.userInfo
                          that.getRankStar()
                          that.getReward()
                          console.log(res.userInfo)
                          if (that.userInfoReadyCallback) {
                            that.userInfoReadyCallback(res)
                          }
                        },
                        fail: res => {
                          that.globalData.canUse = false
                          wx.showModal({
                            title: '警告',
                            content: '您拒绝了授权，将无法正常使用该小程序的功能。请滑动授权。',
                            showCancel: false,
                            success: function (res) {
                              if (res.confirm) {
                                that.regetUserInfo()
                              }
                            }
                          })
                        }

                      })
                    }
                    else {
                      that.getUser()
                    }
                  }
                })
              }
              else {
                wx.showModal({
                  title: '警告',
                  content: '网络故障，您将无法正常使用该小程序的功能。请稍后重试。',
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
              wx.showModal({
                title: '警告',
                content: '网络故障，您将无法正常使用该小程序的功能。请稍后重试。',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
            }
          })*///getOpenId接口
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    //---删除
    /*
    var that = this
    wx.getSetting({
      success: res => {
        console.log(res)
        if (!res.authSetting['scope.userInfo']) {
          console.log('in')
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.canUse = true
              that.globalData.userInfo = res.userInfo
              console.log(res.userInfo)
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            },
            fail: res => {
              this.globalData.canUse = false
              wx.showModal({
                title: '警告',
                content: '您拒绝了授权，将无法正常使用该小程序的功能。请滑动授权。',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log("getUserInfo fail")
                    that.regetUserInfo()
                  }
                }
              })
            }
          })
        }
        else {
          this.getUser()
        }
      }
    })//---删除
    */
  }, 
  in_array: function(searchString, array) {
        for(var i = 0; i<array.length; i++) {
      if (searchString == array[i]) return true;
    }
    return false;
  },
  getRankStar() {
    var that = this
    wx.request({
      url: 'https://54.nju.edu.cn/getRankStar?openId=' + that.globalData.openId,
      success: function (res) {
        if (res.data.status == 0) {
          that.globalData.userRank = res.data.resultMsg.userRank
          that.globalData.userStar = res.data.resultMsg.userStar
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
  },
  getUser() {
    var that = this
    wx.getUserInfo({
      success: res => {
        that.globalData.userInfo = res.userInfo
        that.globalData.canUse = true
        console.log(res.userInfo)
        if (that.userInfoReadyCallback) {
          that.userInfoReadyCallback(res)
        }
      },
      fail: res => {
        wx.showModal({
          title: '警告',
          content: '网络故障，您将无法正常使用该小程序的功能。请稍后重试。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              that.getUser() 
            }
          }
        })
      }
    })
  },
  regetUserInfo() {
    var that = this
    wx.openSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          this.getUser()
        }
        else {
          wx.showModal({
            title: '警告',
            content: '您拒绝了授权，将无法正常使用该小程序的功能。请滑动授权。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.regetUserInfo()
              }
            }
          })
        }
      }
    })
  },  
  getReward: function () {
    /*
    var openId = app.globalData.openId
    var that = this
    wx.request({
      url: '#/getWeekRankList?openId=' + openId,
      success: function (res) {
        if (res.status == 0) {
          that.globalData.beRewarded = res.resultMsg.reward
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
    })*/
  },
  globalData: {
    canUse:false,
    beRewarded: true,
    userInfo:null,
    openId: '',
    lastRank: 1,
    lastStar: 1,
    userRank: '',
    userStar: '',
    imgs: {
      "kun1": "../image/kun1.png",
      "kun2": "../image/kun2.png",
      "kun3": "../image/kun3.png",
      "kun4": "../image/kun4.png",
      "kun5": "../image/kun5.png",
      "index": "https://54.gmair.net/material/index.png",
      "msgbox": "https://54.gmair.net/material/msgbox.png",
      "timer1": "../image/timer1.png",
      "timer2": "../image/timer2.png",
      "timer3": "../image/timer3.png",
      "timer4": "../image/timer4.png",
      "timer5": "../image/timer5.png",
      "timer6": "../image/timer6.png",
      "timer7": "../image/timer7.png",
      "timer8": "../image/timer8.png",
      "title":"../image/title.png",
      "background": "../image/background.png",
      "type": "../image/type.png",
      "rank": "../image/rank.png",
      "back": "../image/back.png",
      "null": "https://54.gmair.net/material/null_avatar.jpg",
      "0star": "../image/0star.png",
      "1star": "../image/1star.png",
      "2star": "../image/2star.png",
      "3star": "../image/3star.png",
      "4star": "../image/4star.png",
      "5star": "../image/5star.png",
      "tuan": "https://54.gmair.net/material/tuan.png",
      "xiao": "https://54.gmair.net/material/xiao.png",
      "score": "../image/score.png",
      "true": 'https://54.gmair.net/material/true.png',
      "false": 'https://54.gmair.net/material/false.png',
      "study": "../image/study.png",
      "arrow": 'https://54.gmair.net/material/arrow.png'
    },
   
    questions: [
      {
        "questionDescription": "今年是南京大学建校多少周年?",
        "difficulty": "easy",
        "type": "Single",
        "choices": [
          "115",
          "116",
          "117",
          "118"
        ],
        "answer": [
          "116",
        ],
        "choicesString": "三个代表:::毛泽东思想:::邓小平理论:::科学发展观",
        "answerString": "科学发展观"
      },
      {
        "questionDescription": "9测试问题一?",
        "difficulty": "easy",
        "type": "Single",
        "choices": [
          "三个代表",
          "毛泽东思想",
          "邓小平理论",
          "科学发展观"
        ],
        "answer": [
          "科学发展观",
        ],
        "choicesString": "三个代表:::毛泽东思想:::邓小平理论:::科学发展观",
        "answerString": "科学发展观"
      },
      {
        "questionDescription": "25测试问题一?",
        "difficulty": "easy",
        "type": "Single",
        "choices": [
          "三个代表",
          "毛泽东思想",
          "邓小平理论",
          "科学发展观"
        ],
        "answer": [
          "科学发展观",
        ],
        "choicesString": "三个代表:::毛泽东思想:::邓小平理论:::科学发展观",
        "answerString": "科学发展观"
      },
      {
        "questionDescription": "10\"马者所以命形也：白者所以命色也。命色者非命形也，故日白马非马。\"从唯物辩证法的观点看，\"白马非马\"这一命题的错误在于",
        "difficulty": "normal",
        "type": "Multiple",
        "choices": [
          "割裂了事物共性和个性之间的联系",
          "颠倒了事物形态和功能之间的关系",
          "模糊了事物本质和现象之间的联系",
          "混淆了事物内容和形式之间的区别"
        ],
        "answer": [
          "混淆了事物内容和形式之间的区别",
          "颠倒了事物形态和功能之间的关系"
        ],
        "choicesString": "割裂了事物共性和个性之间的联系:::颠倒了事物形态和功能之间的关系:::模糊了事物本质和现象之间的联系:::混淆了事物内容和形式之间的区别",
        "answerString": "混淆了事物内容和形式之间的区别:::颠倒了事物形态和功能之间的关系"
      },
      {
        "questionDescription": "31经济建设是全党的中心工作，坚持以经济建设为中心不动据。就必须坚持以经济体制改革为重点不动据。当前，我国深化经济体制改革的重点是",
        "difficulty": "hard",
        "type": "Single",
        "choices": [
          "扩大优质增量供给，实现供需动态平衡",
          "完善产权制度和要素市场化配置",
          "加快培育国际经济合作和竞争新优势",
          "建立更加有效的区域协调发展新机制"
        ],
        "answer": [
          "完善产权制度和要素市场化配置",
        ],
        "choicesString": "扩大优质增量供给，实现供需动态平衡:::完善产权制度和要素市场化配置:::加快培育国际经济合作和竞争新优势:::建立更加有效的区域协调发展新机制",
        "answerString": "完善产权制度和要素市场化配置"
      }
    ],
    rank: {
      self: {
        "openId": "123456",
        "score": "150",
        "userName": "Gaoyq1996",
        "rank": "4"
      },
      scoreVOS: [
        {
          "openId": "0123456789",
          "score": "290",
          "userName": "wjw6sadasdasdasdsad",
          "rank": "1"
        },
        {
          "openId": "012345678910",
          "score": "290",
          "userName": "wjw6",
          "rank": "2"
        },
        {
          "openId": "012345678",
          "score": "200",
          "userName": "wjw5",
          "rank": "3"
        },
        {
          "openId": "123456",
          "score": "150",
          "userName": "Gaoyq1996",
          "rank": "4"
        },
        {
          "openId": "01234567",
          "score": "120",
          "userName": "wjw1",
          "rank": "5"
        },
        {
          "openId": "1234567",
          "score": "100",
          "userName": "wjw1",
          "rank": "6"
        }
      ]
    },
    score:0
  }
})


/* imgs:{
      "kun1":"https://54.gmair.net/img_webp/kun1.webp",
      "kun2": "https://54.gmair.net/img_webp/kun2.webp",
      "kun3": "https://54.gmair.net/img_webp/kun3.webp",
      "kun4": "https://54.gmair.net/img_webp/kun4.webp",
      "kun5": "https://54.gmair.net/img_webp/kun5.webp",
      "index": "https://54.gmair.net/img_webp/index.webp",
      "msgbox": "https://54.gmair.net/img_webp/msgbox.webp",
      "timer1": "../image/timer1.png",
      "timer2": "../image/timer2.png",
      "timer3": "../image/timer3.png",
      "timer4": "../image/timer4.png",
      "timer5": "../image/timer5.png",
      "timer6": "../image/timer6.png",
      "timer7": "../image/timer7.png",
      "timer8": "../image/timer8.png",
      "rank": "https://54.gmair.net/img_webp/rank.webp",
      "back": "https://54.gmair.net/img_webp/back.webp",
      "null": "https://54.gmair.net/img_webp/null_avatar.webp",
      "0star":"https://54.gmair.net/img_webp/0star.webp",
      "1star": "https://54.gmair.net/img_webp/1star.webp",
      "2star": "https://54.gmair.net/img_webp/2star.webp",
      "3star": "https://54.gmair.net/img_webp/3star.webp",
      "4star": "https://54.gmair.net/img_webp/4star.webp",
      "5star": "https://54.gmair.net/img_webp/5star.webp",
      "tuan": "https://54.gmair.net/img_webp/tuan.webp",
      "xiao": "https://54.gmair.net/img_webp/xiao.webp",
      "score": "../image/score.png",
      "true": 'https://54.gmair.net/img_webp/true.webp',
      "false":'https://54.gmair.net/img_webp/false.webp',
      "study": "../image/study.png",
      "arrow": 'https://54.gmair.net/img_webp/arrow.webp'
    },
    "kun1": "https://54.gmair.net/material/kun1.jpg",
      "kun2": "https://54.gmair.net/material/kun2.jpg",
      "kun3": "https://54.gmair.net/material/kun3.jpg",
      "kun4": "https://54.gmair.net/material/kun4.jpg",
      "kun5": "https://54.gmair.net/material/kun5.jpg",
      "1star": "https://54.gmair.net/material/1star.png",
      "2star": "https://54.gmair.net/material/2star.png",
      "3star": "https://54.gmair.net/material/3star.png",
      "4star": "https://54.gmair.net/material/4star.png",
      "5star": "https://54.gmair.net/material/5star.png",
      "back": "https://54.gmair.net/material/back.png",
      "rank": "https://54.gmair.net/material/rank.jpg",
    */