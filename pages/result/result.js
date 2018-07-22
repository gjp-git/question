// pages/result/result.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: app.globalData.score,
    userInfo: null,
    scale: 1.39,
    showModalStatus: false,
    lastRank:1,
    lastStar:1,
    userRank: 1,
    userStar: 1,
    fish: ['宝宝', '少年', '青春', '励志', '榜样'],
    imgs: app.globalData.imgs
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      score: app.globalData.score,
      userInfo: app.globalData.userInfo,
      lastRank: app.globalData.lastRank,
      lastStar: app.globalData.lastStar,
      userRank: app.globalData.userRank,
      userStar: app.globalData.userStar
    })
    var that = this
    wx.downloadFile({
      url: app.globalData.userInfo.avatarUrl,
      success: function (res1) {

        //缓存头像图片
        that.setData({
          portrait_temp: res1.tempFilePath
        })
        that.drawImage()
        wx.hideLoading()
        setTimeout(function () {
          that.canvasToImage()
        }, 200)
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    return {
      title: this.data.userInfo.nickName + '邀你参加学习新思想答题挑战！',
      imageUrl: this.data.tempFilePath,
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
  },

  share: function () {
    this.onShareAppMessage()
  },
  drawImage() {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res.windowWidth)
        //console.log(res.windowHeight)
        that.data.windowWidth = res.windowWidth
        that.data.windowHeight = res.windowHeight
      }
    })

    //绘制canvas图片


    const ctx = wx.createCanvasContext('myCanvas')
    var bgPath = "../image/score.png"
    var portraitPath = that.data.portrait_temp
    var hostNickname = app.globalData.userInfo.nickName
    var beforeRankPath = that.data.imgs['kun' + that.data.lastRank]
    var afterRankPath = that.data.imgs['kun' + that.data.userRank]
    var arrow = that.data.imgs['arrow']
    var beforeStarPath = that.data.imgs[that.data.lastStar+'star']
    var afterStarPath = that.data.imgs[that.data.userStar + 'star']
    var windowWidth = that.data.windowWidth - 20
    var windowHeight = that.data.windowHeight
    var scale = that.data.scale
    //绘制背景图片

    ctx.drawImage(bgPath, 0, 0, windowWidth, windowWidth * that.data.scale)

    //绘制头像
    ctx.save()
    ctx.beginPath()
    ctx.arc(windowWidth / 2, 0.3 * windowWidth, 0.15 * windowWidth, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(portraitPath, 0.7 * windowWidth / 2, 0.15 * windowWidth, 0.3 * windowWidth, 0.3 * windowWidth)
    ctx.restore()

    ctx.drawImage(beforeRankPath, 0.2 * windowWidth, 0.75 * windowWidth, 0.2 * windowWidth, 0.2 * windowWidth)
    ctx.drawImage(beforeStarPath, 0.4 * windowWidth, 0.8 * windowWidth, 0.5 * windowWidth, 0.1 * windowWidth)
    ctx.drawImage(arrow, 0.475 * windowWidth, 0.95 * windowWidth, 0.1 * windowWidth, 0.075 * windowWidth)
    ctx.drawImage(afterRankPath, 0.2 * windowWidth, 1.05 * windowWidth, 0.2 * windowWidth, 0.2 * windowWidth)
    ctx.drawImage(afterStarPath, 0.4 * windowWidth, 1.1 * windowWidth, 0.5 * windowWidth, 0.1 * windowWidth)


    //绘制第一段文本
    ctx.setFillStyle('#ff0000')
    ctx.setFontSize(0.05 * windowWidth)
    ctx.setTextAlign('center')
    ctx.fillText(hostNickname + '在学习新思想答题挑战中', windowWidth / 2, 0.55* windowWidth)
    ctx.setFillStyle('#ff0000')
    ctx.setFontSize(0.05 * windowWidth)
    ctx.setTextAlign('center')
    ctx.fillText('成长为' + this.data.fish[app.globalData.userRank-1] + '小蓝鲸', windowWidth / 2, 0.65 * windowWidth)
    //绘制第二段文本
    ctx.setFillStyle('#ff0000')
    ctx.setFontSize(0.05 * windowWidth)
    ctx.setTextAlign('center')
    ctx.fillText('快来解锁你的小蓝鲸吧！', windowWidth / 2, 0.75 * windowWidth)
    ctx.draw();
    console.log('draw')
  },
  canvasToImage() {
    var that = this
    var width = that.data.windowWidth
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: width - 20,
      height: (width - 20) * that.data.scale,
      destWidth: that.data.windowWidth,
      destHeight: that.data.windowWidth * that.data.scale,
      canvasId: 'myCanvas',
      success: function (res) {
        console.log('朋友圈分享图生成成功:' + res.tempFilePath)
        that.setData({
          tempFilePath: res.tempFilePath
        })
        /*wx.previewImage({
          current: res.tempFilePath, // 当前显示图片的http链接
          urls: [res.tempFilePath] // 需要预览的图片http链接列表
        })*/
      },
      fail: function (err) {
        console.log('失败')
        console.log(err)
      }
    })
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})
