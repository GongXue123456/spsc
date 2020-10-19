<template>
    <div class="index container" v-if="isLoaded || list.length">
        <div class="index-herder">
            <div class="index-herder-logo">
                <img src="/static/images/logo.png">
            </div>
            <div class="index-herder-text">
                优质服务无处不在，当您身边出现优质服务画面、优秀服务故事、服务感人场景时，欢迎您随时拍下来，并上传到这里！我们会根据实际情况，对上传的内容进行整合，通过合适的方式开展适宜的宣传，提升公司服务形象，宣传一线人员的服务精神。
            </div>
            <div class="index-herder-dep">
                - 中国移动浙江公司客户服务部 -
            </div>
						<loading v-if="loadingHidden">
							加载中...
						</loading>
            <div class="index-search">
                <img class="icon-search" src="/static/images/search.png">
                <input v-model="searchText" confirm-type="search" @confirm="handleSearch" placeholder="支持编号、作品名、发布人搜索">
                <img @click="showAort" class="icon-sort" mode="aspectFit" src="/static/images/sort.png">
            </div>
        </div>
        <div v-show="upShow" class="animate">
            <img src="/static/images/up-click.png" class="animate__flipInX" style="">
        </div>
        <div class="index-no-content" v-if="!isLoading && !list.length">- {{searchText ? '未搜到对应内容，换个搜索条件试试' : '暂无作品'}} -</div>
        <div class="index-content">
            <div v-for="(item, index) in list" :key="index" class="index-content-item">
                <div class="item-user">
                    <img class="item-user-img" mode="widthFix" :src="item.userPic">
                    <div class="item-user-text">
                        <div class="item-user-name">{{item.fullName}}</div>
                        <div class="item-user-time">{{item.agreeDate}}</div>
                    </div>
                </div>
                <div class="item-info">
                    <div @click="handleDetail(item)">
                        <div class="item-info-title">{{item.worksNo}} _ {{item.worksName}}</div>
                        <text class="item-info-desc">{{item.worksDesc}}</text>
                    </div>
                    <video
                        v-if="item.worksType === 'video' && item.dtlList.length"
                        class="item-info-video"
                        :id="item.id"
                        @play="handePlay(item, $event)"
                        @ended="handeEnd"
                        :show-center-play-btn="true"
                        :poster="fileUrl + item.dtlList[0].objId2"
                        :src="fileUrl + item.dtlList[0].objId">
                    </video>
                    <div v-else class="item-info-imgs">
                        <img
                            v-for="(img, imgIndex) in item.dtlList"
                            :key="imgIndex"
                            :src="fileUrl + img.objId"
                            :class="['item-info-img', {'no-margin': imgIndex % 3 === 0}]"
                            mode="aspectFill"
                            @click.stop="handlePreview(item, item.worksId, item.dtlList, img)">
                    </div>
                </div>
                <div class="item-position" v-if="item.address">
                    <img class="item-position-icon" src="/static/images/position.png">
                    <span>{{item.address}}</span>
                </div>
                <div class="item-nums">
                    <span class="item-num" style="position: absolute;left: 0;color: #999999">
                        <span>浏览：</span>
                        <span class="item-nums-num">
                            {{item.pvNum}}
                            <span class="item-nums-label">{{item.pvNumLable}}</span>
                        </span>
                    </span>
                    <span v-if="userInfo.roleCd == 'RL_001'" class="item-num" style="margin-right: 37px" @click.stop="showReject(item.id)">
                        <img class="item-nums-icon" style="width: 46rpx;height: 46rpx" src="/static/images/reject.png">
                    </span>
                    <span v-if="userInfo.roleCd != 'RL_YK'" class="item-num" @click.stop="showComment(item)">
                        <img class="item-nums-icon" src="/static/images/comment.png">
                        <span class="item-nums-num">
                            {{item.commentNum}}
                            <span class="item-nums-label">{{item.commentNumLable}}</span>
                        </span>
                    </span>
                    <span class="item-num" @click.stop="handleLike(item.id, item, 'works')">
                        <img v-if="item.likeFlag === 'N'" class="item-nums-icon" src="/static/images/up.png">
                        <img v-if="item.likeFlag === 'Y'" class="item-nums-icon" src="/static/images/up-click.png">
                        <span class="item-nums-num">
                            {{item.likeNum}}
                            <span class="item-nums-label">{{item.likeNumLable}}</span>
                        </span>
                    </span>
                    <span v-if="userInfo.roleCd == 'RL_001' || userInfo.roleCd == 'RL_002'" class="item-num" @click.stop="handleDownload(item.dtlList)">
                        <img class="item-nums-icon" src="/static/images/upload.png">
                    </span>
                </div>
                <div class="item-comments" v-if="userInfo.roleCd != 'RL_YK'">
                    <template v-for="(comment, commentIndex) in item.commentList" >
                        <div v-if="commentIndex < 5 || item.showMore" :key="commentIndex" class="item-comment">
                            <div class="item-comment-content">
                                <span>{{comment.fullName}}：{{comment.commentMsg}}</span>
                            </div>
                            <div class="item-comment-like" @click.stop="handleLike(item.id, comment, 'comment')">
                                <img v-if="comment.likeFlag === 'N'" class="item-nums-icon" src="/static/images/up.png">
                                <img v-else class="item-nums-icon" src="/static/images/up-click.png">
                                <span class="item-nums-num">
                                    {{comment.likeNum}}
                                    <span class="item-nums-label">{{comment.likeNumLable}}</span>
                                </span>
                            </div>
                        </div>
                    </template>
                    <template v-if="item.commentList.length > 5">
                        <div class="item-comments-more">
                            <span @click="item.showMore = !item.showMore">{{item.showMore ? '收起' : '查看更多'}}</span>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div v-if="showRejectInput" class="approve-mask"></div>
        <div v-if="showRejectInput" class="dialog" :show="true" title="请输入退回原因">
            <div class="mask"></div>
            <div class="dialog-body">
                <div class="dialog-content" style="margin-bottom: 20px">
                    <div style="font-size: 18px;">
                        请输入退回原因
                    </div>
                </div>
                <input :cursor-spacing="10" v-model="rejectNotes" max="50" @confirm="handleApprove('REJECT')" :focus="true" style="color: #333" placeholder="内容" />
                <div>
                    <button style="width: 70px;height: 30px;line-height: 30px;text-align: center;color: #fff;background-color: rgb(60, 133, 237);float: right;margin-top: 10px;" size="mini" @click="handleApprove('REJECT')">确定</button>
                    <button style="width: 70px;height: 30px;line-height: 30px;text-align: center;color: #333;float: right;margin-top: 10px;margin-right:20px" size="mini" @click="inputRejectBlur">取消</button>
                </div>
            </div>
        </div>
        <div class="index-end" v-if="list.length && isLoading">加载中...</div>
        <div class="index-end" v-if="list.length && !isMore && !isLoading">~没有更多了~</div>
        <div v-if="showInput" class="index-input">
            <input :cursor-spacing="10" @blur="inputBlur" @confirm="handleComment" :focus="true" placeholder="评论" />
        </div>
        <div v-if="dialogVisable" class="dialog" :show="true" title="提示">
            <div class="mask"></div>
            <div class="dialog-body">
                <div class="dialog-content">
                    <div>
                        优质服务无处不在，当您身边出现优质服务画面、优秀服务故事、服务感人场景时，欢迎您随时拍下来，并上传到这里！我们会根据实际情况，对上传的内容进行整合，通过合适的方式开展适宜的宣传，提升公司服务形象，宣传一线人员的服务精神。
                    </div>
                    <div class="right">
                        中国移动浙江公司客户服务部
                    </div>
                </div>
                <checkbox-group @change="handleChange">
                    <checkbox value="Y">不再提醒</checkbox>
                </checkbox-group>
                <div class="dialog-btns">
                    <button @click="closeDialog">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { showFormatTime, showFormatNum } from '@/utils/index';
import topbar from '@/components/topbar';
import {REGISTER} from '@/utils/api';
import request from '@/utils/request.js';
import {PAGE_LIST, fileUrl, ADD_COMMENTS, ACTIVITY, LIKES, BROWSE} from '@/utils/api.js';
import store from '@/utils/store';
import {wxLogin, storage, toast} from '@/utils/bridge';
export default {
    data() {
        return {
            selectItem: null,
            detailItem: null,
            showInput: false,
            loadingHidden: false,
            orderBy: 'date',
            rejectNotes: '',
            rejectId: '',
            showRejectInput: false,
            fileUrl,
            list: [
            ],
            upShow: false,
            searchText: '',
            checkbox: false,
            dialogVisable: false,
            pageNum: 1,
            pageSize: 5,
            isMore: true,
            isLoading: true,
            isLoaded: false,
            video: null,
            videoId: ''
        };
    },
    onShow() {
        if (this.list.length === 0) {
            this.fetchPageList().then(() => {
                if (this.userInfo.welcomePageEject === 'Y') {
                    this.showDialog();
                }
            });
        }
    },
    onLoad(option) {
        if (option.info) {
            let Info = JSON.parse(decodeURIComponent(option.info))
            wxLogin().then(login => {
                Info.code = login.code;
                request({
                    ...REGISTER,
                    data: Info
                }).then(res => {
                    toast({
                        title: '授权成功',
                        icon: 'success'
                    });
                    store.commit('setUserInfo', res);
                })
            })
        }
    },
    computed: {
        userInfo() {
            if (store.state.userInfo) {
                return store.state.userInfo;
            }
            return {};
        }
    },
    methods: {
        fetchPageList() {
            this.isLoading = true;
            return request({
                ...PAGE_LIST,
                data: {
                    orderParams: this.orderBy,
                    searchParams: this.searchText,
                    worksFlag: 'index',
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                }
            }).then(res => {
                if (res.list) {
                    res.list = res.list.map(item => {
                        item.agreeDate = showFormatTime(item.agreeDate);
                        item.pvNum = showFormatNum(item.pvNum);
                        if (item.pvNum.indexOf('万') !== -1) {
                            item.pvNum = item.pvNum.replace('万', '');
                            item.pvNumLable = '万';
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
                        item.commentList = item.commentList.map(comment => {
                            comment.likeNum = showFormatNum(comment.likeNum);
                            if (comment.likeNum.indexOf('万') !== -1) {
                                comment.likeNum = comment.likeNum.replace('万', '');
                                comment.likeNumLable = '万';
                            }
                            return comment;
                        })
                        item.showMore = false;
                        return item;
                    })
                }
                if (res.isFirstPage || this.pageNum === 1) {
                    this.list = res.list;
                } else {
                    this.list = this.list.concat(res.list);
                }
                if (res.isLastPage) {
                    this.isMore = false;
                } else {
                    this.isMore = true;
                }
            }).finally((err) => {
                this.isLoading = false;
                this.isLoaded = true;
            });
        },
        at_play() {
            //动画开始
            this.upShow = true
            setTimeout(() => {
                this.upShow = false
            }, 1500)
        },
        showReject(id) {
            this.rejectNotes = '退回修改';
            this.showRejectInput = true
            this.rejectId = id
        },
        inputRejectBlur() {
            this.rejectNotes = '';
            this.rejectId = ''
            this.showRejectInput = false
        },
        handleApprove(operation) {
            request({
                url: '/works/approve/' + this.rejectId,
                data: {
                    operation,
                    notes: this.rejectNotes ? this.rejectNotes : '退回修改'
                },
                method: 'POST',
            }).then(res => {
                this.showRejectInput = false;
                this.rejectNotes = '';
                this.fetchPageList()
            })
        },
        handleSearch() {
            this.pageNum = 1;
            this.list = [];
            this.fetchPageList();
        },
        showDialog() {
            this.dialogVisable = true;
        },
        closeDialog() {
            this.dialogVisable = false;
            if (!this.checkbox) {
                return;
            }
            request({
                ...ACTIVITY,
                data: {
                    welcomePageEject: 'N'
                }
            }).then(() => {
                const userInfo = this.userInfo
                userInfo.welcomePageEject = 'N'
                store.commit('setUserInfo', userInfo);
            })
        },
        handleDownload(list) {
			    this.loadingHidden = true
			    let _that = this
					Promise.all(list.map(item => {
						return new Promise((reslove, reject) => {
							wx.downloadFile({
					      url: item.objId,
					      success: function (res) {
                            var filePath = res.tempFilePath;
                            if (item.worksType === 'picture') {
                                wx.saveImageToPhotosAlbum({
                                    filePath: filePath,
                                    success:function (data) {
                                        reslove(res);
                                    },
                                    fail (err) {
                                        let showTitle = ''
                                        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response" || err.errMsg === "saveImageToPhotosAlbum:fail auth denied") {
                                            showTitle = '请前往设置页开启相册使用权限'
                                        } else if (err.errMsg === 'saveImageToPhotosAlbum:fail cancel') {
                                            showTitle = '取消下载'
                                        }
                                        _that.loadingHidden = false
                                        wx.showToast({
                                            title: showTitle,
                                            icon: 'none',
                                            duration: 3500
                                        })
                                        reject(err);
                                    }
                                })
                            } else if (item.worksType === 'video') {
                                wx.saveVideoToPhotosAlbum({
                                    filePath: filePath,
                                    success:function (data) {
                                        reslove(res);
                                    },
                                    fail (err) {
                                        let showTitle = ''
                                        if (err.errMsg === "saveVideoToPhotosAlbum:fail auth deny" || err.errMsg === "saveVideoToPhotosAlbum:fail authorize no response" || err.errMsg === "saveVideoToPhotosAlbum:fail auth denied") {
                                            showTitle = '请前往设置页开启相册使用权限'
                                        } else if (err.errMsg === 'saveVideoToPhotosAlbum:fail cancel') {
                                            showTitle = '取消下载'
                                        }
                                        _that.loadingHidden = false
                                        wx.showToast({
                                            title: showTitle,
                                            icon: 'none',
                                            duration: 3500
                                        })
                                        reject(err);
                                    }
                                })
                            }
					      },
								fail (err) {
			                        _that.loadingHidden = false
									wx.showToast({
										title: '下载失败',
										icon: 'none',
										duration: 3500
									})
									reject(err);
								}
				    	    })
						})
					})).then(results => {
						wx.showToast({
							title: '下载成功',
							icon: '',
							mask: true,
							duration: 1500
						})
					}).finally(()=>{
            _that.loadingHidden = false
					})
			  },
        handleChange(e) {
            this.checkbox = e.mp.detail.value.length > 0;
        },
        loadMore() {
            this.pageNum += 1;
            this.fetchPageList();
        },
        handleUpdate({data, key, value}) {
            let index = this.list.indexOf(data);
            if (index !== -1) {
                this.list[index][key] = value;
            }
        },
        handleNavigate({id}) {
        },
        showComment(item) {
            if (this.userInfo.roleCd === 'RL_YK') {
                return;
            }
            this.selectItem = item;
            this.showInput = true;
        },
        inputBlur() {
            this.showInput = false;
        },
        handleStop() {},
        handleLike(id, item, type) {
            if (item.likeFlag === 'Y') {
                item.likeFlag = 'N';
                !isNaN(+item.likeNum) && item.likeNum--;
            } else {
                item.likeFlag = 'Y';
                this.at_play()
                if (!isNaN(+item.likeNum)) {
                    if (+item.likeNum === 9999) {
                        item.likeNum = '1万'
                    } else {
                        item.likeNum++;
                    }
                }
            }
            request({
                ...LIKES,
                method: item.likeFlag === 'Y' ? 'POST' : 'DELETE',
                data: {
                    worksId: id,
                    likeObjId: item.id,
                    likeObjType: type
                }
            })
            return false;
        },
        handleComment(e) {
            if (!e.mp.detail.value.trim()) {
                return;
            }
            let data = {
                worksId: this.selectItem.id,
                objId: this.selectItem.id,
                objType: 'works',
                commentMsg: e.mp.detail.value,
            }
            request({
                ...ADD_COMMENTS,
                data
            }).then(res => {
                if (!isNaN(+this.selectItem.commentNum)) {
                    if (+this.selectItem.commentNum === 9999) {
                        this.selectItem.commentNum = '1万'
                    } else {
                        this.selectItem.commentNum++;
                    }
                }
                this.selectItem.commentList.push({
                    likeFlag: 'N',
                    fullName: res.fullName,
                    commentMsg: res.commentMsg,
                    id: res.id,
                    likeNum: 0
                })
                this.selectItem = null;
            })
        },
        handlePreview(item, Id, list, img) {
            this.handleBrowse(Id, item)
            let urls = list.map(item => {
                return fileUrl + item.objId
            })
            wx.previewImage({
                urls,
                current: fileUrl + img.objId
            })
            return false;
        },
        handleDetail(item) {
            this.handleBrowse(item.id, item)
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
        handeEnd(e) {
            let video = wx.createVideoContext(e.mp.target.id);
            video.exitFullScreen();
        },
        handleBrowse(id, item) {
            request({
                ...BROWSE,
                method: 'POST',
                data: {
                    worksId: id
                }
            }).then(res => {
                res.pvAdd && item.pvNum++
            }).catch(err => {
                wx.showToast({
                    title: err.msg,
                    icon: 'none'
                });
            })
        },
        handePlay(item, e) {
            this.handleBrowse(e.currentTarget.id, item)
            if (this.video && this.videoId !== e.mp.target.id) {
                this.video.pause();
            }
            this.video = wx.createVideoContext(e.mp.target.id);
            this.videoId = e.mp.target.id;
        },
        showAort() {
            wx.showActionSheet({
                itemList: ['默认排序', '点赞从多到少'],
                success: res => {
                    let arr = ['date', 'like'];
                    this.orderBy = arr[res.tapIndex];
                    this.pageNum = 1;
                    this.list = [];
                    this.fetchPageList();
                },
                fail (res) {
                }
            })
        }
    },
    onPullDownRefresh() {
        this.pageNum = 1;
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
.index {
    font-family: "PingFang SC";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .index-herder {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #fff;
        z-index: 100;
        .index-search {
            position: relative;
            margin: 0 5px 5px 10px;
            img {
                width: 15px;
                height: 15px;
                position: absolute;
                left: 8px;
                top: 9px;
            }
            .icon-sort {
                width: 25px;
                left: auto;
                right: 0;
                top: 8px;
            }
            input {
                font-size: 14px;
                color: #666;
                border-radius: 4px;
                padding: 0 5px 0 25px;
                margin-right: 30px;
                height: 31px;
                line-height: 31px;
                background: #eee;
            }
        }
        &-logo {
            background: rgb(69, 152, 241);
            padding: 5px 0;
            overflow: hidden;
            image {
                display: block;
                width: 200px;
                height: 30px;
                margin: auto;
            }
        }
        &-text {
            font-size: 14px;
            color: rgb(102, 102, 102);
            line-height: 1.5;
            padding: 10px 15px 0;
        }
        &-dep {
            font-size: 10px;
            color: rgb(69, 152, 241);
            line-height: 2;
            text-align: center;
            padding-bottom: 5px;
        }
    }
    .index-end {
        padding: 15px;
        background-color: #fff;
        text-align: center;
    }
    .index-content {
        margin-top: 406rpx;
        overflow: auto;
        &-item {
            padding: 15px;
            border-bottom: 8px solid #eee;
            background-color: #fff;
        }
        .item-user {
            display: flex;
            &-img {
                display: block;
                margin-right: 10px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #eee;
            }
            &-text {
                flex: 1;
                padding: 5px 0;
            }
            &-name {
                font-size: 14px;
                color: rgb(51, 51, 51);
                line-height: 1;
            }
            &-time {
                font-size: 10px;
                color: rgb(203, 203, 203);
                margin-top: 6px;
                line-height: 1;
            }
        }
        .item-info {
            &-title {
                font-size: 16px;
                color: rgb(51, 51, 51);
                line-height: 2;
            }
            &-desc {
                font-size: 13px;
                color: #555;
                line-height: 1.5;
            }
            &-imgs {
                margin: 5px 0;
            }
            &-video {
                margin: 5px 0;
                width: 100%;
            }
            &-img {
                width: 110px;
                height: 110px;
                margin-left: 7.5px;
                background: #eee;
                border-radius: 10px;
                &.no-margin {
                    margin-left: 0;
                }
            }
        }
        .item-position {
            font-size: 11px;
            color: rgb(153, 153, 153);
            line-height: 1;
            position: relative;
            padding-left: 20px;
            &-icon {
                position: absolute;
                left: 0;
                width: 9px;
                height: 11px;
            }
        }
        .item-nums {
            position: relative;
            margin-top: 10px;
            font-size: 13px;
            color: rgb(51, 51, 51);
            text-align: right;
            line-height: 1.5;
            .item-num {
                display: inline-block;
            }
            &-icon {
                vertical-align: bottom;
                width: 20px;
                height: 20px;
            }
            &-num {
                margin-left: 5px;
                display: inline-block;
                text-align: left;
                width: 40px
            }
            &-label {
                font-size: 10px;
                margin-left: -2px;
            }
        }
        .item-comments {
            margin-top: 10px;
            padding-left: 10px;
            font-size: 13px;
            background: #eee;
            overflow: hidden;
            border-radius: 4px;
            color: #666;
            &-more {
                text-align: center;
                color: #18b3e7;
                line-height: 20px;
                font-size: 13px;
                margin-bottom: 5px;
            }
        }
        .item-comment {
            display: flex;
            margin: 5px 0;
        }
        .item-comment-content {
            flex: 1;
        }  
        .item-comment-like {
            padding-top: 2px;
            font-size: 13px;
            line-height: 1;
            margin-left: 5px;
            img {
                vertical-align: top;
                width: 15px;
                height: 15px;
            }
            .item-nums-num {
                display: inline-block;
                width: 40x;
            }
        } 
        
    }
    .index-input {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px;
        background: #fff;
        input {
            border: 1px solid #aaa;
            border-radius: 4px;
            padding: 5px 10px;
        }
    }
    .index-no-content {
        background: #fff;
        font-size: 12px;
        color: #aaa;
        text-align: center;
        height: 100%;
        line-height: 100vh;
    }
    .index-end {
        font-size: 12px;
        line-height: 24px;
        color: #aaa;
        text-align: center;
    }
    .dialog {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px;
        z-index: 1000;
    }
    .mask {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px;
        z-index: 999;
        background: #000;
        opacity: 0.3;
    }
    .dialog-body {
        position: fixed;
        padding: 20px;
        top: 30%;
        left: 20px;
        right: 20px;;
        z-index: 1000;
        border-radius: 10px;
        background: #fff;
        .right {
            margin-top: 10px;
            font-size: 12px;
            text-align: right;
        }
        checkbox {
            float: left;
            color: #999;
            font-size: 14px;
            margin-top: 25px;
        }
        button {
            float: right;
            margin-top: 20px;
            width: 70px;
            height: 40px;
            line-height: 40px;
            color: #333;
        }
    }
}

</style>
<style>
    
@keyframes flipInX {
  from {
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    animation-timing-function: ease-in;
    opacity: 0;
  }

  15% {
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    animation-timing-function: ease-in;
    opacity: 1;
  }

  30% {
    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    opacity: 1;
  }

  45% {
    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
    opacity: 1;
  }

  to {
    transform: perspective(400px);
    opacity: 0;
  }
}
.animate {
	z-index: 1000;
	position: fixed;
	top: 0;
	right: 0;
	width: 100%;
	height: 100%;
}
.animate__flipInX {
	z-index: 1000;
	margin: 75% 40% 0;
	width: 150rpx;
	height: 150rpx;
  animation:flipInX 1.5s infinite;
}
</style>
