<template>
    <div class="message container" v-if="userInfo.roleCd !== 'RL_YK'">
        <div class="message-content">
            <div v-for="(item, index) in list" :key="index" class="message-content-item" @click="handleDetail(item)">
                <img v-if="item.readFlag === 'N'" class="image" src="/static/images/message_no_read.png" />
                <img v-else class="image" src="/static/images/message_read.png" />
                <div v-if="item.msgType == 5" style="width: 660rpx">
                    <div style="display: flex;justify-content: space-between">
                        <div class="content" style="color: red">{{item.msgTitle}}</div>
                        <div class="date">{{item.insertDatetime}}</div>
                    </div>
                    <div class="date">退回原因：{{item.msgContent}}</div>
                </div>
                <div v-if="item.msgType != 5" class="content">{{item.msgContent}}</div>
                <div v-if="item.msgType != 5" class="date">{{item.insertDatetime}}</div>
            </div>
        </div>
        <div class="message-blank" v-if="list.length === 0 && !isLoading">暂无消息</div>
        <div class="message-end" v-if="list.length !== 0 && !isMore && !isLoading">~没有更多了~</div>
    </div>
</template>

<script>
import request from '@/utils/request.js';
import {MESSAGE} from '@/utils/api.js';
import {toast} from '@/utils/bridge';
import store from '@/utils/store';
export default {
    data() {
        return {
            list: [
            ],
            pageNumber: 1,
            pageSize: 20,
            isMore: true,
            isLoading: false
        };
    },
    onShow() {
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
            return;
        }
        this.list = [];
        this.pageNumber = 1;
        this.fetchPageList();
    },
    computed: {
        userInfo() {
            return store.state.userInfo;
        }
    },
    methods: {
        fetchPageList() {
            this.isLoading = true;
            request({
                ...MESSAGE,
                data: {
                    pageNum: this.pageNumber,
                    pageSize: this.pageSize
                }
            }).then(res => {
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
        loadMore() {
            this.pageNumber += 1;
            this.fetchPageList();
        },
        handleDetail(item) {
            if (item.readFlag === 'N') {
                request({
                    url: '/messages/' + item.id,
                    method: 'POST',
                    data: {
                        readFlag: 'Y'
                    }
                }).then(() => {
                    item.readFlag = 'Y';
                });
            }
            if (+item.msgType > 2) {
                wx.navigateTo({
                    url: '/pages/approve/main?id=' + item.worksId
                });
            } else {
                wx.navigateTo({
                    url: '/pages/detail/main?id=' + item.worksId
                });
            }
        }
    },
    onPullDownRefresh() {
        this.pageNumber = 1;
        this.fetchPageList();
        wx.stopPullDownRefresh()
    },
    onReachBottom() {
        if (!this.isLoading && this.isMore) {
            this.loadMore();
        }
    }
};
</script>

<style lang="less" scope>
.message {
    .message-content {
        padding: 0 10px;
        background: #fff;
        font-size: 14px;
        &-item {
            padding: 10px 0;
            display: flex;
            border-bottom: 1px solid rgb(238, 238, 238);
        }
        .image {
            width: 17px;
            height: 17px;
            margin-right: 10px;
        }
        .content {
            flex: 1;
            // white-space:nowrap;/* 规定文本是否折行 */  
            // overflow: hidden;/* 规定超出内容宽度的元素隐藏 */
            // text-overflow: ellipsis;
        }
        .date {
            color: #999;
        }
    }
    .message-end {
        font-size: 12px;
        line-height: 40px;
        color: #aaa;
        background: #fff;
        text-align: center;
    }
    .message-blank {
        font-size: 14px;
        line-height: 100px;
        color: #aaa;
        text-align: center;
        background: #fff;
    }
}

</style>
