//app.js
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          var code = res.code
          /*wx.request({
            url: '#',
            data: {
              js_code: code
            },
            success: function (res) {
              if (res.status==0){
                console.log(res.resultMsg)
                this.globalData.openId = res.resultMsg
                this.globalData.userRank = res.resultMsg
                this.globalData.userStar = res.resultMsg
              }
               // 获取用户信息
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = res.userInfo
                  console.log(res.userInfo)
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                }
              })
            }
          })*/
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    
    wx.getUserInfo({
      success: function (res) {
        this.globalData.userInfo = res.userInfo
        console.log(res.userInfo)
        console.log('onLaunch')
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      },
      fail: function () {
        // 调用微信弹窗接口
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法正常使用该小程序的功能。请10分钟后再次点击授权，或者删除小程序重新进入。',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    })
   
    //
    /*
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.userInfo']) {
          console.log('in')
          wx.getUserInfo({
            success: res => {
              //this.globalData.canUse = true
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo)
              console.log('onLaunch')
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail: res => {
              //this.globalData.canUse = false
              wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法正常使用该小程序的功能。请10分钟后再次点击授权，或者删除小程序重新进入。',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
              console.log(res)
            }
          })
        }
        else{
          //this.globalData.canUse = true
          wx.getUserInfo({
            success: res => {
              wx.getSetting({
                success: res => {
                  console.log(res)
                }
              })
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo)
              console.log('onLaunch')
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail: res => {
              console.log(res)
              wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法正常使用该小程序的功能。请10分钟后再次点击授权，或者删除小程序重新进入。',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
            }
          })
        }
      }
    }) */
    
  }, 
  in_array: function(searchString, array) {
        for(var i = 0; i<array.length; i++) {
      if (searchString == array[i]) return true;
    }
    return false;
  },
  globalData: {
    canUse:false,
    userInfo:null,
    openId: 123456,
    userRank: 1,
    userStar: 3,
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