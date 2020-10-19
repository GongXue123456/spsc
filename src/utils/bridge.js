/**
 * @file 封装调用系统能力
 */

export const toast = options => {
    if (typeof options === 'string') {
        wx.showToast({
            title: options,
            icon: 'none',
            duration: 2000
        });
    } else if(typeof options === 'object') {
        wx.showToast(options);
    } else {
        wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 2000
        });
    }
};

export const chooseImage = options => {
    return new Promise((resolve, reject) => {
        wx.chooseImage({
            count: 9 - options ,
            sourceType: ['album', 'camera'],
            success: res => {
                resolve(res);
            },
            fail: err => {
                reject(err);
            }
        });
    });
};

export const chooseVideo = () => {
    return new Promise((resolve, reject) => {
        wx.chooseVideo({
            sourceType: ['album','camera'],
            maxDuration: 60,
            camera: 'back',
            success: res => {
                resolve(res);
            },
            fail: err => {
                reject(err);
            }
        });
    });
};

export const chooseMedia = () => {
    return new Promise((resolve, reject) => {
        wx.chooseMedia({
            count: 3,
            mediaType: ['image','video'],
            sourceType: ['album', 'camera'],
            maxDuration: 15,
            camera: 'back',
            success: res => {
                resolve(res);
            },
            fail: err => {
                reject(err);
            }
        });
    });
};

export const wxLogin = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            success(res) {
                if (res.code) {
                    resolve(res);
                } else {
                    toast('登录失败' + res.errMsg);
                    reject(err);
                }
            },
            fail: err => {
                toast('登录失败');
                reject(err);
            }
        })
    });
};

export const chooseLocation = () => {
    return new Promise((resolve, reject) => {
        wx.chooseLocation({
            success(res) {
                resolve(res);
            },
            fail: err => {
                console.log(err)
                reject(err);
            }
        })
    });
};

// export const getUserInfo = () => {
//     return new Promise((resolve, reject) => {
//         wx.getUserInfo({
//             success(res) {
//                 resolve({
//                     userInfo: res.rawData
//                 });
//             },
//             fail(err) {
//                 reject(err);
//             }
//         });
//     });
// }

export const wxStorage = {
    set: (key, data) => {
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        } else if (typeof data !== 'string') {
            data = data + '';
        }
        wx.setStorage({
            key,
            data
        });
    },
    get: key => {
        return new Promise((resolve, reject) => {
            wx.getStorage({
                key,
                success(res) {
                    resolve(res.data);
                },
                fail() {
                    resolve('');
                }
            });
        });
    }
};

wx