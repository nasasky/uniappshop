<script>
	export default {
		onLaunch () {
			console.log('App Launch')
			// 获取店铺配置信息  全局只请求一次
			let _this = this
			_this.$api.shopConfig(function(res) {
				_this.$store.commit('config', res)
			})
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "./static/css/style.css";
</style>
