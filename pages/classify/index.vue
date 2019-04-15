<template>
	<view class="content">
		<!-- 搜索框 -->
		<view class="search">
			<view class="search-c" @click="goSearch">
				<view class="search-input search-input-p">{{ searchKey }}</view>
				<image class="icon search-icon" src="../../static/image/zoom.png"></image>
			</view>
		</view>

		<!-- 条件筛选 -->
		<view class="screen">
			<view class="screen-item" @click="comprehensive">
				<text class="screen-item-text">综合</text>
				<!-- <view class='screen-item-icon'><image></image></view> -->
			</view>
			<view class="screen-item" @click="priceSort">
				<text class="screen-item-text">价格</text>
				<view class="screen-item-icon">
					<image v-if="searchData.order.key == 'price' && searchData.order.sort == 'asc' "
						class="screen-item-icon-img"
						src="../../static/image/top-black.png"
					></image>
					<image v-else-if="!(searchData.order.key == 'price' && searchData.order.sort == 'asc')  "
						class="screen-item-icon-img"
						src="../../static/image/top-gray.png"
					></image>
					
					<image
						v-if="searchData.order.key == 'price' && searchData.order.sort == 'desc'  "
						class="screen-item-icon-img"
						src="../../static/image/bottom-black.png"
					></image>
					
					<image
						v-if="!(searchData.order.key == 'price' && searchData.order.sort == 'desc')"
						class="screen-item-icon-img"
						src="../../static/image/bottom-gray.png"
					></image>
					
				</view>
			</view>
			<view class="screen-item" @click="salesVolume">
				<text class="screen-item-text">销量</text>
				<view class="screen-item-icon">
					<image v-if="searchData.order.key == 'buy_count' && searchData.order.sort == 'asc'"
						class="screen-item-icon-img"
						src="../../static/image/top-black.png"
					></image>
					<image v-else-if="!(searchData.order.key == 'buy_count' && searchData.order.sort == 'asc') "
						class="screen-item-icon-img"
						src="../../static/image/top-gray.png"
					></image>
					
					<image
						v-if="searchData.order.key == 'buy_count' && searchData.order.sort == 'desc' "
						class="screen-item-icon-img"
						src="../../static/image/bottom-black.png"
					></image>
					
					<image
						v-if="!(searchData.order.key == 'buy_count' && searchData.order.sort == 'desc') "
						class="screen-item-icon-img"
						src="../../static/image/bottom-gray.png"
					></image>
				</view>
			</view>
			<view class="screen-item">
				<view
					class="screen-item-icon"
					style-type="button"
					:current="current"
					@click="listGrid"
				>
					<image class="list-grid" src="../../static/image/switch-ic-side-2.png" v-show="current == 0"></image>
					<image class="list-grid" src="../../static/image/switch-ic-list.png" v-show="current == 1"></image>
				</view>
			</view>
			<!-- <view class="screen-item">
				<text class="screen-item-text">筛选</text>
				<image class="filter-img" src="../../static/image/top.png"></image>
			</view> -->
		</view>

		<!-- 表格图片 -->
		<scroll-view scroll-y="true" :scroll-into-view="toView" class="scroll-Y" @scrolltolower="lower" enable-back-to-top="true" lower-threshold="45">
			<view class="img-grids" v-show="current === 0">
				<view v-if="goodsList.length>0">
					<view class="img-grids-item"  v-for="(item, index) in goodsList" :key="index" @click="goodsDetail(item.id)">
						<image
							class="img-grids-item-t have-none"
							:src="item.image_url"
							mode='aspectFill'
						></image>
						<view class="img-grids-item-b">
							<view class="goods-name grids-goods-name">
								{{item.name}}
							</view>
							<view class="goods-item-c">
								<view class="goods-price red-price">￥{{item.price}}</view>
								<image class="goods-cart" src="../../static/image/ic-car.png"></image>
							</view>
						</view>
					</view>
				</view>
				<!-- 无数据时默认显示 -->
				<view class="order-none" v-else>
					<!-- <view class="img-grids-item have-none">
						<image
							class="img-grids-item-t have-none"
							mode='aspectFill'
						></image>
						<view class="img-grids-item-b ">
							<view class="goods-name grids-goods-name have-none">
							</view>
							<view class="goods-item-c">
								<view class="goods-price red-price have-none"></view>
								<image class="goods-cart have-none"></image>
							</view>
						</view>
					</view>
					<view class="img-grids-item have-none">
						<image
							class="img-grids-item-t have-none"
							mode='aspectFill'
						></image>
						<view class="img-grids-item-b ">
							<view class="goods-name grids-goods-name have-none">
							</view>
							<view class="goods-item-c">
								<view class="goods-price red-price have-none"></view>
								<image class="goods-cart have-none"></image>
							</view>
						</view>
					</view>
					<view class="img-grids-item have-none">
						<image
							class="img-grids-item-t have-none"
							mode='aspectFill'
						></image>
						<view class="img-grids-item-b ">
							<view class="goods-name grids-goods-name have-none">
							</view>
							<view class="goods-item-c">
								<view class="goods-price red-price have-none"></view>
								<image class="goods-cart have-none"></image>
							</view>
						</view>
					</view>
					<view class="img-grids-item have-none">
						<image
							class="img-grids-item-t have-none"
							mode='aspectFill'
						></image>
						<view class="img-grids-item-b ">
							<view class="goods-name grids-goods-name have-none">
							</view>
							<view class="goods-item-c">
								<view class="goods-price red-price have-none"></view>
								<image class="goods-cart have-none"></image>
							</view>
						</view>
					</view> -->
					<image class="order-none-img" src="../../static/image/order.png" mode=""></image>
				</view>
			</view>
		
		<!-- 列表图片 -->
			<view class="img-list" v-show="current === 1">
				<view v-if="goodsList.length>0">
					<view class="img-list-item"  v-for="(item, index) in goodsList" :key="index" @click="goodsDetail(item.id)">
						<image
							class="img-list-item-l"
							:src="item.image_url"
							mode='aspectFill'
						></image>
						<view class="img-list-item-r">
							<view class="goods-name list-goods-name">
								{{item.name}}
							</view>
							<view class="goods-item-c">
								<view class="goods-price red-price">￥{{item.price}}</view>
								<view class="goods-buy">
									<view class="goods-salesvolume" v-show="item.comments_count > 0">{{item.comments_count}}条评论</view>
									<view class="goods-salesvolume" v-show="item.comments_count <= 0">暂无评论</view>
									<image class="goods-cart" src="../../static/image/ic-car.png"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="order-none" v-else>
					<!-- <view class="img-list-item">
						<image class="img-list-item-l have-none" src="" mode="aspectfill"></image>
						<view class="img-list-item-r">
							<view class="goods-name list-goods-name have-none"></view>
							<view class="goods-item-c">
								<view class="goods-price have-none"></view>
								<view class="goods-buy">
									<view class="goods-salesvolume have-none"></view>
									<image class="goods-cart have-none" src=""></image>
								</view>
							</view>
						</view>
					</view>
					<view class="img-list-item">
						<image class="img-list-item-l have-none" src="" mode="aspectfill"></image>
						<view class="img-list-item-r">
							<view class="goods-name list-goods-name have-none"></view>
							<view class="goods-item-c">
								<view class="goods-price have-none"></view>
								<view class="goods-buy">
									<view class="goods-salesvolume have-none"></view>
									<image class="goods-cart have-none" src=""></image>
								</view>
							</view>
						</view>
					</view>
					<view class="img-list-item">
						<image class="img-list-item-l have-none" src="" mode="aspectfill"></image>
						<view class="img-list-item-r">
							<view class="goods-name list-goods-name have-none"></view>
							<view class="goods-item-c">
								<view class="goods-price have-none"></view>
								<view class="goods-buy">
									<view class="goods-salesvolume have-none"></view>
									<image class="goods-cart have-none" src=""></image>
								</view>
							</view>
						</view>
					</view>
					<view class="img-list-item">
						<image class="img-list-item-l have-none" src="" mode="aspectfill"></image>
						<view class="img-list-item-r">
							<view class="goods-name list-goods-name have-none"></view>
							<view class="goods-item-c">
								<view class="goods-price have-none"></view>
								<view class="goods-buy">
									<view class="goods-salesvolume have-none"></view>
									<image class="goods-cart have-none" src=""></image>
								</view>
							</view>
						</view>
					</view> -->
					<image class="order-none-img" src="../../static/image/order.png" mode=""></image>
				</view>
				
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			current: 0,
			id: '',
			showView: false,
			goodsList: [],
			minPrice: '',
			maxPrice: '',
			ajaxStatus: false,
			loading: true,
			loadingComplete: false,
			nodata: false,
			toView: '',
			searchData: {
				where: {},
				limit: 10,
				page: 1,
				order: {
					key: 'sort',
					sort: 'asc'
				}
			},
			searchKey: '请输入关键字搜索', //关键词
			alllist: true,
			allgrid: false
		};
	},
	//加载执行
	onLoad: function(options) {
		var where = {};
		if (options.id) {
			where = {
				cat_id: options.id
			};
			//this.getGoodsClass(options.id);
		}
		if (options.key) {
			where = {
				search_name: options.key
			};
			this.searchKey = options.key;
		}
		if (options.type) {
			if (options.type == 'hot') {
				where = {
					hot: true
				};
			}
			if (options.type == 'recommend') {
				where = {
					recommend: true
				}
			}
		}

		this.setSearchData({
			where: where
		});
		
		this.getGoods();
	},

	components: {},
	methods: {
		listGrid() {
			if (this.current == 0) {
				this.current = 1;
			} else {
				this.current = 0;
			}
		},
		//设置查询条件
		setSearchData: function(searchData, clear = false) {
			var sd = this.searchData;
			this.searchData = this.$common.deepCopy(sd, searchData)
			if (clear) {
				this.goodsList = [];
			}
		},
		//获取分类名称
// 		getGoodsClass: function(id) {
// 			let data = {
// 				id: id
// 			};
// 			this.$api.getGoodsClass(data, function(res) {
// 				wx.setNavigationBarTitle({
// 					title: res.data
// 				});
// 			});
// 		},
		onChangeShowState: function() {
			var _this = this;
			_this.showView = !_this.showView;
		},
		//点击综合排序
		comprehensive: function() {
			this.setSearchData(
				{
					order: {
						key: 'sort',
						sort: 'asc'
					},
					page: 1
				},
				true
			);
			this.getGoods();
		},

		//销量
		salesVolume: function() {
			if (this.searchData.order.key == 'buy_count') {
				if (this.searchData.order.sort == 'desc') {
					this.searchData.order.sort = 'asc';
				} else {
					this.searchData.order.sort = 'desc';
				}
			} else {
				this.searchData.order = {
					key: 'buy_count',
					sort: 'desc'
				};
			}
			this.searchData.page = 1; //从第一页重新显示
			this.setSearchData(this.searchData, true);
			this.getGoods();
		},
		//价格排序
		priceSort: function() {
			if (this.searchData.order.key == 'price') {
				if (this.searchData.order.sort == 'desc') {
					this.searchData.order.sort = 'asc';
				} else {
					this.searchData.order.sort = 'desc';
				}
			} else {
				this.searchData.order = {
					key: 'price',
					sort: 'asc'
				};
			}
			this.searchData.page = 1; //从第一页重新显示
			this.setSearchData(this.searchData, true);
			this.getGoods();
		},

		//设置查询价格区间
		orderPrice: function(e) {
			var reg = /^[0-9]+(.[0-9]{2})?$/;
			if (!reg.test(e.detail.value)) {
				this.$common.errorToShow('请输入正确金额');
				this.maxPrice = '';
			} else {
				this.maxPrice = e.detail.value;
			}
		},

		//查询价格区间
		searchPrice: function(event) {
			if (
				this.minPrice > 0 &&
				this.maxPrice > 0 &&
				this.minPrice > this.maxPrice
			) {
				app.common.errorToShow('价格区间有误');
				return false;
			}

			this.setSearchData(
				{
					page: 1,
					where: {
						price_f: this.minPrice,
						price_t: this.maxPrice
					}
				},
				true
			);
			this.getGoods();
		},

		//页面相关事件处理函数--监听用户下拉动作
		onPullDownRefresh: function() {
		},

		//跳转到商品详情页面
		goodsDetail: function(id) {
			let ins = encodeURIComponent('id='+id);
			let url = '/pages/goods/index/index?scene=' + ins;
			this.$common.navigateTo(url);
		},

		//取得商品数据
		getGoods: function() {
			var _this = this;
			if (_this.ajaxStatus) {
				return false;
			}
			_this.ajaxStatus = true;
			_this.loading = true;
			_this.loadingComplete = false;
			_this.nodata = true;
			//如果已经没有数据了，就不取数据了，直接提示已经没有数据
			if (_this.loadingComplete) {
				_this.$common.errorToShow("暂时没有数据了")
				return false;
			}
			
			
			_this.$api.goodsList(_this.conditions(), function(res) {
				if (res.status) {
					//判是否没有数据了，只要返回的记录条数小于总记录条数，那就说明到底了，因为后面没有数据了
					var isEnd = false;
					if (res.data.list.length < _this.searchData.limit) {
						isEnd = true;
					}
					//判断是否为空
					var isEmpty = false;
					if (_this.searchData.page == 1 && res.data.list.length == 0) {
						isEmpty = true;
					}
					_this.goodsList = _this.goodsList.concat(res.data.list);
					_this.ajaxStatus = false;
					_this.loading = !isEnd && !isEmpty;
					_this.toView = '';
					_this.loadingComplete =  isEnd && !isEmpty;
					_this.nodata = isEmpty;
				}
			});
		},

		//上拉加载
		lower: function() {
			var _this = this;
			_this.toView = 'loading';

			if (!_this.loadingComplete) {
				_this.setSearchData({
					page: _this.searchData.page + 1
				});
				_this.getGoods();
			}
		},

		listgrid: function() {
			let _this = this;
			if (_this.alllist) {
				_this.allgrid = true;
				_this.listgrid = true;
				_this.alllist = false;
			} else {
				_this.allgrid = false;
				_this.listgrid = false;
				_this.alllist = true;
			}
		},
		// 统一返回筛选条件 查询条件 分页
        conditions () {
		  let data = this.searchData;
          var newData = {};
		  newData = this.$common.deepCopy(newData,data);
		  //把data里的where换成json
		  if(data.where){
			newData.where = JSON.stringify(data.where);
		  }
		  //把排序换成字符串
		  if(data.order){
			var sort = data.order.key + ' ' + data.order.sort;
			if(data.order.key != 'sort'){
			  sort = sort + ',sort asc'   //如果不是综合排序，增加上第二个排序优先级排序
			}
			newData.order = sort;
		  }else{
			newData.order = 'sort asc';
		  }
		  return newData;
        },
		search(){
			this.setSearchData(
				{
					page: 1,
					where: {
						search_name: this.keyword
					}
				},
				true
			);
			this.getGoods();
		},
		goSearch() {
			let pages = getCurrentPages();
			let prevPage = pages[pages.length - 2]
			let search_flag = prevPage.route;
			if (search_flag == 'pages/index/search') {
				uni.navigateBack({
					delta: 1
				});
			}else{
				this.$common.navigateTo('/pages/index/search');
			}
		}
	}
};
</script>

<style>
.screen {
	width: 100%;
	padding: 10upx 26upx 20upx;
	overflow: hidden;
	margin-bottom: 2upx;
	background-color: #fff;
}
.screen-item {
	width: 25%;
	height: 50upx;
	line-height: 42upx;
	float: left;
	text-align: center;
	position: relative;
}
.screen-item:last-child {
	/* border-left: 2upx solid #eee; */
}
.screen-item-text {
	font-size: 24upx;
	color: #333;
	margin-right: 8upx;
}
.screen-item-icon {
	display: inline-block;
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	overflow: hidden;
}
.screen-item-icon-img {
	width: 16upx;
	height: 8upx;
	display: block;
}
.screen-item-icon .screen-item-icon-img:first-child {
	margin-bottom: 4upx;
}
.list-grid {
	width: 44upx;
	height: 44upx;
	float: left;
}
.filter-img {
	width: 18upx;
	height: 8upx;
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
}
.img-grids-item {
	margin-bottom: 0;
}
.img-grids>view,.img-list>view{
	overflow: hidden;
}
.scroll-Y{
	/*  #ifdef  H5  */
	height:calc(100vh - 270upx);
	/*  #endif  */
	/*  #ifndef  H5  */
	height:calc(100vh - 190upx);
	/*  #endif  */
}
.search-input-p{
	color: #888;
    line-height: 52upx;
    padding-left: 48upx;
}
.order-none{
	text-align: center;
	padding: 200upx 0;
}
.order-none-img{
	width: 274upx;
	height: 274upx;
}
</style>
