<template>
	<view class="content">
		<view class="login-t">
			<image class="login-logo" :src="logoImage" mode="aspectFill"></image>
		</view>
		<view class="login-m">
			<view class="login-item">
				<input type="number" v-model="mobile" :maxlength="maxMobile" placeholder="请输入手机号码" focus placeholder-class="login-item-i-p"/>
			</view>
			<view class="login-item">
				<input class="login-item-input" placeholder-class="login-item-i-p" type="text" v-model="code" placeholder="输入验证码"/>
				<button :class="sendCodeBtn" hover-class="btn-hover" @click="sendCode" v-if="verification">发送验证码</button>
				<span class="btn btn-g" v-if="!verification">{{ timer }} 秒后重新获取</span>
			</view>
			
		</view>
		<view class="login-b">
			<!-- #ifdef H5|APP-PLUS|APP-PLUS-NVUE -->
			<button :class="btnb"  @click="login()" hover-class="btn-hover">登录</button>
			<view class="registered-item">
				<button class="btn btn-g btn-square" @click="selectLoginType()">账号密码登录</button>
				<button class="btn btn-g btn-square registered" @click="toReg">注册</button>
			</view>
			
			<!-- #endif -->
			<!-- #ifdef MP -->
			<button :class="btnb" @click="showTopTips()" hover-class="btn-hover">登录</button>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
import { goBack } from '@/config/mixins.js'	
export default {
	mixins: [goBack],
	data () {
		return {
			maxMobile: 11,
			mobile: '', // 用户手机号
			code: '', // 短信验证码
			user_wx_id: 0, //授权id
			verification: true, // 通过v-show控制显示获取还是倒计时
			timer: 60, // 定义初始时间为60s
			btnb:'btn btn-square btn-all' //按钮背景
		}
	},
	onLoad (option) {
		let _this = this;
		_this.timer = parseInt(_this.$db.get('timer'));
		if(_this.timer != null && _this.timer > 0){
			_this.countDown();
			_this.verification = false;
		}
		
		if (option.user_wx_id) {
			this.user_wx_id = option.user_wx_id;
			uni.setNavigationBarTitle({
				title: '绑定账号'
			});
		}
	},
	computed: {
		// 验证手机号
		rightMobile() {
			let res = {};
			if (!this.mobile) {
				res.status = false;
				res.msg = '请输入手机号';
			} else if (!/^1[345678]{1}\d{9}$/gi.test(this.mobile)) {
				res.status = false;
				res.msg = '手机号格式不正确';
			} else {
				res.status = true;
			}
			return res;
		},
		// 动态计算发送验证码按钮样式
		sendCodeBtn: {
			get () {
				let btn = 'btn btn-g'
				if (this.mobile.length === this.maxMobile && this.rightMobile.status) {
					return btn + ' btn-b'
				} else {
					return btn
				}
			}
		},
		logoImage() {
			return this.$store.state.config.shop_logo;
		}
	},
	onShow() {
		let _this = this;
		let userToken = _this.$db.get("userToken");
		if (userToken||userToken!='') {
			uni.switchTab({
				url: '/pages/member/index/index'
			})
			return true;
		}
		_this.timer = parseInt(_this.$db.get('timer'));
		if(_this.timer != null && _this.timer > 0){
			_this.countDown();
			_this.verification = false;
		}
	},
	methods: {
		// 发送短信验证码
		sendCode() {
			if (!this.rightMobile.status) {
				this.$common.errorToShow(this.rightMobile.msg);
			} else {
				this.$common.loadToShow('发送中...');
				setTimeout(() => {
					this.$common.loadToHide();
					this.$api.sms({ mobile: this.mobile, code: 'login' }, res => {
						if (res.status) {
							this.timer = 60;
							this.verification = false;
							this.$common.successToShow(res.msg);
							this.countDown(); // 执行验证码计时
							this.btnb = 'btn btn-square btn-all btn-b';
						} else {
							this.$common.errorToShow(res.msg)
						}
					});
				}, 1000);
			}
		},
		// 去注册
		toReg () {
			this.$common.navigateTo('/pages/login/register/index')
		},
		// 验证码倒计时
		countDown() {
			let auth_timer = setInterval(() => {
				// 定时器设置每秒递减
				this.timer--; // 递减时间
 				uni.setStorage({
 					key: 'timer',
 					data: this.timer,
 					success: function() {}
 				});
				if (this.timer <= 0) {
					this.verification = true; // 60s时间结束还原v-show状态并清除定时器
					clearInterval(auth_timer);
				}
			}, 1000);
		},
		// 登录
		login() {
			var _this = this;
			if (!_this.rightMobile.status) {
				_this.$common.errorToShow(_this.rightMobile.msg);
			} else {
				// 短信验证码登录
				if (!_this.code) {
					_this.$common.errorToShow('请输入短信验证码!');
				} else {
					let data = {
						mobile: _this.mobile,
						code: _this.code
					};
					
					let invicode = _this.$db.get('invitecode')
					if (invicode) {
						data.invitecode = invicode
					}
					
					_this.$api.smsLogin(data, res => {
						if (res.status) {
							this.$db.set('userToken', res.data);
							_this.redirectHandler();
						} else {
							_this.$common.errorToShow(res.msg);
						}
					});
				}
			}
		},
		// 重定向跳转 或者返回上一个页面
		redirectHandler() {
			this.$common.successToShow('登录成功!', () => {
				this.$db.set('timer', 0);
				this.$db.del('invitecode')
				let redirect = this.$store.state.redirectPage ? this.$store.state.redirectPage : '/pages/member/index/index'
				this.$store.commit({
					type: 'redirect',
					page: ''
				})
				uni.reLaunch({
					url: redirect
				})
			})
		},
		// 跳转到普通登录
		toLogin() {
			uni.navigateTo({
				url: '../../login/login/index'
			});
		},
		//提交按钮
		showTopTips: function() {
			let _this = this;
			if (_this.mobile == '') {
				_this.$common.errorToShow('请输入手机号码');
				return false;
			}
			if (this.code == '') {
				_this.$common.errorToShow('请输入验证码');
				return false;
			}
			if( _this.user_wx_id==0){
				_this.$common.errorToShow('登录失败，请稍后再试',function(){
					uni.navigateBack({
						delta: 1
					});
				});
				return false;
			}
			var data = {
				mobile: _this.mobile,
				code: _this.code,
				platform: 2, //平台id，标识是小程序登陆的
				user_wx_id: _this.user_wx_id //微信小程序接口存不了session，所以要绑定的id只能传到前台
			};
			//有推荐码的话，带上
			var invitecode = _this.$db.get('invitecode');
			if (invitecode) {
				data.invitecode = invitecode;
			}
			_this.$api.smsLogin(data, function(res) {
				if (res.status) {
					_this.redirectHandler();
				} else {
					//报错了
					_this.$common.errorToShow(res.msg);
				}
			});
		},
		selectLoginType() {
			this.$common.redirectTo('./index1')
		}
	}
}
</script>

<style>
.content{
	/*  #ifdef  H5  */
	height:calc(100vh - 90upx);
	/*  #endif  */
	/*  #ifndef  H5  */
	height: 100vh;
	/*  #endif  */
	background-color: #fff;
	
	padding: 0upx 100upx;
}
.login-t{
	text-align: center;
	padding: 50upx 0;
}
.login-logo{
	width: 180upx;
	height: 180upx;
	border-radius: 20upx;
	background-color: #f8f8f8;
	/* margin: 0 auto; */
}
.login-m{
	margin-bottom: 100upx;
}
.login-item{
	border-bottom: 2upx solid #d0d0d0;
	overflow: hidden;
	padding: 10upx;
	font-size: 32upx;
	color: #333;
	margin-bottom: 30upx;
}
.login-item-input{
	display: inline-block;
	width: 60%;
}
.login-item .btn{
	display: inline-block;
	font-size: 28upx;
	border: none;
	width: 40%;
	padding: 0;
	line-height: 1.7;
	float: right;
}
.login-b .btn{
	color: #999;
}
.btn-b{
	color: #fff !important;
}
.registered-item{
	overflow: hidden;
	width: 100%;
}
.registered{	
	float: right;
}
.registered-item .btn-square{
	color: #333;
	font-size: 26upx;
}
</style>
