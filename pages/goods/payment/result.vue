<template>
	<view class="content">
		<view class="result succsee"
		v-if="orderInfo.pay_status === 2 && orderInfo.payment_time > 0"
		>
			<image class="result-img" src="../../../static/image/win.png" mode=""></image>
			<view class="result-top">
				支付成功
			</view>
			<view class="result-mid red-price">
				{{ this.$common.formatMoney(orderInfo.payed) }}
			</view>
			<view class="result-bot">
				<button class="btn btn-g" @click="orderDetail(orderInfo.order_id)">查看详情</button>
			</view>
		</view>
		<view class="result fail"
		v-else
		>
			<image class="result-img" src="../../../static/image/pastdue.png" mode=""></image>
			<view class="result-top">
				支付失败
			</view>
			<view class="result-mid red-price">
				{{ this.$common.formatMoney(orderInfo.payed) }}
			</view>
			<view class="result-bot">
				<button class="btn btn-g">查看原因</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data () {
		return {
			orderId: 0,
			orderInfo: {} // 订单详情
		}
	},
	onLoad (options) {
		this.orderId = options.order_id
	},
	mounted () {
		this.getOrderInfo()
	},
	methods: {
		getOrderInfo () {
			let data = {
				order_id: this.orderId
			}
			
			this.$api.orderDetail(data, res => {
				if (res.status) {
					this.orderInfo = res.data
				} else {
					this.$common.errorToShow(res.msg)
				}
			})
		},
		orderDetail (orderId) {
			this.$common.redirectTo('/pages/member/order/orderdetail?order_id=' + orderId)
		}
	}
}	
</script>

<style>
.result{
	text-align: center;
	padding-top: 200upx;
}
.result-img{
	width: 140upx;
	height: 140upx;
	margin-bottom: 20upx;
}
.result-top{
	color: #666;
	font-size: 30upx;
}
.result-mid{
	
}
.result-bot .btn{
	margin-top: 40upx;
	font-size: 26upx;
	padding: 0 50upx;
}
</style>
