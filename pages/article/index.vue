<template>
	<view class="content">
		<view class="article">
			<view class="article-title">
				{{ info.title }}
			</view>
			<view class="article-time">
				{{ info.ctime }}
			</view>
			<view class="article-content">
				<rich-text :nodes="info.content"></rich-text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data () {
		return {
			articleId: 0,
			noticeId: 0,
			info: {}
		}
	},
	onLoad (options) {
		this.articleId = options.article_id;
		this.noticeId = options.notice_id;
		if (!this.articleId && !this.noticeId) {
			this.$common.errorToShow('请求出错')
		} else if (this.articleId) {
			this.articleDetail();
		} else if (this.noticeId) {
			uni.setNavigationBarTitle({
				title: '公告详情'
			});
			this.noticeDetail();
		}
	},
	methods: {
		articleDetail () {
			let data = {
				article_id: this.articleId
			}
			this.$api.articleInfo(data, res => {
				if (res.status) {
					const info = res.data
					info.ctime = this.$common.timeToDate(info.ctime)
					info.utime = this.$common.timeToDate(info.utime)
					this.info = info
				} else {
					this.$common.errorToShow(res.msg)
				}
			})
		},
		noticeDetail() {
			let data = {
				id: this.noticeId
			}
			this.$api.noticeInfo(data, res => {
				if (res.status) {
					const info = res.data
					info.ctime = this.$common.timeToDate(info.ctime)
					info.utime = this.$common.timeToDate(info.utime)
					this.info = info
				} else {
					this.$common.errorToShow(res.msg)
				}
			})
		}
	}
}	
</script>

<style>
.article{
	padding: 20upx;
}
.article-title{
	font-size: 32upx;
	color: #333;
	margin-bottom: 20upx;
	text-align: center;
}
.article-time{
	font-size: 26upx;
	color: #999;
	text-align: right;
}
.article-content{
	font-size: 28upx !important;
	color: #666;
	line-height: 1.6;
	margin-top: 20upx;
}

.article-content p img{
	width: 100% !important;
}
</style>
