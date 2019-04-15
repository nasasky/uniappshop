<template>
	<view class="content">
		
		<!-- 用户头像header -->
		<view class='member-top'>
			<image class='bg-img' src='../../../static/image/member-bg.png'></image>
			<view class='member-top-c'>
				<image class='user-head-img' mode="aspectFill" :src='userInfo.avatar'></image>
				<view class='user-name'>{{ userInfo.nickname }}</view>
			</view>
		</view>
		<!-- 用户头像header end -->
		
		
		<!-- 订单列表信息 -->
		<view class='cell-group'>
			<view class='cell-item right-img' 
			@click="orderNavigateHandle('../order/orderlist')"
			>
				<view class='cell-item-hd'>
					<view class='cell-hd-title'>我的订单</view>
				</view>
				<view class='cell-item-ft'>
					<image class='cell-ft-next icon' src='../../../static/image/right.png'></image>
				</view>
			</view>
		</view> 
		
		<view class='member-grid'>
			<view class='member-item' v-for="(item, index) in orderItems" :key="index" @click="orderNavigateHandle('../order/orderlist', index + 1)">
				<view class="badge color-f" v-if="item.nums">{{ item.nums }}</view>
				<image class='member-item-icon' :src='item.icon'></image>
				<text class='member-item-text'>{{ item.name }}</text>
			</view>
			<view class='member-item' @click="goAfterSaleList">
				<view class="badge color-f" v-if="afterSaleNums != 0">{{afterSaleNums}}</view>
				<image class='member-item-icon' src='../../../static/image/me-ic-evaluate.png'></image>
				<text class='member-item-text'>退换货</text>
			</view>
		</view>
		<!-- 订单列表end -->
		
		<!-- 其他功能菜单 -->
		<view class='cell-group margin-cell-group right-img'>
			
			<view class='cell-item'
			v-for="(item, index) in utilityMenus"
			:key="index"
			>
				<view class='cell-item-hd' 
				@click="navigateToHandle(item.router)"
				>
					<image class='cell-hd-icon' :src='item.icon'></image>
					<view class='cell-hd-title'>{{ item.name }}</view>
				</view>
				<view class='cell-item-ft'>
					<image class='cell-ft-next icon' src='../../../static/image/right.png'></image>
				</view>
			</view>
			<!-- #ifdef H5 -->
			<view class='cell-item'>
				<view class='cell-item-hd' 
				@click="showChat()"	
				>
					<image class='cell-hd-icon' src='../../../static/image/me-ic-phone.png'></image>
					<view class='cell-hd-title'>联系客服</view>
				</view>
				<view class='cell-item-ft'>
					<image class='cell-ft-next icon' src='../../../static/image/right.png'></image>
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef MP -->
			<view class='cell-item'>
				  <button class="cell-item-hd " hover-class="none" open-type="contact" bindcontact="showChat">
				  <image src='../../../static/image/me-ic-phone.png'  class='cell-hd-icon'></image>
				  <view class='cell-hd-title'>联系客服</view>
				</button>
				<view class='cell-item-ft'>
					<image class='cell-ft-next icon' src='../../../static/image/right.png'></image>
				</view>
			</view>
			<!-- #endif -->
		</view>
		<!-- 其他功能菜单end -->
		
	</view>
</template>


<script>
export default {
	components: {  },
	data () {
		return {
			userInfo: {}, // 用户信息
			afterSaleNums: 0,
			orderItems: [
				{
					name: '待付款',
					icon: '../../../static/image/me-ic-obligation.png',
					nums: 0,
				},
				{
					name: '待发货',
					icon: '../../../static/image/me-ic-sendout.png',
					nums: 0,
				},
				{
					name: '待收货',
					icon: '../../../static/image/me-ic-receiving.png',
					nums: 0,
				},
				{
					name: '待评价',
					icon: '../../../static/image/me-ic-evaluate.png',
					nums: 0,
				}
			],
			utilityMenus: [
// 				{
// 					name: '我的优惠券',
// 					icon: '../../../static/image/ic-me-coupon.png',
// 					router: '../coupon/index'
// 				},
				{
					name: '我的余额',
					icon: '../../../static/image/ic-me-balance.png',
					router: '../balance/index'
				},
				{
					name: '地址管理',
					icon: '../../../static/image/me-ic-site.png',
					router: '../address/list'
				},
				{
					name: '我的收藏',
					icon: '../../../static/image/ic-me-collect.png',
					router: '../collection/index'
				},
				{
					name: '我的足迹',
					icon: '../../../static/image/ic-me-track.png',
					router: '../history/index'
				},
// 				{
// 					name: '关于我们',
// 					icon: '../../../static/image/me-ic-about.png',
// 					router: ''
// 				},
				
				/* {
					name: '联系客服',
					icon: '../../../static/image/me-ic-phone.png',
					router: ''
				}, */
				{
					name: '邀请好友',
					icon: '../../../static/image/ic-me-invite.png',
					router: '../invite/index'
				},
				{
					name: '系统设置',
					icon: '../../../static/image/me-ic-set.png',
					router: '../setting/index'
				},
			]
		}
	},
	onLoad () {
		
	},
	onShow () {
		this.initData()
	},
	methods: {
		initData () {
			// 获取用户信息
			var _this = this;
			this.$api.userInfo({}, res => {
				if (res.status) {
					_this.userInfo = res.data
					// 获取订单不同状态的数量
					let data = {
						ids: '1,2,3,4',
						isAfterSale: true
					}
					_this.$api.getOrderStatusSum(data, res => {
						if (res.status) {
							_this.orderItems.forEach((item, key) => {
								item.nums = res.data[key + 1];
							});
							_this.afterSaleNums = res.data.isAfterSale?res.data.isAfterSale:0;
						}
					})
				}
			})
			
		},
		navigateToHandle (pageUrl) {
			this.$common.navigateTo(pageUrl)
		},
		orderNavigateHandle (url, tab = 0) {
			this.$store.commit('orderTab', tab)
			this.$common.navigateTo(url)
		},
		goAfterSaleList() {
			this.$common.navigateTo('../after_sale/list');
		},
		// #ifdef H5 
		//在线客服,只有手机号的，请自己替换为手机号
		showChat () {
			let _this = this;
           	window._AIHECONG('ini', {
				entId: _this.$config.entId,
				button: false,
				appearance: {
					panelMobile: {
						tone: '#FF7159',
						sideMargin: 30,
						ratio: 'part',
						headHeight: 50
					}
				}
			})
            window._AIHECONG('showChat');
			return true;
        },
		// #endif
	},
	computed: {
		
	},
	watch: {
		
	}
}	
</script>


<style>
.member-top{
  position: relative;
  width: 100%;
  height: 340upx;
}
.bg-img{
  position: absolute;
  width: 100%;
  height: 100%;
}
.member-top-c{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  text-align: center;
}
.user-head-img{
  width: 160upx;
  height: 160upx;
  border-radius: 50%;
  background-color: rgba(255,255,255,.7);
}
.user-name{
  font-size: 30upx;
  color: #fff;
}
.member-grid{
  background-color: #fff;
  border-top: 2upx solid #eee;
  padding: 20upx 0;
}
.margin-cell-group{
  margin: 20upx 0;
  color: #666666;
}
.badge{
	left: 80upx;
	top: -6upx;
}
button.cell-item-hd{
	background-color: #fff;
	padding: 0;
	line-height: 1.4;
	color: #333;
}
button.cell-item-hd:after{
	border: none;
}
</style>
