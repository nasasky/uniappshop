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
			payments = payments.filter(item => item.is_online === 1)

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
			
			switch (code) {
				case 'alipay':
				/**
				 * 支付宝支付需要模拟GET提交数据
				 */
				if (this.type == 1 && this.orderId) {
					data['params'] = {
						trade_type: 'WAP',
						return_url: baseUrl + '/#/pages/goods/payment/result?order_id=' + this.orderId
					}
				} else if (this.type == 2 && this.recharge) {
					data['params'] = {
						money: this.recharge,
						return_url: baseUrl + '/#/pages/member/balance/index'
					}
				}

				this.$api.pay(data, res => {
					if (res.status) {
						const url = res.data.url
						const data = res.data.data
						
						// 模拟GET提交
						let tempForm = document.createElement('form')
						tempForm.id = 'aliPay'
						tempForm.methods = 'post'
						tempForm.action = url
						tempForm.target = '_self'
						let input = []
						for (let k in data) {
							input[k] = document.createElement('input')
							input[k].type = 'hidden'
							input[k].name = k
							input[k].value = data[k]
							tempForm.appendChild(input[k])
						}
						tempForm.addEventListener('submit', function () {}, false)
						document.body.appendChild(tempForm)
						tempForm.dispatchEvent(new Event('submit'))
						tempForm.submit()
						document.body.removeChild(tempForm)
					}
				})
				break
				case 'wechatpay':
					/**
					 * 判断是否在微信浏览器
					 * 
					 *
					 * 	微信支付有两种
					 * 
					 *  判断是否在微信浏览器
					 * 	微信jsapi支付
					 * 
					 * 	不在微信浏览器
					 * 	微信h5支付
					 * 
					 */
					let isWeiXin = this.$common.isWeiXinBrowser()

					if (isWeiXin) {
						
						if (this.type == 1 && this.orderId) {
							// 微信jsapi支付
							data['params'] = {
								trade_type: 'JSAPI_OFFICIAL'
							}
						} else if (this.type == 2 && this.recharge) {
							data['params'] = {
								money: this.recharge
							}
						}

						this.$api.pay(data, res => {
							const data = res.data
							let _this = this
							WeixinJSBridge.invoke(
								'getBrandWCPayRequest', {
									'appId': data.appid, // 公众号名称，由商户传入
									'timeStamp': data.timeStamp, // 时间戳，自1970年以来的秒数
									'nonceStr': data.nonceStr, // 随机串
									'package': data.package,
									'signType': data.signType, // 微信签名方式：
									'paySign': data.paySign // 微信签名
								}, function (res) {
									if (res.err_msg === 'get_brand_wcpay_request:ok') {
										if (_this.type == 1) {
											_this.$common.redirectTo('/pages/goods/payment/result?order_id=' + _this.orderId)
										} else if (_this.type == 2) {
											_this.$common.redirectTo('/pages/member/balance/index')
										}
										// 使用以上方式判断前端返回,微信团队郑重提示：
										// res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
									} else {
										_this.$common.errorToShow('支付失败')
									}
							})
						})
					} else {
						
						// 微信 H5支付
						if (this.type == 1 && this.orderId) {
							data['params'] = {
								trade_type: 'MWEB',
								return_url: baseUrl + '/#/pages/goods/payment/result?order_id=' + this.orderId
							}
						} else if (this.type == 2 && this.recharge) {
							data['params'] = {
								trade_type: 'MWEB',
								money: this.recharge,
								return_url: baseUrl + '/#/pages/member/balance/index'
							}
						}
						// 微信h5支付
						this.$api.pay(data, res => {
							if (res.status) {
								location.href = res.data.mweb_url
							} else {
								this.$common.errorToShow(res.msg)
							}
						})
					}
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
