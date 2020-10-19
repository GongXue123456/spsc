/**
 * @file 小程序接口库
 * @description 小程序应用的所有接口
 * @author liule
 * @since 2019.05.02
 */

export const baseUrl = 'https://scm.zj.chinamobile.com/plat';
// export const baseUrl = 'https://plat.mynatapp.cc/plat';
// export const baseUrl = 'http://192.168.1.22:9091/plat'
// export const baseUrl = 'http://10.73.216.57:9091/plat'

export const fileUrl = '';

// 微信登录 1
export const LOGIN =  {
    url: '/login',
    needLogin: false,
    method: 'POST'
};
export const REGISTER = {
    url: '/register',
    needLogin: false,
    method: 'POST'
}
export const ADD_COMMENTS = {
    url: '/works/comments',
    needLogin: true,
    method: 'POST'
}
export const ACTIVITY = {
    url: '/activity',
    needLogin: true,
    method: 'POST'
}
export const USER = {
    url: '/admin/users',
    needLogin: true,
    method: 'POST'
}
export const LIKES = {
    url: '/works/likes',
    needLogin: true,
    method: 'POST'
}
export const BROWSE = {
    url: '/works/pv',
    needLogin: true,
    method: 'POST'
}
export const MESSAGE = {
    url: '/messages',
    needLogin: true,
    method: 'GET'
}
// 随拍随传上传图片或视频
export const UPLOAD_FILES =  {
    url: '/file',
    needLogin: true,
    method: 'POST',
    name:'file'
};
// 新增作品
export const SUBMIT_WORK =  {
    url: '/works',
    needLogin: true,
    method: 'POST'
};

//获取uuid
export const GET_UUID =  {
    url: '/uuid',
    needLogin: true,
    method: 'GET'
};

// 用户名密码登录
export const PWD_LOGIN =  {
    url: '/wxaLogin/pwdLogin',
    needLogin: false,
    method: 'GET'
};
// 绑定用户信息
export const BIND_PHONE =  {
    url: '/wxaUser/bindPhone',
    needLogin: true,
    method: 'GET'
};
// 查询用户微信信息
export const QUERY_INFO =  {
    url: '/wxaUser/queryInfo',
    needLogin: true,
    method: 'GET'
};
// 获取活动列表 1
export const PAGE_LIST =  {
    url: '/works/list',
    needLogin: true,
    method: 'GET'
};
// 获取可发布作品的活动
export const PAGE_SELECT = {
    url: '/wxaAct/pageSelect',
    needLogin: true,
    method: 'GET'
};
// 获取可查看排行榜的作品活动
export const PAGE_RANK_SELECT = {
    url: '/wxaAct/pageRankSelect',
    needLogin: true,
    method: 'GET'
};
// 获取活动详情 1
export const QUERY_ACTIVITY =  {
    url: '/wxaAct/queryActivity',
    needLogin: true,
    method: 'GET'
};
// 获取活动作品 1
export const ACT_WORK = {
    url: '/wxaActWork/pageWorkList',
    needLogin: true,
    method: 'GET'
};
// 绑定用户手机号
export const ADD_USER_INFO =  {
    url: '/wxaUser/addUserInfo',
    needLogin: true,
    method: 'GET'
};
// 用户打卡 1
export const SIGN =  {
    url: '/wxaActUser/sign',
    needLogin: true,
    method: 'GET'
};
// 用户是否参与、打卡活动
export const QUERY_SIGN_AND_JOIN =  {
    url: '/wxaActUser/querySignAndJoin',
    needLogin: true,
    method: 'GET'
};
// 获取活动作品排行榜 1
export const PAGE_WORK_RANK =  {
    url: '/wxaActWork/pageWorkRank',
    needLogin: true,
    method: 'GET'
};
// 用户发布作品
export const JOIN_AND_PUBLISH =  {
    url: '/wxaActWork/joinAndPublish',
    needLogin: true,
    method: 'GET'
};
// 获取我的的作品 1
export const PAGE_MY_WORK =  {
    url: '/wxaActWork/pageMyWork',
    needLogin: true,
    method: 'GET'
};
// 用户删除活动
export const DELETE =  {
    url: '/wxaActWork/delete',
    needLogin: true,
    method: 'GET'
};
// 用户喜欢活动 1
export const LIKE =  {
    url: '/wxaActWorkLog/like',
    needLogin: true,
    method: 'GET'
};
// 用户取消喜欢 1
export const CANCEL_LIKE =  {
    url: '/wxaActWorkLog/cancelLike',
    needLogin: true,
    method: 'GET'
};
// 获取我喜欢的 1
export const PAGE_MY_LIKE =  {
    url: '/wxaActWorkLog/pageMyLike',
    needLogin: true,
    method: 'GET'
};
// 上传图片
export const UPLOAD_IMG =  {
    url: '/wxaUploadFtp/uploadImg',
    needLogin: true,
    method: 'POST',
    name:'uploadImgFile'

};

// 上传视频
export const UPLOAD_VIDEO =  {
    url: '/wxaUploadFtp/uploadVideo',
    needLogin: true,
    method: 'POST',
    name:'uploadVideoFile'

};

// 上传图片或视频
export const UPLOAD_MEDIA =  {
    url: '/wxaUploadFtp/uploadMedia',
    needLogin: true,
    method: 'POST',
    name:'uploadMediaFile'
};


export const PHOTO_LOGIN = {
    url: '/login',
    needLogin: true,
    method: 'POST',
    name:'uploadMediaFile'
}








