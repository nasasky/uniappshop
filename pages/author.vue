<template>
	<view>
		信息加载中.....
	</view>
</template>

<script>
export default {
	data () {
		return {
			code: '',
			type: '',
			state: '',
			uuid: ''
		}
	},
	onLoad (options) {
		// 获取url上的参数
        this.code = this.getUrlParam('code')
        this.state = this.getUrlParam('state')
        this.uuid = this.$db.get('uuid')
        this.userTrustLogin()
	},
	methods: {
		// 获取url地址参数
		getUrlParam (paraName) {
            let url = document.location.toString()
            let arrObj = url.split('?')
            if (arrObj.length > 1) {
                let arrPara = arrObj[1].split('&')
                let arr
                for (let i = 0; i < arrPara.length; i++) {
                    arr = arrPara[i].split('=')
                    if (arr != null && arr[0] == paraName) {
                        if ((arr[1].indexOf('#'))) {
                            let str
                            str = arr[1].split('#')
                            return str[0]
                        }
                        return arr[1]
                    }
                }
                return ''
            } else {
                return ''
            }
        },
		// 第三方登录
        userTrustLogin () {
            this.$api.trustLogin({
                code: this.code,
                type: this.type,
                state: this.state,
                uuid: this.uuid
            }, res => {
                if (res.status) {
                    if (res.data.is_new) {
                        this.$common.redirectTo('/pages/register/index?type=bind')
                    } else if (res.data) {
                        this.$db.set('userToken', res.data)
                        this.$common.redirectTo('/pages/member/index/index')
                    }
                }
            })
        }
	}
}	
</script>

<style>
</style>
