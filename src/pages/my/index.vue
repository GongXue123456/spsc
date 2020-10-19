<template>
    <div class="my" v-if="userInfo.roleCd !== 'RL_YK'">
        <div class="my-header">
            <img class="my-header-img" :src="userInfo.userPic" />
            <div class="my-header-name">{{userInfo.realName}}</div>
            <div
                class="my-header-dept"
            > - {{userInfo.organizeName || '无'}} -</div>
            <div class="my-header-desc">简介：{{userInfo.notes || '无'}}</div>
            <div class="my-header-oper" @click="handleEditInfo">
                <span>编辑资料</span>
                <img src="/static/images/nav_arrow.png" />
            </div>
        </div>
        <div class="my-examine">
            <tab :disabled="isLoading" v-if="userInfo.roleCd == 'RL_001' || userInfo.roleCd == 'RL_002'" @change="handleExamineChange" :list="list1"></tab>
        </div>
        <div v-if="worksStatus == 0" class="my-works">
            <tab :disabled="isLoading" @change="handleWorksChange" :list="list2"></tab>
        </div>
        <div class="my-content" v-if="list2.length">
            <div v-for="item in list" :key="item.id" class="my-content-item">
                
                <video
                    v-if="item.worksType === 'video' && item.dtlList.length"
                    class="item-video"
                    :id="item.id"
                    @play="handePlay"
                    @ended="handeEnd"
                    :poster="fileUrl + item.dtlList[0].objId2"
                    :src="fileUrl + item.dtlList[0].objId"
                ></video>
                <div v-else class="item-imgs">
                    <img
                        v-for="(img, imgIndex) in item.dtlList"
                        :key="imgIndex"
                        :src="img ? (fileUrl + img.objId) : ''"
                        :class="['item-img', {'no-margin': imgIndex % 3 === 0}]"
                        mode="aspectFit"
                    />
                </div>
                <div class="item-info">
                    <div @click="handleClick(item)">
                        <div class="item-info-title">{{item.worksName}}</div>
                        <text class="item-info-desc">{{item.worksDesc}}</text>
                    </div>
                    <div v-if="worksStatus==0" class="item-info-nums">
                        <span>
                            <img class="item-info-nums-icon" src="/static/images/comment.png" />
                            <span>
                                {{item.commentNum}}
                                <span style="font-size: 20rpx">{{item.commentNumLable}}</span>
                            </span>
                            <img v-if="item.likeFlag === 'N'" class="item-info-nums-icon" src="/static/images/up.png">
                            <img v-else class="item-info-nums-icon" src="/static/images/up-click.png">
                            <span>
                                {{item.likeNum}}
                                <span style="font-size: 20rpx">{{item.likeNumLable}}</span>
                            </span>
                            <!-- <span class="delete" @click="handleDelete(item.id, index)">
                                <img v-if="worksFlag==='myWorks' && worksStatus == 0" class="item-info-nums-icon" src="/static/images/delete_my.png" />
                            </span> -->
                        </span>
                    </div>
                </div>
            </div>
            <template v-if="list.length">
                <div class="my-end" v-if="list.length && isLoading">加载中...</div>
                <div class="my-end" v-if="!isMore && !isLoading">~没有更多了~</div>
            </template>
            <div class="my-content-blank" v-if="list.length === 0 && !isLoading">暂无内容</div>
        </div>
    </div>
</template>

<script>
import tab from '@/components/tab';
import request from '@/utils/request.js';
import { toast } from '@/utils/bridge.js';
import { PAGE_LIST, fileUrl } from '@/utils/api.js';
import { showFormatNum } from '@/utils/index';
import store from '@/utils/store';
export default {
    components: {
        'tab': tab
    },
    data() {
        return {
            list1: [],
            list2: [],
            list: [],
            worksStatus: 0,
            worksFlag: 'myWorks',
            pageNum: 1,
            pageSize: 5,
            isMore: true,
            isLoading: false,
            fileUrl,
            video: null,
            videoId: ''
        };
    },
    computed: {
        userInfo() {
            return store.state.userInfo;
        }
    },
    onShow() {
        this.pageNum = 1;
        this.getNums();
        this.fetchPageList()
        if (this.userInfo.roleCd === 'RL_YK') {
            var that = this
            wx.showModal({
                title: '非内部用户无法使用！',
                content: `若您是浙江移动公司员工，请邮件联系${this.userInfo.email}`,
                showCancel: true,//是否显示取消按钮
                cancelText:"确定",//默认是“取消”
                cancelColor:'#333333',//取消文字的颜色
                confirmText:"复制邮箱",//默认是“确定”
                confirmColor: '#4598f1',//确定文字的颜色
                success: function (res) {
                    if (res.cancel) {
                        wx.switchTab({
                            url: '/pages/index/main'
                        })
                    } else {
                        //点击确定
                        wx.setClipboardData({
                            data: that.userInfo.email,
                            success: function (res) {
                                wx.getClipboardData({
                                success: function (res) {
                                    wx.showToast({
                                    title: '复制成功'
                                    })
                                    setTimeout(() => {
                                        wx.switchTab({
                                            url: '/pages/index/main'
                                        })
                                    }, 1500)
                                }
                                })
                            }
                        })
                    }
                }
            })
        }
    },
    methods: {
        fetchPageList() {
            if (this.isLoading) {
                return;
            }
            this.isLoading = true;
            let query = {};
            if (this.worksStatus) {
                query.worksStatus = this.worksStatus;
                query.worksFlag = 'myApprove';
            } else {
                query.worksFlag = this.worksFlag;
            }
            request({
                ...PAGE_LIST,
                data: {
                    ...query,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                }
            }).then(res => {
                res.list = res.list.map(item => {
                    if (item.worksType !== 'video' && item.dtlList.length < 9) {
                        item.dtlList.length = 9;
                    }
                    item.likeNum = showFormatNum(item.likeNum);
                    if (item.likeNum.indexOf('万') !== -1) {
                        item.likeNum = item.likeNum.replace('万', '');
                        item.likeNumLable = '万';
                    }
                    item.commentNum = showFormatNum(item.commentNum);
                    if (item.commentNum.indexOf('万') !== -1) {
                        item.commentNum = item.commentNum.replace('万', '');
                        item.commentNumLable = '万';
                    }
                    return item;
                })
                if (res.isFirstPage) {
                    this.list = res.list;
                } else {
                    this.list = this.list.concat(res.list);
                }
                if (res.isLastPage) {
                    this.isMore = false;
                } else {
                    this.isMore = true;
                }
            }).finally(() => {
                this.isLoading = false;
            });
        },
        getNums() {
            request({
                url: '/works/quantity'
            }).then(res => {
                this.list1 = [`我的作品(${res.worksNum})`, `已审核(${res.agreeNum})`, `待审核(${res.pendingNum})`, `已拒绝(${res.rejectNum})`];
                this.list2 = [`作品(${res.worksNum})`, `获赞(${res.getLikeNum})`, `喜欢(${res.likeNum})`, `评论(${res.commentNum})`];
            })
        },
        handeEnd(e) {
            let video = wx.createVideoContext(e.mp.target.id);
            video.exitFullScreen();
        },
        handePlay(e) {
            if (this.video && this.videoId !== e.mp.target.id) {
                this.video.pause();
            }
            this.video = wx.createVideoContext(e.mp.target.id);
            this.videoId = e.mp.target.id;
        },
        handleExamineChange(index) {
            this.worksFlag = 'myWorks';
            if (+index === 0) {
                this.worksStatus = 0;
            } else if (+index === 1) {
                this.worksStatus = 2;
            } else if (+index === 2) { 
                this.worksStatus = 1;
            } else {
                this.worksStatus = 3;
            }
            this.list = [];
            this.pageNum = 1;
            this.fetchPageList();
        },
        handleWorksChange(index) {
            let arr = ['myWorks', 'myWorks2', 'like', 'comment'];
            this.worksFlag = arr[index];
            this.list = [];
            this.pageNum = 1;
            this.fetchPageList();
        },
        loadMore() {
            this.pageNum += 1;
            this.fetchPageList();
        },
        handleUpdate({ data, key, value }) {
            let index = this.list.indexOf(data);
            if (index !== -1) {
                this.list[index][key] = value;
            }
        },
        handleEditInfo() {
            wx.navigateTo({
                url: '/pages/info/main'
            });
        },
        handleClick(item) {
            if (+this.worksStatus > 0) {
                wx.navigateTo({
                    url: '/pages/approve/main?id=' + item.id
                });
                return
            }
            wx.navigateTo({
                url: '/pages/detail/main?id=' + item.id,
                events: {
                    updateDetail: function(data) {
                        for (let i in data) {
                            item[i] = data[i]
                        }
                    }
                }
            });
        },
        handleDelete(id, index) {
            wx.showModal({
                title: '提示',
                content: '确定删除该作品？',
                success: res => {
                    if (res.confirm) {
                        request({
                            url: '/works/' + id,
                            needLogin: true,
                            method: 'DELETE',
                        }).then(res => {
                            this.getNums();
                            this.list.splice(index, 1);
                            
                        })
                    }
                }
            })
        }
    },
    onReachBottom() {
        if (!this.isLoading && this.isMore) {
            this.loadMore();
        }
    }
};
</script>

<style lang="less" scope>
.my {
    flex: 1;
    overflow: auto;
}
.my-header {
    background-color: #fff;
    font-family: "PingFang SC";
    padding: 20px 0;
    text-align: center;
    &-img {
        background: rgb(69, 152, 241);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin: auto;
    }
    &-name {
        font-size: 15px;
        color: rgb(51, 51, 51);
    }
    &-dept {
        margin: 5px 0 10px;
        font-size: 12px;
        color: rgb(102, 102, 102);
    }
    &-desc {
        font-size: 12px;
        color: rgb(203, 203, 203);
    }
    &-oper {
        position: absolute;
        right: 20px;
        top: 20px;
        font-size: 12px;
        color: rgb(51, 51, 51);
        img {
            margin-top: 3.5px;
            margin-left: 10px;
            width: 7px;
            height: 10px;
            float: right;
        }
    }
}
.my-examine {
    border-top: 4px solid rgb(242, 242, 242);
    border-bottom: 4px solid rgb(242, 242, 242);
}
.my-works {
    border-bottom: 1px solid rgb(242, 242, 242);
}
.my-content {
    .my-content-blank {
        font-size: 14px;
        line-height: 100px;
        color: #aaa;
        text-align: center;
    }
    &-item {
        margin: 8px 0;
        padding: 5px 15px;
        background-color: #fff;
        display: flex;
    }
    .item-imgs {
        margin: 5px 0;
        width: 120px;
        min-height: 120px;
    }
    .item-video {
        margin: 5px 10px 5px 0;
        width: 110px;
        height: 110px;
    }
    .item-img {
        float: left;
        width: 35px;
        height: 35px;
        margin-left: 2px;
        margin-bottom: 2px;
        background: #eee;
        border-radius: 4px;
        &.no-margin {
            margin-left: 0;
        }
    }
    .item-info {
        flex: 1;
        position: relative;
        margin-bottom: 4px;
        &-title {
            padding-top: 5px;
            font-size: 14px;
            color: rgb(51, 51, 51);
            line-height: 1.2;
        }
        &-desc {
            margin-top: 5px;
            font-size: 10px;
            color: rgb(153, 153, 153);
            line-height: 1.2;
        }
        &-nums {
            position: absolute;
            font-size: 13px;
            color: rgb(51, 51, 51);
            right: 0;
            bottom: 0;
            line-height: 1;
            .delete {
                padding: 10px;
                img {
                    margin: 0;
                    margin-left: 10px; 
                }
            }
            &-icon {
                vertical-align: bottom;
                width: 13px;
                height: 13px;
                margin: 0 10px 0 20px;
            }
        }
    }
}
.my-end {
    font-size: 12px;
    line-height: 24px;
    color: #aaa;
    text-align: center;
}
</style>
