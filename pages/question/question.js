// pages/question/question.js
const app = getApp()
var interval = 8 * 1000
var total_micro_second = interval
var timerImgIndex = 0

function countdown(that) {
  that.setData({
    clock: dateformat(total_micro_second)
  })
  //
  if ((total_micro_second <= 0 || 0) && that.data.index < that.data.questions.length) {
    that.setData({
      finishFlag: true,
      timerUrl: that.data.imgs['timer1'],
      right: false
    });
    var question = that.data.question
    total_micro_second = interval
    ///
    if (question.answer.length == 1) {
      for (var i = 0; i < question.choices.length; ++i) {
        if (that.data.selected == question.choices[i].value) {
          question.choices[i].checked = true
          if (!app.in_array(that.data.selected, question.answer)) {
            question.choices[i].flag = 'choiceRed'
          }
          break
        }
      }
      if (that.data.selected == question.answer) {
        that.setData({
          score: that.data.score + 10,
          right: true
        })

        console.log(that.data.finishFlag && that.data.right)
      }
    }
    else {
      var flag = true
      var item
      console.log(that.data.selected)
      for (item in that.data.selected) {
        console.log(question.choices.length)
        for (var i = 0; i < question.choices.length; ++i) {
          if (that.data.selected[item] == question.choices[i].value) {
            console.log('1')
            question.choices[i].checked = true
            if (!app.in_array(that.data.selected[item], question.answer)) {
              flag = false
              question.choices[i].flag = 'choiceRed'
            }
          }
        }
      }
      if (flag && that.data.selected.length == question.answer.length) {
        that.setData({
          score: that.data.score + 10,//that.data.question.score
          right: true
        })

        console.log(that.data.finishFlag && that.data.right)
      }
    }
    that.setData({
      selected: '',
      question: question
    })
    
    console.log(that.data.question.choices)
    return
    
  }
  else if (that.data.index == that.data.questions.length){
    return
  }
  setTimeout(function () {
    total_micro_second -= 125
    timerImgIndex = ++timerImgIndex % 8 +1
    that.setData({
      timerUrl: that.data.imgs['timer' + timerImgIndex]
    })
    countdown(that)
  }
    , 125)
}

function dateformat(micro_second) {
  var second = Math.floor(micro_second / 1000)
  return second
}


Array.prototype.remove = function (val) {
  var index = this.indexOf(val)
  if (index > -1) {
    this.splice(index, 1)
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clock: '',
    questions: app.globalData.questions,
    index: 0,
    score: 0,
    question: app.globalData.questions[0],
    finishFlag: false,
    selected:'',
    right: false,
    timerUrl: app.globalData.imgs['timer1'],
    item: {
      avatar: app.globalData.imgs['null'],
      userRank: '',
      userStar: '',
      canUse: false,
      imgs: app.globalData.imgs
    },
    imgs: app.globalData.imgs
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      item: {
        avatar: app.globalData.userInfo.avatarUrl ? app.globalData.userInfo.avatarUrl : this.data.item.avatar,
        userRank: app.globalData.userRank,
        userStar: app.globalData.userStar,
        canUse: app.globalData.canUse,
        imgs: app.globalData.imgs        
      },
      questions: app.globalData.questions,
      question: app.globalData.questions[0]
    })
    console.log(this.data.question)
    wx.hideShareMenu()
    countdown(this)
  },
  submitScore() {
    var that = this
    wx.request({
      url: 'https://54.gmair.net/submitScore',
      data: {
        "openId": app.globalData.openId,
        "score": that.data.score,
        "userName": app.globalData.userInfo.nickName
      },
      method: "POST",
      success: function (res) {
        if (res.data.status == 0) {
          console.log('用户提交分数成功')
          //获得rank star
          app.globalData.lastRank = app.globalData.userRank
          app.globalData.lastStar = app.globalData.userStar
          if (res.data.resultMsg.userRank == "SUN") {
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
          else {
            app.globalData.userRank = 1
          }
          app.globalData.userStar = res.data.resultMsg.star
          app.globalData.score = that.data.score
          wx.redirectTo({
            url: '../result/result'
          })
        }
        else {
          wx.showModal({
            title: '警告',
            content: '网络故障，您将无法正常使用该小程序的功能。请重试。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.submitScore()
              }
            }
          })
        }

      },
      fail: res => {
        console.log('用户提交分数失败')
        that.submitScore()
      }
    })
  },
  nextQuestion: function (options) {
    this.setData({
      index: this.data.index + 1,
    })
    
    if (this.data.index < this.data.questions.length){
      this.setData({
        question: this.data.questions[this.data.index],
        finishFlag: false
      })
      
      countdown(this)
    }
    else{
      console.log(this.data.score)
      this.submitScore()//submitScore接口
      /*
      //删除---
      app.globalData.score = this.data.score
      console.log(app.globalData.score)
      wx.redirectTo({
        url: '../result/result'
      })
      //删除---
      */
    }
  },
  
  touchSingle: function (e) {
    if (!this.data.finishFlag) {
      var question = this.data.question
      for (var i = 0; i < question.choices.length; ++i) {
        if (e.target.id == question.choices[i].value) {
          if (question.choices[i].selected == 'selected') {
            question.choices[i].selected = ''
            this.setData({
              selected: ''
            })
          }
          else {
            question.choices[i].selected = 'selected'
            this.setData({
              selected: e.target.id
            })
          }
        }
        else {
          question.choices[i].selected = ''
        }
      }
      this.setData({
        question: question
      })

    }
  }, 
  touchMultiple: function (e) {
    if (!this.data.finishFlag) {
      var question = this.data.question
      var newSelect = this.data.selected == '' ? new Array() : this.data.selected
      console.log(newSelect)
      for (var i = 0; i < question.choices.length; ++i) {
        if (e.target.id == question.choices[i].value) {
          if (question.choices[i].selected == 'selected') {
            question.choices[i].selected = ''
            newSelect.remove(e.target.id)
          }
          else {
            question.choices[i].selected = 'selected'
            newSelect.push(e.target.id)
          }
        }
      }

      this.setData({
        selected: newSelect,
        question: question
      })

    }
  }, 
  submit: function () {
    total_micro_second = 0
    
  }
})