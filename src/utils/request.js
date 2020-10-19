/**
 * @file 接口请求
 * @deprecated 封装请求接口
 * @author liule
 * @since 2019.05.03
 */
import pageList from '@/mock/json/pageList.json';
import pageDetail from '@/mock/json/pageDetail.json';
import activityWorks from '@/mock/json/activityWorks.json';
import rankingList from '@/mock/json/ranking.json';
import myLikes from '@/mock/json/myLikes.json';
import myWorks from '@/mock/json/myWorks.json';
import login from '@/mock/json/login.json';
import getUserInfo from '@/mock/json/getUserInfo.json';
import sign from '@/mock/json/sign.json';
import bindPhone from '@/mock/json/bindPhone.json';
import addUserInfo from '@/mock/json/addUserInfo.json';

import store from '@/utils/store';
import {wxLogin, wxStorage} from '@/utils/bridge';
import {LOGIN, baseUrl} from '@/utils/api';
import { toast } from './bridge';

let mockMap = {
    '/works/list': pageList,
    '/works/comments': bindPhone,
    '/wxaAct/wxaActWork': activityWorks,
    '/wxaActWork/pageWorkRank': rankingList,
    '/wxaActWorkLog/pageMyLike': myLikes,
    '/wxaActWork/pageMyWork': myWorks,
    '/wxaUser/queryInfo': getUserInfo,
    '/login': login,
    '/wxaActUser/sign': sign,
    '/wxaUser/bindPhone': bindPhone,
    '/wxaUser/addUserInfo': addUserInfo
};


let DEBUG = false;

let userLogin = () => {
    return new Promise((resolve, reject) => {
        wxLogin().then(res => {
            store.commit('setCode', res.code);
            wx.showNavigationBarLoading();
            wx.request({
                url: baseUrl + LOGIN.url,
                method: 'POST',
                data: {
                    code: res.code
                },
                success: res => {
                    wx.hideNavigationBarLoading();
                    let header = res.header;
                    res = res.data;
                    if (+res.code === 200 && header.token) {
                        store.commit('setToken', header.token);
                        store.commit('setUserInfo', res.data);
                        resolve();
                    } else {
                        wx.navigateTo({
                            url: '/pages/auth/main'
                        });
                        reject(res);
                    }
                },
                fail: err => {
                    wx.hideNavigationBarLoading();
                    reject(err);
                }
            });
        });
    });
};

function request(options) {
    return new Promise((resolve, reject) => {
        let xhr = () => {
            if (DEBUG) {
                setTimeout(() => {
                    wx.hideNavigationBarLoading();
                    resolve(mockMap[options.url].data);
                }, 300);
                store.commit('setUserInfo', login.data);
                return;
            };
            options.url = baseUrl + options.url;
            wx.showNavigationBarLoading();
            options.data = options.data || {};
            options.data.time = +new Date();
            wx.request({
                ...options,
                header: {
                    token: store.state.token
                },
                success: res => {
                    if (res.header.token) {
                        store.commit('setToken', res.header.token);
                    }
                    wx.hideNavigationBarLoading();
                    wx.stopPullDownRefresh();
                    try {
                        let data = res.data;
                        if (+data.code === 200) {
                            resolve(data.data || data);
                        } else {
                            toast(data.msg);
                            reject(data);
                        }
                    } catch (error) {
                        toast();
                        reject(error);
                    }
                },
                fail: err => {
                    console.log(2);
                    wx.hideNavigationBarLoading();
                    wx.stopPullDownRefresh();
                    toast();
                    reject(err);
                }
            });
        };
        if (!DEBUG && options.needLogin && !store.state.token) {
            userLogin().then(() => {
                xhr();
            });
        } else {
            xhr();
        }
    });
}

export const uploadFile = options => {
    options.url = baseUrl + options.url;
    return new Promise((resolve, reject) => {
        let xhr = () => {
            if (DEBUG) {
                setTimeout(() => {
                    wx.hideNavigationBarLoading();
                    resolve(mockMap[options.url]);
                }, 300);
                return;
            };
            wx.uploadFile({
                ...options,
                header: {
                    "token": store.state.token,
                    "Content-Type": "multipart/form-data"
                },
                success: res => {
                    try {
                        let data = JSON.parse(res.data)
                        if (data.code === 200) {
                            resolve(data);
                        } else {
                            toast(data.msg);
                            reject(data);
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                fail: err => {
                    reject(err);
                }
            })
        };
        if (options.needLogin && !store.state.token) {
            userLogin().then(() => {
                xhr();
            });
        } else {
            xhr();
        }
    });
}


export default request;
