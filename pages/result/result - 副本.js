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
    showModalStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      score: app.globalData.score,
      userInfo: app.globalData.userInfo
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
      title: this.data.userInfo.nickName + '邀你参加答题挑战~',
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

    var qrPath = '../image/5star.png'//that.data.qrcode_temp
    var windowWidth = that.data.windowWidth - 20
    var windowHeight = that.data.windowHeight
    var scale = that.data.scale
    //绘制背景图片

    ctx.drawImage(bgPath, 0, 0, windowWidth, windowWidth * that.data.scale)

    //绘制头像
    ctx.save()
    ctx.beginPath()
    ctx.arc(windowWidth / 2, 0.4 * windowWidth, 0.15 * windowWidth, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(portraitPath, 0.7 * windowWidth / 2, 0.25 * windowWidth, 0.3 * windowWidth, 0.3 * windowWidth)
    ctx.restore()
    //绘制第一段文本
    ctx.setFillStyle('#ff0000')
    ctx.setFontSize(0.06 * windowWidth)
    ctx.setTextAlign('center')
    ctx.fillText(hostNickname + ' 在挑战中得到 ' + that.data.score + ' 分', windowWidth / 2, 0.9 * windowWidth)
    //绘制第二段文本
    ctx.setFillStyle('#ff0000')
    ctx.setFontSize(0.06 * windowWidth)
    ctx.setTextAlign('center')
    ctx.fillText('邀请你一起来挑战啦~', windowWidth / 2, 1.0 * windowWidth)
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
        if (true) {
          that.util('open')
        }
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
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 0, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })
      console.log('window')
      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  }
})
