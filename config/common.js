import * as db from './db.js' //引入common
import store from './../store'
//把obj对象里的值覆盖到newobj里面
function deepCopy(newobj,obj) {
  if (typeof obj != 'object') {
    return obj;
  }
  for (var attr in obj) {
    var a = {};
    if (newobj[attr]){
      a = newobj[attr];
    }
    newobj[attr] = deepCopy(a,obj[attr]);
  }
  return newobj;
}

//跳转到登陆页面
function jumpToLogin(method) {
  var now_time = Date.parse(new Date());
  var value = db.get('jump_to_login');
  if(!value){
    value=0;
  }
  if((now_time - value)> 3000 ){
    //db.set('jump_to_login',now_time); //暂时屏蔽登录时间查询
		// 将当前页面route存vuex中 登录注册后跳转
		let pages = getCurrentPages();
		let page = pages[pages.length - 1]
		store.commit({
			type: 'redirect',
			page: '/' + page.route,
		})
		
    uni.showToast({
      title: '请登录...',
      icon: 'success',
      duration: 2000,
      success: function (res) {
		  // #ifdef H5
		  uni.navigateTo({
					url: '/pages/login/login/index1'
		  })
		  // #endif
		  // #ifdef MP-WEIXIN
			uni.navigateTo({
					url: '/pages/login/choose/index',
					animationType: 'pop-in',
					animationDuration: 200
			});
		  // #endif
      }
    })
  }else{
  }
}

//当出错的时候，显示错误信息，并且跳转 弃用
/* function errorToBack(msg = '出错了，请重试',delta=1){
  uni.showToast({
    title: msg,
    icon: 'none',
    duration: 2000,
  });
  if(delta > 0){
    setTimeout(function () {
      uni.navigateBack({
        delta: delta
      })
    }, 1000);
  }
} */
//操作成功后，的提示信息
function successToShow(msg='保存成功', callback=function(){}){
  uni.showToast({
    title: msg,
    icon: 'success',
    duration: 2000,
  });
  setTimeout(function () {
    callback();
  }, 500);
}


//操作失败的提示信息
function errorToShow(msg = '操作失败', callback = function () { }) {
  uni.showToast({
    title: msg,
    icon: 'none',
    duration: 2000,
  });
	setTimeout(function () {
	  callback();
	}, 2000);
}

//加载显示
function loadToShow(msg = '加载中') {
  uni.showToast({
    title: msg,
    icon: 'loading',
  });
}

//加载隐藏
function loadToHide() {
  uni.hideToast();
}

// 提示框
function modelShow (title = '提示', content = '确认执行此操作吗?', callback = () => {}, confirmText = '确定', cancelText = '取消') {
	uni.showModal({
			title: title,
			content: content,
			confirmText: confirmText,
			cancelText: cancelText,
			success: function (res) {
					if (res.confirm) {
							// 用户点击确定操作
							setTimeout(() => {
								callback()
							}, 500)
					} else if (res.cancel) {
							// 用户取消操作
							console.log('用户点击取消');
					}
			}
	});
}


//时间戳转时间格式
function timeToDate(date) {
  var date = new Date(date * 1000);//如果date为13位不需要乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return Y + M + D + h + m + s;
}

function time2date(micro_second) {
    var time = {};
    // 总秒数
    var second = Math.floor(micro_second);
    // 天数
    time.day = PrefixInteger(Math.floor(second / 3600 / 24), 2);
    // 小时
    time.hour = PrefixInteger(Math.floor(second / 3600 % 24), 2);
    // 分钟
    time.minute = PrefixInteger(Math.floor(second / 60 % 60), 2);
    // 秒
    time.second = PrefixInteger(Math.floor(second % 60), 2);

    var newtime = '';
    if (time.day > 0) {
        newtime = time.day + '天' + time.hour + '小时' + time.minute + '分' + time.second + '秒';
    } else {
        if (time.hour != 0) {
            newtime = time.hour + '小时' + time.minute + '分' + time.second + '秒';
        } else {
            newtime = time.minute + '分' + time.second + '秒';
        }
    }
    return newtime;
}

//货币格式化
function formatMoney(number, places, symbol, thousand, decimal) {
  number = number || 0;
  places = !isNaN(places = Math.abs(places)) ? places : 2;
  symbol = symbol !== undefined ? symbol : "￥";
  thousand = thousand || ",";
  decimal = decimal || ".";
  var negative = number < 0 ? "-" : "",
    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
  return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
}
function throttle(fn, context, delay) {
  clearTimeout(fn.timeoutId);
  fn.timeoutId = setTimeout(function () {
    fn.call(context);
  }, delay);
}
//团购/秒杀列表倒计时
function groupCountDown(that) {
  var group = that.data.group;
    var nowTime = new Date().getTime();
    for (var i = 0; i < group.length; i++){
      var startTime = group[i].stime * 1000 || [];
      if (startTime - nowTime>0){
        group[i].lasttime = '即将开始';
      }else{
        var endTime = group[i].etime * 1000 || [];
        var total_micro_second = endTime - nowTime || [];
        if (total_micro_second <= 0) {
          group[i].lasttime = '已经结束';
        } else {
          group[i].lasttime = dateformat(total_micro_second)
        }
      }
    }
    
    // 渲染倒计时时钟
    that.setData({
      group: group
    });
    setTimeout(function () {
      total_micro_second -= 1000;
      groupCountDown(that);
    }, 1000)
  }

//秒杀列表倒计时
function seckillCountDown(that) {
  var seckill = that.data.seckill;
  var nowTime = new Date().getTime();
  for (var i = 0; i < seckill.length; i++) {
    var endTime = seckill[i].etime * 1000 || [];
    var total_micro_second = endTime - nowTime || [];
    if (total_micro_second <= 0) {
      seckill[i].lasttime = '已经结束';
    } else {
      seckill[i].lasttime = dateformat(total_micro_second)
    }
  }
  // 渲染倒计时时钟
  that.setData({
    seckill: seckill
  });
  setTimeout(function () {
    total_micro_second -= 1000;
    seckillCountDown(that);
  }, 1000)
}

//团购/秒杀详情倒计时
function groupDetailCountDown(that) {
  var goodsInfo = that.data.goodsInfo;
  var nowTime = new Date().getTime();
  var endTime = goodsInfo.etime * 1000 || [];
    var total_micro_second = endTime - nowTime || [];
    if (total_micro_second <= 0) {
      goodsInfo.lasttime = '已经结束';
    } else {
      goodsInfo.lasttime = dateformat(total_micro_second)
    }
  
  // 渲染倒计时时钟
  that.setData({
    goodsInfo: goodsInfo
  });
  setTimeout(function () {
    total_micro_second -= 1000;
    groupDetailCountDown(that);
  }, 1000)
}


// 时间格式化输出，如11:03 25:19 每1s都会调用一次
function dateformat(micro_second) {
		var time = {};
		// 总秒数
		var second = Math.floor(micro_second / 1000);
		  // 天数
		time.day = PrefixInteger(Math.floor(second / 3600 / 24),2);
		  // 小时
		time.hour = PrefixInteger(Math.floor(second / 3600 % 24),2);
		  // 分钟
		time.minute = PrefixInteger(Math.floor(second / 60 % 60),2);
		  // 秒
		time.second = PrefixInteger(Math.floor(second % 60),2);
		return time;
}


//不足位数前面补0
function PrefixInteger(num, length) {
  return (Array(length).join('0') + num).slice(-length); 
}

//验证是否是手机号
function isPhoneNumber(str){
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
}



/**
 * 
 * 对象参数转为url参数
 * 
 */
function builderUrlParams(url, data) {
		if(typeof(url) == 'undefined' || url == null || url == '') {
				return '';
		}
		if(typeof(data) == 'undefined' || data == null || typeof(data) != 'object') {
				return '';
		}
		url += (url.indexOf("?") != -1) ? "" : "?";
		for(var k in data) {
				url += ((url.indexOf("=") != -1) ? "&" : "") + k + "=" + encodeURI(data[k]);
		}
		return url;
}

/**
 * 使用循环的方式判断一个元素是否存在于一个数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 */
function isInArray(arr, value) {
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true;
    }
  }
  return false;
}
/**
 * 统一跳转
 */
function navigateTo(url){
	uni.navigateTo({
    url:url,
		animationType:'pop-in',
		animationDuration:300
	});
}


/**
 *  关闭当前页面并跳转
 */
function redirectTo (url) {
	uni.redirectTo({
		url: url,
		animationType: 'pop-in',
		animationDuration: 300
	})
}


/**
 * 
 *  判断是否在微信浏览器 true是
 */
function isWeiXinBrowser () {
    // window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
    let ua = window.navigator.userAgent.toLowerCase()
    // 通过正则表达式匹配ua中是否含有MicroMessenger字符串
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true
    } else {
        return false
    }
}

export {
  deepCopy,
  jumpToLogin,
  timeToDate,
  formatMoney,
  /* errorToBack, */
  successToShow,
  throttle,
  groupCountDown,
  groupDetailCountDown,
  seckillCountDown,
  errorToShow,
  time2date,
  isPhoneNumber,
  isInArray,
	loadToShow,
	loadToHide,
	navigateTo,
	redirectTo,
	modelShow,
	builderUrlParams,
	isWeiXinBrowser
}
