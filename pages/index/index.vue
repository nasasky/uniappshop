<template>
	<view class="content" style="padding-top: 104upx;">
		<!-- 搜索框 -->
		<view class="search" :class="searchBarOpacity == true ? 'isOpacity' :''">
			<view class='search-c' @click='goSearch()'>
				<view class='search-input search-input-p'>请输入关键字搜索</view>
				<image class='icon search-icon' src='../../static/image/zoom.png'></image>
			</view>
		</view>

		<!-- 轮播图 -->
		<view class='swiper'>
			<swiper class="swiper-c" :indicator-dots="swiper.indicatorDots" :autoplay="swiper.autoplay" :interval="swiper.interval"
			 :duration="swiper.duration">
				<swiper-item class="have-none" v-for="(item, index) in advert.tpl1_slider" :key="index">
					<image class='' :src="item.img" @click="showSliderInfo(item.type, item.val)"></image>
				</swiper-item>
			</swiper>
		</view>

		<!-- 公告 -->
		<view class="notice margin-cell-group" v-if="notice.length>0">
			<view class="notice-icon">
				<image class="icon news-icon" src="../../static/image/news.png" mode=""></image>
			</view>
			<swiper class="notice-c" :indicator-dots="false" :autoplay="true" :interval="3000" :duration="1000" :vertical="true"
			 :circular="true">
				<swiper-item v-for="item in notice" :key="item.id" @click="goNotice(item.id)">
					<view class="swiper-item">{{ item.title }}</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- 优惠券 -->
		<view class="coupon" v-if="coupons.length > 0">
			<view class="coupon-item" v-for="item in coupons" :key="item.id" @click="receiveCoupon(item.id)">
				<view class="coupon-i-l">
					<view class="coupon-i-l-t">
						<image class="icon" src="../../static/image/element-ic.png" mode=""></image>
						<text>{{ item.name }}</text>
					</view>
					<view class="coupon-i-l-b">
						{{ item.expression1 + item.expression2 }}
					</view>
				</view>
				<view class="coupon-i-r">
					<image class="coupon-logo" src="../../static/image/coupon-element.png" mode=""></image>
				</view>
			</view>
		</view>
		
		<!-- 广告位 -->
		<view class="ad" v-if="advert.tpl1_index_banner1 && advert.tpl1_index_banner1.length > 0">
			<image class="ad-img" v-for="item in advert.tpl1_index_banner1" :key="item.id" :src="item.img" mode="widthFix" @click="showSliderInfo(item.type, item.val)"></image>
		</view>
		

		<!-- 推荐商品 -->
		<view class='img-grids margin-cell-group'>
			<view class='cell-item right-img'>
				<view class='cell-item-hd'>
					<view class='cell-hd-title'>推荐商品</view>
				</view>
				<view class='cell-item-bd'>
				</view>
				<view class='cell-item-ft'>
					<image class='cell-ft-next icon' src='../../static/image/right.png'></image>
					<text class='cell-ft-text' @click="goodsList({type: 'recommend'})">查看更多</text>
				</view>
			</view>
			<view class='swiper-grids'>
				<scroll-view class='swiper-list' scroll-x="true" v-if="goodsListOfRecommend.length">
					<view class='img-grids-item' v-for="item in goodsListOfRecommend" :key="item.id" @click="goodsDetail(item.id)">
						<image class='img-grids-item-t have-none' :src='item.image_url' mode='aspectFill'></image>
						<view class='img-grids-item-b'>
							<view class='goods-name grids-goods-name'>{{ item.name }}</view>
							<view class='goods-item-c'>
								<view class='goods-price red-price'>￥{{ item.price }}</view>
							</view>
						</view>
					</view>
					<!-- 					<view class='img-grids-item'>
						<image class='img-grids-item-t have-none' src='../../static/demo-img/11.png' mode=''></image>
						<view class='img-grids-item-b'>
							<view class='goods-name grids-goods-name'>这里是商品的名称这里是商品的名称这里是商品的名称</view>
							<view class='goods-item-c'>
								<view class='goods-price red-price'>￥399.99</view>
							</view>
						</view>
					</view> -->
				</scroll-view>
				<view v-else-if="!goodsListOfRecommend.length && !goodsListOfRecommendAjax">
					<scroll-view class='swiper-list' scroll-x="true">
						<view class='img-grids-item'>
							<image class='img-grids-item-t have-none' src='' mode=''></image>
							<view class='img-grids-item-b'>
								<view class='goods-name grids-goods-name have-none'></view>
								<view class='goods-item-c'>
									<view class='goods-price red-price have-none'></view>
								</view>
							</view>
						</view>
						<view class='img-grids-item'>
							<image class='img-grids-item-t have-none' src='' mode=''></image>
							<view class='img-grids-item-b'>
								<view class='goods-name grids-goods-name have-none'></view>
								<view class='goods-item-c'>
									<view class='goods-price red-price have-none'></view>
								</view>
							</view>
						</view>
						<view class='img-grids-item'>
							<image class='img-grids-item-t have-none' src='' mode=''></image>
							<view class='img-grids-item-b'>
								<view class='goods-name grids-goods-name have-none'></view>
								<view class='goods-item-c'>
									<view class='goods-price red-price have-none'></view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<view v-else="">
					<scroll-view class='swiper-list' scroll-x="true"></scroll-view>
				</view>
			</view>
		</view>

		<!-- 广告位 -->
		<view class="ad" v-if="advert.tpl1_index_banner2 && advert.tpl1_index_banner2.length > 0">
			<image class="ad-img" v-for="item in advert.tpl1_index_banner2" :key="item.id" :src="item.img" mode="widthFix" @click="showSliderInfo(item.type, item.val)"></image>
		</view>
		

		<!-- 热卖商品 -->
		<view class='img-grids margin-cell-group'>
			<view class='cell-item right-img'>
				<view class='cell-item-hd'>
					<view class='cell-hd-title'>热卖商品</view>
				</view>
				<view class='cell-item-bd'>
				</view>
				<view class='cell-item-ft'>
					<image class='cell-ft-next icon' src='../../static/image/right.png'></image>
					<text class='cell-ft-text' @click="goodsList({type: 'hot'})">查看更多</text>
				</view>
			</view>
			<view class='swiper-grids'>
				<scroll-view class='swiper-list' scroll-x="true" v-if="goodsListOfHot.length">
					<view class='img-grids-item' v-for="item in goodsListOfHot" :key="item.id" @click="goodsDetail(item.id)">
						<image class='img-grids-item-t have-none' :src='item.image_url' mode='aspectFill'></image>
						<view class='img-grids-item-b'>
							<view class='goods-name grids-goods-name'>{{ item.name }}</view>
							<view class='goods-item-c'>
								<view class='goods-price red-price'>￥{{ item.price }}</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view v-else-if="!goodsListOfHotAjax && !goodsListOfHot.length">
					<scroll-view class='swiper-list' scroll-x="true">
						<view class='img-grids-item'>
							<image class='img-grids-item-t have-none' src='' mode='aspectFill'></image>
							<view class='img-grids-item-b'>
								<view class='goods-name grids-goods-name have-none'></view>
								<view class='goods-item-c'>
									<view class='goods-price red-price have-none'></view>
								</view>
							</view>
						</view>
						<view class='img-grids-item'>
							<image class='img-grids-item-t have-none' src='' mode='aspectFill'></image>
							<view class='img-grids-item-b'>
								<view class='goods-name grids-goods-name have-none'></view>
								<view class='goods-item-c'>
									<view class='goods-price red-price have-none'></view>
								</view>
							</view>
						</view>
						<view class='img-grids-item'>
							<image class='img-grids-item-t have-none' src='' mode=''></image>
							<view class='img-grids-item-b'>
								<view class='goods-name grids-goods-name have-none'></view>
								<view class='goods-item-c'>
									<view class='goods-price red-price have-none'></view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<view v-else="">
					<scroll-view class='swiper-list' scroll-x="true"></scroll-view>
				</view>
			</view>
		</view>
	
		<!-- 广告位 -->
		<view class="ad" v-if="advert.tpl1_index_banner3 && advert.tpl1_index_banner3.length > 0">
			<image class="ad-img" v-for="item in advert.tpl1_index_banner3" :key="item.id" :src="item.img" mode="widthFix" @click="showSliderInfo(item.type, item.val)"></image>
		</view>
	</view>
</template>

<script>
	import {
		goods
	} from '@/config/mixins.js'
	export default {
		mixins: [goods],
		data() {
			return {
				swiper: {
					indicatorDots: true,
					autoplay: true,
					interval: 2000,
					duration: 500,
				}, // 轮播图属性设置
				advert: {}, // 首页全部广告
				notice: [], // 公告列表
				coupons: [], // 优惠券信息
				goodsListOfRecommend: [], // 推荐商品列表
				goodsListOfRecommendAjax: false,
				goodsListOfHot: [], // 热卖商品列表
				goodsListOfHotAjax: false,
				myShareCode: '', //分享Code
				imageUrl: '/static/image/share_image.png', //店铺分享图片
				searchBarOpacity: false
			}
		},
		computed: {
			appTitle(){
				return this.$store.state.config.shop_name;
			}
		},
		onLoad(e) {
			let scene = decodeURIComponent(e.scene);
			let arr1 = scene.split('&');
			let invite = '';
			for (var i = 0; i < arr1.length; i++) {
				let key = arr1[i].split("=")[0];
				if (key == 'invite') {
					invite = arr1[i].split("=")[1];
				}
			}
			if (invite != '') {
				this.$db.set("invitecode", invite);
			}

			this.initData();
		},
		// #ifdef MP-WEIXIN
		onPageScroll: function(e) {

			// console.log(e);//{scrollTop:99}
			// e > 50 ? searchBarOpacity = true : searchBarOpacity = false;
			// console.log(searchBarOpacity)
		},
		// #endif
		mounted() {
			// #ifdef H5 
			window.addEventListener('scroll', this.handleScroll)
			// #endif
		},
		methods: {
			handleScroll() {
				var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
				// console.log(scrollTop)
				// var offsetTop = document.querySelector('#searchBar').offsetTop
				scrollTop > 50 ? this.searchBarOpacity = true : this.searchBarOpacity = false
			},
			destroyed() {
				window.removeEventListener('scroll', this.handleScroll)
			},
			goSearch() {
				uni.navigateTo({
					url: './search'
				});
			},
			// 首页初始化获取数据
			initData() {
				// 获取广告轮播图
// 				this.$api.slider({
// 					code: 'tpl1_slider'
// 				}, res => {
// 					if (res.status == true) {
// 						this.slider = res.data.list
// 					}
// 				})
				this.$api.advert({
					codes: 'tpl1_slider,tpl1_index_banner1,tpl1_index_banner2,tpl1_index_banner3'
				}, res => {
					if(res.status == true){
						this.advert = res.data.list;
					}
				});
				
				// 获取公告列表
				this.$api.notice({}, res => {
					if (res.status == true) {
						this.notice = res.data
					}
				})
				// 获取优惠券信息
				this.$api.couponList({}, res => {
					if (res.status) {
						this.coupons = res.data;
					}
				})
				// 获取推荐商品
				let recommend = {
					where: JSON.stringify({
						recommend: 1
					})
				}
				this.getGoodsList(recommend, 'recommend');

				// 获取热门商品
				let hot = {
					where: JSON.stringify({
						hot: 1
					})
				}
				this.getGoodsList(hot, 'hot');

				let userToken = this.$db.get("userToken");
				if (userToken && userToken != '') {
					// 获取我的分享码
					this.$api.shareCode({}, res => {
						if (res.status) {
							this.myShareCode = res.data;
						}
					});
				}

				this.goodsListOfRecommendAjax = false;
				this.goodsListOfHotAjax = false;
				//获取地区信息
				this.$api.getAreaList({}, res => {
					if(res.status){
						this.$db.set("areaList",res.data);
					}
				})
			},
			// 广告点击查看详情
			showSliderInfo(type, val) {
				if (type == 1) {
					// URL
					// #ifdef H5
					window.location.href = val
					// #endif
				} else if (type == 2) {
					// 商品详情
					this.goodsDetail(val)
				} else if (type == 3) {
					// 文章详情
					this.$common.navigateTo('/pages/article/index?article_id=' + val)
				} else if (type == 4) {
					// 文章列表
					this.$common.navigateTo('/pages/article/list?cid=' + val)
				}
			},
			//点击公告
			goNotice(id) {
				// 文章详情
				this.$common.navigateTo('/pages/article/index?notice_id=' + id)
			},
			// 获取商品列表
			getGoodsList(data = {}, type = '') {
				let param = {
					page: 1,
					limit: 10
				}
				data = Object.assign(data, param)

				this.$api.goodsList(data, res => {
					if (res.status == true) {
						type === 'recommend' ? this.goodsListOfRecommend = res.data.list : this.goodsListOfHot = res.data.list;
						type === 'recommend' ? this.goodsListOfRecommendAjax = true : this.goodsListOfHotAjax = true;
					}
				})
			},
			// 用户领取优惠券
			receiveCoupon(couponId) {
				let data = {
					promotion_id: couponId
				}
				this.$api.getCoupon(data, res => {
					if (res.status) {
						this.$common.successToShow(res.msg)
					} else {
						this.$common.errorToShow(res.msg)
					}
				})
			}
		},
		onShareAppMessage() {
			let userToken = this.$db.get('userToken');
			if (userToken) {
				let myInviteCode = this.myShareCode;
				if (myInviteCode) {
					//缓存里面有邀请码
					let ins = encodeURIComponent('invite=' + myInviteCode);
					let path = '/pages/index/index?scene=' + ins;
					return {
						title: this.appTitle,
						path: path,
						imageUrl: this.imageUrl
					}
				} else {
					let path = '/pages/index/index';
					return {
						title: this.appTitle,
						path: path,
						imageUrl: this.imageUrl
					}
				}
			} else {
				//用户没有登录
				let path = '/pages/index/index';
				return {
					title: this.appTitle,
					path: path,
					imageUrl: this.imageUrl
				}
			}
		},
		onPullDownRefresh() {
			this.initData();
			//this.$db.del('all_cat');
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
	.search {
		position: fixed;

		/*  #ifdef  H5  */
		top: 88upx;
		/*  #endif  */
		/*  #ifndef  H5  */
		top: 0;
		/*  #endif  */
	}

	.isOpacity {
		background: linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, 0));
		transition: all .5s;
	}

	.isOpacity .search-input {
		background-color: rgba(255, 255, 255, .5);
		transition: all .5s;
	}

	.swiper {
		height: 340upx;
	}

	.notice {
		padding: 6upx 26upx;
		position: relative;
		overflow: hidden;
		background-color: #fff;
		color: #333;
	}

	.notice-icon {
		display: inline-block;
		height: 40upx;
		float: left;
	}

	.news-icon {
		width: 30upx;
		height: 30upx;
	}

	.notice-c {
		margin-left: 10upx;
		height: 50upx;
		line-height: 50upx;
		width: 630upx;
		display: inline-block;
		font-size: 28upx;
		float: left;
	}

	.coupon {
		padding: 0 26upx;
		background-color: #f8f8f8;
	}

	.coupon-item {
		padding: 20upx;
		margin-bottom: 20upx;
		background-color: #fff;
	}

	.coupon-i-l {
		width: 400upx;
		display: inline-block;
	}

	.coupon-i-l-t {
		font-size: 32upx;
		position: relative;
		margin-bottom: 10upx;
	}

	.coupon-i-l-t .icon {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}

	.coupon-i-l-t text {
		margin-left: 60upx;
	}

	.coupon-i-l-b {
		font-size: 24upx;
		color: #999;
	}

	.coupon-i-r {
		width: 258upx;
		display: inline-block;
		text-align: center;
	}

	.coupon-logo {
		width: 130upx;
		height: 100upx;
	}

	.cell-item {
		border: none;
	}

	.cell-ft-text {
		font-size: 22upx;
		color: #999;
	}

	.new-goods {
		min-height: 300upx;
		white-space: nowrap;
		width: 100%;
	}

	.new-goods-item {
		width: 200upx;
		display: inline-block;
		margin-right: 20upx;
	}

	.new-goods-item:last-child {
		margin-right: 0;
	}

	.news-goods-img {
		width: 200upx;
		height: 200upx;
	}

	.news-goods-img image {
		width: 100%;
		height: 100%;
	}

	.news-goods-bot {
		margin-top: 6upx;
	}

	.new-goods-name {
		display: block;
		font-size: 26upx;
	}

	.new-goods-price {
		display: block;
		font-size: 26upx;
		color: #e14d4d;
	}

	.img-grids {
		background-color: #fff;
	}

	.search-input-p {
		color: #888;
		line-height: 48upx;
	}

	.ad {
		width: 100%;
		margin: 20upx 0;
		overflow: hidden;
	}
	.ad-img{
		width: 100%;
		float: left;
		margin-bottom: 20upx;
	}
	.ad-img:last-child{
		margin-bottom: 0;
	}
	.img-grids-item{
		display: inline-table;
	}
</style>
