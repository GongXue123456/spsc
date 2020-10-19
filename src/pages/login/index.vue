<template>
    <div class="container">
        <div class="login">
            <div class="login-tips">该小程序供浙移企业内部开展各项活动用，请使用OA账号登录</div>
            <!--<div class="login-title">账号密码登录</div>-->
            <div class="login-value">
                <input type="text" class="login-input" v-model="login.username" placeholder="OA账号" />
                <input
                    type="password"
                    class="login-input"
                    v-model="login.password"
                    placeholder="密码"
                />
            </div>
            <button v-on:click="pwdLogin" class="btn">登录</button>
            <br />
        </div>
    </div>
</template>

<script>


import request from '@/utils/request';
import store from '@/utils/store.js'
import { PWD_LOGIN } from '@/utils/api';


export default {
    data() {
        return {
            login: {
                username: '',
                password: ''
            }
        }
    },

    methods: {
        pwdLogin(data) {
            request({
                ...PWD_LOGIN,
                data: this.login
            }).then(res => {
                store.commit('setToken', res.token);
                wx.switchTab({
                    url: '/pages/index/main'
                });
            });
        }

    }
};
</script>

<style lang="less" scope>
.container {
    background-color: #fff;
}

.login {
    padding-top: 50px;
    padding-left: 25px;
    padding-right: 25px;
    text-algin: center;
}

.login-title {
    height: 19px;
    font-family: PingFangSC-Medium;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #333333;
}

.login-tips {
    height: 19px;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #333333;
    margin-bottom: 50px;
}

.login-value {
    margin-top: 25px;
}

.login-input {
    margin-top: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid #d2d3d5;

    height: 20px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 25px;
    letter-spacing: 0px;
    color: #888888;
}
.btn {
    margin-top: 50px;
    height: 44px;
    background-color: #55b737;
    border-radius: 5px;
    box-sizing: border-box;
    font-weight: 700;
    font-size: 17px;
    text-align: center;
    text-decoration: none;
    color: #ffffff;
}
</style>
