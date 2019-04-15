<template>
	<view class="content">
		<view class="login-t">
			<image class="login-logo" :src="logoImage" mode="aspectFill"></image>
		</view>
		<view v-if="!weixinBrowser">
			<view class="login-m">
				<view class="login-item">
					<input type="number" v-model="mobile" :maxlength="maxMobile" placeholder="请输入手机号码" focus placeholder-class="login-item-i-p"/>
				</view>
				<view class="login-item">
					<input style="width: 100%;" class="login-item-input" :password="true" placeholder-class="login-item-i-p" type="text" v-model="pwd" placeholder="请输入密码"/>
				</view>
				<view class="login-item" v-if="isCaptcha">
					<input class="login-item-input" placeholder-class="login-item-i-p" type="text" v-model="captcha" placeholder="输入验证码"/>
					<img :src="captchaUrl" alt="">
				</view>
				
			</view>
			<view class="login-b">
				<button :class="loginButtonClass"  @click="loginHandler()" hover-class="btn-hover">登录</button>
				<view class="registered-item">
					<button class="btn btn-g btn-square" @click="selectLoginType()">短信验证码登录</button>
					<button class="btn btn-g btn-square registered" @click="toReg">注册</button>
				</view>
				
			</view>
		</view>
		<!--  微信浏览器里 -->
		<view v-else>
			
			<view class="login-b" 
			v-for="(item, index) in thirdPartyLogins" 
			:key="index"
			>
				<button 
				class="btn btn-square btn-all btn-b"  
				hover-class="btn-hover"
				v-for="(child, key) in item"
				:key="key"
				v-if="key == 'weixin'"
				@click="thirdPartyLoginHandle(child.url)"
				>微信登录</button>
			</view>
			
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/config/config.js'
import { goBack } from '@/config/mixins.js'
export default {
	mixins: [goBack],
	data () {
		return {
			maxMobile: 11,
			mobile: '',	// 手机号
			pwd: '',	// 密码
			isCaptcha: false, // 是否需要验证码
			captcha: '', // 输入的验证码
			captchaUrl: '', // 验证码图片地址
			btnb: 'btn btn-square btn-all', // 按钮bg
			weixinBrowser: false, // 是否是微信浏览器
			thirdPartyLogins: [], // 第三方登录列表
		}
	},
	onLoad (options) {
		if (options.invitecode) {
			this.$db.set('invitecode', options.invitecode)
		}
		// 判断浏览器环境
		this.weixinBrowser = this.$common.isWeiXinBrowser()
		if (this.weixinBrowser) {
			this.getAuths()
		}
	},
	computed: {
		// 动态更改登录按钮bg
		loginButtonClass () {
			return this.mobile && this.mobile.length === 11 && this.pwd ? this.btnb + ' btn-b' : this.btnb
		},
		logoImage() {
			return this.$store.state.config.shop_logo;
		}
	},
	methods: {
		// 验证手机号
		rightMobile() {
			let res = {};
			if (!this.mobile) {
				res.status = false;
				res.msg = '请输入手机号';
			} else if (!/^1[345678]{1}\d{9}$/gi.test(this.mobile)) {
				res.status = false;
				res.msg = '手机号格式不正确';
			} else if (!this.pwd){
				res.status = false
				res.msg = '请输入密码'
			} else {
				res.status = true;
			}
			return res;
		},
		// 登录处理
		loginHandler () {
			if (this.mobile && this.mobile.length === 11 && this.pwd) {
				if (!this.rightMobile().status) {
					this.$common.errorToShow(this.rightMobile().msg)
				} else {
					this.toLogin()
				}
 			}
		},
		// 获取验证码图片地址
		getCaptchaUrl () {
			this.captcha = baseUrl + 'captcha.html'
		},
		// 去注册
		toReg () {
			this.$common.navigateTo('/pages/login/register/index')
		},
		// 去登录
		toLogin () {
			let data = {
				mobile: this.mobile,
				password: this.pwd
			}
			
			if (this.isCaptcha) {
				data.captcha = this.captcha
			}
			
			// 获取邀请码
			let invicode = this.$db.get('invitecode')
			if (invicode) {
				data.invitecode = invicode
			}
			
			this.$api.login(data, res => {
				if (res.status) {
					this.$db.set('userToken', res.data);
					this.redirectHandler()
				} else {
					this.$common.errorToShow(res.msg, () => {
						// 需要输入验证码 或者 验证码错误刷新
						if (res.data === 10013 || res.data === 10012) {
							this.isCaptcha = true
						}
						
						// 登录需要验证码
						if (this.isCaptcha) {
							this.getCaptchaUrl()
						}
					})
				}
			})
		},
		// 重定向跳转 或者返回上一个页面
		redirectHandler() {
			this.$db.del('invitecode')
			let redirect = this.$store.state.redirectPage ? this.$store.state.redirectPage : '/pages/member/index/index'
			this.$store.commit({
				type: 'redirect',
				page: ''
			})
			uni.reLaunch({
				url: redirect
			})
		},
		// 登录方式切换
		selectLoginType () {
			this.$common.redirectTo('./index')
		},
		// 获取第三方登录列表
		getAuths () {
			let data = {
				url: baseUrl,
				uuid: this.getNonDuplicateID()
			}
			
            this.$api.getTrustLogin(data, res => {
                if (res.status) {
                    this.thirdPartyLogins = res.data
                }
            })
		},
		// 生成一个用不重复的ID
        getNonDuplicateID () {
            let uid = Math.random().toString(36).substr(3)
            this.$db.set('uuid', uid)
            return uid
        },
		// 第三方登录授权
		thirdPartyLoginHandle (url) {
			window.location.href = url
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
