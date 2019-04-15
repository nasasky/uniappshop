import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		config: {}, // 店铺配置信息
		orderTab: 0, // 选中的订单tab页
		redirectPage: ''
	},
    mutations: {
		config (state, payload) {
			state.config = payload
		},
		orderTab (state, tab) {
			state.orderTab = tab
		},
		redirect (state, payload) {
			state.redirectPage = payload.page
		}
	},
	actions: {

	},
	getters: {
		shopConfig: state => state.config
	}
})

export default store
