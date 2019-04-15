<template>
	<view class="content">
		<view class="login-m">
			<view class="login-item">
				<image class="logo" :src="applogo"  mode=""></image>
				<view class="app-name">
					{{ appTitle }}
				</view>
			</view>
		</view>
		<view class="login-b">
			<button class="btn btn-square btn-b btn-all " open-type="getUserInfo"
				@getuserinfo="getUserInfo" hover-class="btn-hover">授权登录</button>
			<!-- <button class="btn btn-g btn-all">手机号登录</button> -->
		</view>
	</view>
</template>

<script>
export default {
	data () {
		return {
			appTitle: this.$config.shopName,
			open_id: '',
			applogo: this.$config.shopLogo
		};
	},
	onLoad() {
		let _this = this;
		this.getCode(function(code) {
			var data = {
				code: code
			};
			_this.$api.login1(data, function(res) {
				if (!res.status) {
					_this.$common.successToShow(res.msg, function() {
						uni.navigateBack({
							delta: 1
						});
					});
				} else {
					_this.open_id = res.data;
				}
			});
		});
	},
	methods: {
		getCode: function(callback) {
			uni.login({
				success: function(res) {
					if (res.code) {
						callback(res.code);
						return res.code;
					} else {
						//login成功，但是没有取到code
						this.$common.errorToShow('未取得code');
					}
				},
				fail: function(res) {
					this.$common.errorToShow('用户授权失败wx.login');
				}
			});
		},
		getUserInfo: function(e) {
			let _this = this;
			//return false;
			if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
				_this.$common.errorToShow('未授权');
			} else {
				var data = {
					open_id: _this.open_id,
					iv: e.detail.iv,
					edata: e.detail.encryptedData,
					signature: e.detail.signature
				};
				//有推荐码的话，带上
				var invitecode = _this.$db.get('invitecode');
				if (invitecode) {
					data.invitecode = invitecode;
				}
				_this.toLogin(data);
			}
		},
		//实际的去登陆
		toLogin: function(data) {
			let _this = this;
			_this.$api.login2(data, function(res) {
				if (res.status) {
					//判断是否返回了token，如果没有，就说明没有绑定账号，跳转到绑定页面
					
					if (typeof res.data.token == 'undefined') {
						uni.redirectTo({
							url:'/pages/login/login/index?user_wx_id='+res.data.user_wx_id
						});
					} else {						
						//登陆成功，设置token，并返回上一页
						_this.$db.set('userToken', res.data.token);
						uni.navigateBack({
							delta: 1
						});
						return false;
					}
				} else {
					_this.$common.errorToShow('登录失败，请重试');
				}
			});
		}
	},
}	
</script>

<style>
.content{
	background-color: #fff;
	height: 100vh;
	padding: 200upx 100upx 0;
}
.login-m{
	margin-bottom: 100upx;
}
.login-item{
	text-align: center;
}
.logo{
	width: 160upx;
	height: 160upx;
	border-radius: 20upx;
}
.app-name{
	font-size: 28upx;
	color: #999;
}
.login-b .btn-g{
	margin-top: 40upx;
}

</style>
