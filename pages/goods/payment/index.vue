<template>
	<view class="content">
		<view class='cell-group margin-cell-group'>
			<view class='cell-item'>
				<view class='cell-item-hd'>
					<view class='cell-hd-title'>订单类型</view>
				</view>
				<view class='cell-item-ft'>
					<text class="cell-ft-p" v-if="type == 1">商品订单</text>
					<text class="cell-ft-p" v-if="type == 2">充值订单</text>
				</view>
			</view>
			<view v-if="type == 1">
				<view class='cell-item'>
					<view class='cell-item-hd'>
						<view class='cell-hd-title'>订单编号</view>
					</view>
					<view class='cell-item-ft'>
						<text class="cell-ft-p">{{ orderId }}</text>
					</view>
				</view>
				<view class='cell-item'>
					<view class='cell-item-hd'>
						<view class='cell-hd-title'>订单金额</view>
					</view>
					<view class='cell-item-ft'>
						<text class="cell-ft-p red-price">￥{{ orderInfo.order_amount }}</text>
					</view>
				</view>
			</view>
			<view v-else-if="type == 2">
				<view class='cell-item'>
					<view class='cell-item-hd'>
						<view class='cell-hd-title'>充值金额</view>
					</view>
					<view class='cell-item-ft'>
						<text class="cell-ft-p red-price">￥ {{ recharge }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- #ifdef H5 -->
		<payments-by-h5
		:orderId="orderId"
		:recharge="recharge"
		:type="type"
		:uid="userInfo.id"
		></payments-by-h5>
		<!-- #endif -->
		
		<!-- #ifdef MP-WEIXIN -->
		<payments-by-wx
		:orderId="orderId"
		:recharge="recharge"
		:type="type"
		:uid="userInfo.id"
		></payments-by-wx>
		<!-- #endif -->

	</view>
</template>

<script>
// #ifdef H5
import paymentsByH5 from '@/components/payments/paymentsByH5.vue'
// #endif

// #ifdef MP-WEIXIN
import paymentsByWx from '@/components/payments/paymentsByWx.vue'
// #endif

export default {
	data () {
		return {
			orderId: 0,
			recharge: 0,
			type: 1,	// 订单类型 1商品订单 2充值订单
			orderInfo: {}, // 订单详情
			userInfo: {}	// 用户信息
		}
	},
	
	components: {
		// #ifdef H5
		paymentsByH5,
		// #endif
		// #ifdef MP-WEIXIN
		paymentsByWx,
		// #endif
	},
	
	onLoad (options) {
		this.orderId = options.order_id
		this.recharge = Number(options.recharge)
		this.type = Number(options.type)
		if (this.orderId && this.type == 1) {
			// 商品订单
			this.getOrderInfo()
		} else if (this.recharge && this.type == 2) {
			// 充值订单 获取用户id
			this.getUserInfo()
		} else {
			this.$common.errorToShow('订单支付参数错误', () => {
				uni.navigateBack({
					delta: 1
				})
			})
		}
	},
	methods: {
		// 获取订单详情
		getOrderInfo () {
			let data = {
				order_id: this.orderId
			}
			this.$api.orderDetail(data, res => {
				if (res.status) {
					this.orderInfo = res.data
				}
			})
		},
		// 获取用户信息
		getUserInfo () {
			this.$api.userInfo({}, res => {
				if (res.status) {
					this.userInfo = res.data
				} else {
					this.$common.errorToShow(res.msg)
				}
			})
		}
	}
}	
</script>

<style>
.margin-cell-group{
	margin-bottom: 20upx;
}
.cell-hd-title{
	color: #999;
}
.payment-method .cell-item-hd{
	min-width: 70upx;
}
.payment-method .cell-hd-icon{
	width: 70upx;
	height: 70upx;
}
.payment-method .cell-item-bd{
	border-left: 2upx solid #F0F0F0;
	padding-left: 30upx;
}
.payment-method .cell-bd-text{
	font-size: 28upx;
	color: #666;
}
.payment-method .address{
	font-size: 24upx;
	color: #999;
}
</style>
