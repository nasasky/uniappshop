<template>
	<view class='cell-group payment-method'>
		<view class='cell-item add-title-item'
		v-for="item in payments"
		:key="item.code"
		@click="toPayHandler(item.code)"
		v-if="!(type == 2 && item.code == 'balancepay')"
		>
			<view class='cell-item-hd'>
				<image class='cell-hd-icon' :src='item.icon'></image>
			</view>
			<view class='cell-item-bd'>
				<view class="cell-bd-view">
					<text class="cell-bd-text">{{ item.name }}</text>
				</view>
				<view class="cell-bd-view">
					<text class="cell-bd-text address">{{ item.memo }}</text>
				</view>
			</view>
			<view class='cell-item-ft'>
				<image class='cell-ft-next icon' src='../../../static/image/right.png'></image>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/config/config.js'
export default {
	props: {
		// 如果是商品订单此参数必须
		orderId: {
			type: String,
			default () {
				return ''
			}
		},
		// 如果是充值订单此参数必须
		recharge: {
			type: Number,
			default () {
				return 0
			}
		},
		// 用户id
		uid: {
			type: Number,
			default () {
				return 0
			}
		},
		// 订单类型
		type: {
			type: Number,
			default () {
				return 1
			}
		}
	},
	data () {
		return {
			payments: []
		}
	},
	mounted () {
		this.getPayments()
	},
	methods: {
		// 获取可用支付方式列表
		getPayments () {
			this.$api.paymentList({}, res => {
				if (res.status) {
					this.payments = this.formatPayments(res.data)
				}
			})
		},
		// 支付方式处理
		formatPayments (payments) {
			payments = payments.filter(item => item.code !== 'alipay' && item.is_online === 1)
			
			// 设置logo图片
			payments.forEach(item => {
				this.$set(item, 'icon', '/static/image/' + item.code + '.png')
			})
			
			return payments
		},
		// 用户点击支付方式处理
		toPayHandler (code) {
			let data = {
				payment_code: code,
				payment_type: this.type
			}
			
			data['ids'] = this.type == 1 ? this.orderId : this.uid
			
			// 判断订单支付类型
			if (this.type == 2 && this.recharge) {
				data['params'] = {
					money: this.recharge
				}
			}

			let _this = this
			switch (code) {
				case 'wechatpay':
				this.$api.pay(data, res => {
					if (res.status) {
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: res.data.timeStamp,
							nonceStr: res.data.nonceStr,
							package: res.data.package,
							signType: res.data.signType,
							paySign: res.data.paySign,
							success: function (res) {
								if (res.errMsg === 'requestPayment:ok') {
									_this.$common.successToShow(res.msg, () => {
										if (_this.type == 1) {
											_this.$common.redirectTo('/pages/goods/payment/result?order_id=' + this.orderId)
										} else if (_this.type == 2) {
											_this.$common.redirectTo('/pages/member/balance/index')
										}
									})
								} 
							},
							fail: function (err) {
								_this.$common.errorToShow('支付失败')
							}
						});
					} else {
						this.$common.errorToShow(res.msg)
					}
				})
				break
				case 'balancepay':
				/**
				 *  用户余额支付
				 * 
				 */
				this.$api.pay(data, res => {
					if (res.status) {
						this.$common.redirectTo('/pages/goods/payment/result?order_id=' + this.orderId)
					} else {
						this.$common.errorToShow(res.msg)
					}
				})
				break
				case 'offline':
				/**
				 * 线下支付
				 */
				this.$common.modelShow('线下支付说明', '请联系客服进行线下支付', () => {
					this.$common.redirectTo('/pages/member/order/orderdetail?order_id=' + this.orderId)
				}, '订单详情', '继续购物')
				break
			}

		}
	}
	
}	
</script>

<style>
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
