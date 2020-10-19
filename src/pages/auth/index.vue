<!--suppress CssNoGenericFontName -->
<template>
    <div class="auth container">
        <div class="logo">
            <img class="logo-img" src="/static/images/auth_logo.png" alt="">
            <div class="auth-title">
                授权认证
            </div>
            <div class="auth-desc">
                该小程序只针对浙江移动内部用户使用，为了匹配验证是否为公司内部员工，我们将获取您的用户信息和手机号码
            </div>
        </div>
        <div>
            <button
                v-if="showGetPhone"
                type="buttin"
                open-type="getPhoneNumber"
                lang="zh_CN"
                @getphonenumber="getPhoneNumber"
                class="submit-btn auth-btn"
                >授权手机号
            </button>
            <button
                v-else
                type="buttin"
                open-type="getUserInfo"
                lang="zh_CN"
                @getuserinfo="getUserInfo"
                class="submit-btn auth-btn"
                >授权用户信息
            </button>
        </div>
    </div>
</template>

<script>
import store from '@/utils/store';
import request from '@/utils/request';
import {REGISTER} from '@/utils/api';
import {wxLogin, toast} from '@/utils/bridge';
export default {
    data() {
        return {
            showGetPhone: false,
            userInfo: {
            }
        }
    },
    computed: {
        code() {
            return store.state.code;
        }
    },
    onShow() {
        typeof wx.hideHomeButton === 'function' && wx.hideHomeButton();
        wx.getSetting({
            success: setting => {
                for (let i in setting.authSetting) {
                    if (i === 'scope.userInfo' && setting.authSetting[i]) {
                        wx.getUserInfo({
                            success: this.getUserInfo
                        })

                    }
                }
            }
        })
    },
    methods: {
        getUserInfo(e) {
            if (e.mp && e.mp.detail.userInfo) {
                this.userInfo.userPic = e.mp.detail.userInfo.avatarUrl;
                this.userInfo.realName = e.mp.detail.userInfo.nickName;
                this.showGetPhone = true;
                toast('请继续绑定手机号');
            } else if (e.userInfo) {
                this.userInfo.userPic = e.userInfo.avatarUrl;
                this.userInfo.realName = e.userInfo.nickName;
                this.showGetPhone = true;
            } else {
                toast('取消授权，注册失败');
            }
        },
        getPhoneNumber(e) {
            if (!e.mp.detail.encryptedData) {
                toast('取消授权，无法注册');
                return;
            }
            this.userInfo.encryptedData = e.mp.detail.encryptedData;
            this.userInfo.iv = e.mp.detail.iv;
            wx.reLaunch({
                url: `/pages/index/main?info=${encodeURIComponent(JSON.stringify(this.userInfo))}`
            });
        }
    }
};
</script>

<style lang="less" scoped>
    .auth {
        background: #fff;
    }
    .logo {
        margin-top: 67px;
        text-align: center;
    }
    .logo-img {
        width: 114px;
        height: 100px;
    }
    .auth-title {
        padding-top: 30px;
        font-family: PingFangSC-Regular;
        font-size: 20px;
        color: #000;
        margin: auto;
    }
    .auth-desc {
        padding: 24px 20px 0;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        line-height: 20px;
        color: #888;
        margin: auto;
    }
    .auth-btn {
        margin-top: 98px;
        width: 345px;
        height: 44px;
        background-color: #09bb07;
        border-radius: 5px;
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #fff;
    }

</style>
