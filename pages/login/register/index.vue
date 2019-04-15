<template>
	<view class="content">
		<view class="reg-t">
			<image class="reg-logo" :src="logoImage" mode="aspectFill"></image>
		</view>
		<view class="reg-m">
			<view class="reg-item">
				<input type="number" v-model="mobile" :maxlength="maxMobile" placeholder="请输入手机号码" focus placeholder-class="reg-item-i-p"/>
			</view>
			<view class="reg-item">
				<input class="reg-item-input" placeholder-class="reg-item-i-p" type="text" v-model="code" placeholder="输入验证码"/>
				<button :class="sendCodeBtn" @click="sendCode" v-if="verification">发送验证码</button>
				<span class="btn btn-g" v-if="!verification">{{ timer }} 秒后重新获取</span>
			</view>
			<view class="reg-item" v-if="type === 1">
				<input class="login-item-input" :password="true" placeholder-class="login-item-i-p" type="text" v-model="pwd" placeholder="请输入密码"/>
			</view>
		</view>
		<view class="reg-b">
			<button :class="regButtonClass"  @click="toReg()" hover-class="btn-hover" v-if="type === 1">注册</button>
			<button :class="regButtonClass"  @click="toBind()" hover-class="btn-hover" v-else>绑定</button>
		</view>
		<view class="registered-item">
			<!-- <button class="btn btn-g btn-square" @click="selectLoginType()">账号密码登录</button> -->
			<button class="btn btn-g btn-square registered" @click="toLogin">已有账号，立即登录</button>
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
			pwd: '', // 用户密码
			verification: true, // 通过v-show控制显示获取还是倒计时
			timer: 60, // 定义初始时间为60s
			btnb: 'btn btn-square btn-all', //按钮背景
			type: 1 // 类型 1普通注册 2授权账号绑定
		}
	},
	onLoad (options) {
		let _this = this;
		_this.timer = parseInt(_this.$db.get('timer'));
		if(_this.timer != null && _this.timer > 0){
			_this.countDown();
			_this.verification = false;
		}
		
		if (options.invitecode) {
			this.$db.set('invitecode', options.invitecode)
		}
		
		if (options.type && options.type === 'bind') {
			this.type = 2
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
			} else if (!/^1[3456789]{1}\d{9}$/gi.test(this.mobile)) {
				res.status = false;
				res.msg = '手机号格式不正确';
			} else {
				res.status = true;
			}
			return res;
		},
		// 动态更改登录按钮bg
		regButtonClass () {
			if (this.type === 1) {
				return this.mobile && this.mobile.length === 11 && this.pwd && this.code ? this.btnb + ' btn-b' : this.btnb
			} else {
				return this.mobile && this.mobile.length === 11 && this.code ? this.btnb + ' btn-b' : this.btnb
			}
		},
		// 动态修改发送验证码按钮
		sendCodeBtn () {
			let btn = 'btn btn-g'
			if (this.mobile.length === this.maxMobile && this.rightMobile.status) {
				return btn + ' btn-b'
			} else {
				return btn
			}
		},
		logoImage() {
			return this.$store.state.config.shop_logo;
		}
	},
	onShow() {
		let _this = this;
		let userToken = _this.$db.get("userToken");
		if (userToken || userToken!='') {
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
					this.$api.sms({ mobile: this.mobile, code: 'reg' }, res => {
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
		toReg () {
            if (!this.rightMobile.status) {
				this.$common.errorToShow(this.rightMobile.msg)
            } else if (!this.code) {
				this.$common.errorToShow('请输入短信验证码')
            } else if (!this.pwd) {
				this.$common.errorToShow('请输入登录密码')
            } else {
                let data = {
					mobile: this.mobile,
					code: this.code,
					password: this.pwd
				}
				
				// 获取邀请码
				let invicode = this.$db.get('invitecode')
                if (invicode) {
					data.invitecode = invicode
				}
				
                this.$api.smsLogin(data, res => {
                    if (res.status) {
						this.$db.set('userToken', res.data)
						this.redirectHandler('注册成功!')
                    } else {
						this.$common.errorToShow(res.msg)
					}
                })
            }
        },
		// 第三方登录账号绑定
		toBind () {
			if (!this.rightMobile.status) {
				this.$common.errorToShow(this.rightMobile.msg)
			} else if (!this.code) {
				this.$common.errorToShow('请输入短信验证码')
			} else {
                let data = {
					mobile: this.mobile,
					code: this.code,
					uuid: this.$db.get('uuid')
				}
				
				// 获取邀请码
				let invicode = this.$db.get('invitecode')
                if (invicode) {
					data.invitecode = invicode
				}
				
                this.$api.trustBind(data, res => {
                    if (res.status) {
                        this.$db.set('userToken', res.data)
						this.redirectHandler('绑定成功!')
                    } else {
						this.$common.errorToShow(res.msg)
					}
                })
            }
		},
		// 注册成功后页面跳转操作
		redirectHandler (completedName = '注册成功!') {
			this.$common.successToShow(completedName, () => {
				// 清除随机uid 和 邀请码
				this.$db.del('uuid')
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
		toLogin () {
			this.$common.navigateTo('/pages/login/login/index1')
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
.reg-t{
	text-align: center;
	padding: 50upx 0;
}
.reg-logo{
	width: 180upx;
	height: 180upx;
	border-radius: 20upx;
	background-color: #f8f8f8;
	/* margin: 0 auto; */
}
.reg-m{
	margin-bottom: 100upx;
}
.reg-item{
	border-bottom: 2upx solid #d0d0d0;
	overflow: hidden;
	padding: 10upx;
	font-size: 32upx;
	color: #333;
	margin-bottom: 30upx;
}
.reg-item-input{
	display: inline-block;
	width: 60%;
}
.reg-item .btn{
	display: inline-block;
	font-size: 28upx;
	border: none;
	width: 40%;
	padding: 0;
	line-height: 1.7;
	float: right;
}
.reg-b .btn{
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
