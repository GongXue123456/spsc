<template>
    <div class="detail">
        <swiper v-if="data.worksType === 'picture'">
            <swiper-item
                class="swiper-item"
                v-for="(img, imgIndex) in data.dtlList"
                :key="imgIndex"
            >
                <img v-if="!finishLoadFlag" mode="aspectFit" :src="fileUrl + img.objId3"/>
                <img mode="aspectFit" @load='finishLoad' @error='finishError' :src="fileUrl + img.objId" />
            </swiper-item>
        </swiper>
        <div v-show="upShow" class="animate">
            <img src="/static/images/up-click.png" class="animate__flipInX" style="">
        </div>
        <div class="detail-video" v-if="data.worksType === 'video' && data.dtlList.length">
            <video
                :controls="false"
                :loop="true"
                :autoplay="true"
                :src="fileUrl + data.dtlList[0].objId">
            </video>
        </div>
        <div :style="{'transform': showInput ? 'translateY(0)' : 'translateY(100%)'}" class="detail-comment">
            <div v-if="commentList.length" class="detail-comment-title">
                {{commentList.length}}条评论
            </div>
            <div class="detail-colse" @click="showInput = false">
                <img src="/static/images/close.png"/>
            </div>
            <div class="detail-comment-content">
                <div v-for="item in commentList" :key="item.id" class="item-comment">
                    <div class="item-comment-content">
                        <span>{{item.fullName}}：</span>
                        <span>{{item.commentMsg}}</span>
                    </div>
                    <div class="item-comment-like" @click="handleLike(data.id, item, 'comment')">
                        <img v-if="item.likeFlag == 'Y'" class="item-nums-icon" src="/static/images/up-click.png">
                        <img v-else class="item-nums-icon" src="/static/images/up.png">
                        <span class="item-nums-num">
                            {{item.likeNum}}
                            <span class="item-nums-label">{{item.likeNumLable}}</span>
                        </span>
                    </div>
                </div>
                <div v-if="commentList.length === 0" class="item-blank">
                    暂无评论
                </div>
            </div>
            <input v-model="inputValue" :cursor-spacing="10" @confirm="handleComment" placeholder="评论" />
        </div>
        <div :style="{'transform': !showInput ? 'translateY(0)' : 'translateY(100%)'}" class="detail-content">
            <div class="detail-content-user">
                <img class="detail-content-img" mode="widthFix" :src="data.userPic">
                <div class="detail-content-text">
                    <div class="detail-content-name">{{data.fullName}}</div>
                    <div class="detail-content-time">{{data.agreeDate}}</div>
                </div>
                <div v-if="data.worksStatus==2" class="detail-content-oper">
                    <span class="item-num comment" v-if="userInfo.roleCd != 'RL_YK'" @click.stop="showComment(item)">
                        <img class="item-nums-icon" src="/static/images/comment.png">
                        <span class="num">
                            {{commentNum}}
                            <span class="item-nums-label">{{commentNumLable}}</span>
                        </span>
                    </span>
                    <span class="item-num like" @click.stop="handleLike(data.id, data, 'works')">
                        <img v-if="likeFlag === 'N'" class="item-nums-icon" src="/static/images/up.png">
                        <img v-else class="item-nums-icon" src="/static/images/up-click.png">
                        <span class="num">
                            {{likeNum}}
                            <span class="item-nums-label">{{likeNumLable}}</span>
                        </span>
                    </span>
                    <span class="item-num save" @click.stop="handleShare">
                        <img class="item-nums-icon" src="/static/images/image.png">
                    </span>
                    <span class="item-num share">
                        <button
                            type="button"
                            plain
                            lang="zh_CN"
                            open-type="share"
                            class="submit-btn auth-btn"
                            >
                            <img class="item-nums-icon" src="/static/images/share.png">
                        </button>
                    </span>
                </div>
            </div>
            <div class="detail-content-info">
                <div class="detail-content-title">{{data.worksNo}} _ {{data.worksName}}</div>
                <text class="detail-content-desc">{{data.worksDesc}}</text>
            </div>
        </div>
    </div>
</template>

<script>
import { showFormatTime, showFormatNum } from '@/utils/index';
import request from '@/utils/request.js';
import { WORKS_ID, fileUrl, ADD_COMMENTS, LIKES, BROWSE } from '@/utils/api.js';
import store from '@/utils/store';

export default {
    data() {
        return {
            id: '',
            commentList: [],
            likeNum: 0,
            commentNum: 0,
            commentNumLable: '',
            likeNumLable: '',
            likeFlag: 'N',
            data: {
            },
            upShow: false,
            inputValue: '',
            showInput: false,
            fileUrl,
            eventChannel: null,
            finishLoadFlag: false
        };
    },
    computed: {
        userInfo() {
            return store.state.userInfo;
        }
    },
    onShow() {
        if (this.id) {
            this.getData();
            this.handleBrowse(this.id)
        }
    },
    onLoad(option) {
        this.showInput = false;
        this.inputValue = '';
        this.id = '';
        if (option.id) {
            this.id = option.id;
        }
        if (option.scene) {
            this.id = option.scene;
        }
        this.eventChannel = this.$mp.page.getOpenerEventChannel();
    },
    methods: {
        getData() {
            request({
                url: '/works/' + this.id,
                needLogin: true,
                method: 'GET',
            }).then(res => {
                res.agreeDate = showFormatTime(res.agreeDate || res.insertDate);
                this.data = res;
                this.id = res.id;
                this.likeNum = showFormatNum(res.likeNum);
                if (this.likeNum.indexOf('万') !== -1) {
                    this.likeNum = this.likeNum.replace('万', '');
                    this.likeNumLable = '万';
                }
                this.commentNum = showFormatNum(res.commentNum);
                if (this.commentNum.indexOf('万') !== -1) {
                    this.commentNum = this.commentNum.replace('万', '');
                    this.commentNumLable = '万';
                }
                this.likeFlag = res.likeFlag;
                this.commentList = res.commentList.map(comment => {
                    comment.likeNum = showFormatNum(comment.likeNum);
                    if (comment.likeNum.indexOf('万') !== -1) {
                        comment.likeNum = comment.likeNum.replace('万', '');
                        comment.likeNumLable = '万';
                    }
                    return comment;
                });
                
            })
        },
        at_play() {
            //动画开始
            this.upShow = true
            setTimeout(() => {
                this.upShow = false
            }, 1500)
        },
        handleBrowse(id) {
            request({
                ...BROWSE,
                method: 'POST',
                data: {
                    worksId: id
                }
            }).catch(err => {
                wx.showToast({
                    title: err.msg,
                    icon: 'none'
                });
            })
        },
        showComment(item) {
            this.selectItem = item;
            this.showInput = true;
        },
        handleLike(id, comment, type) {
            if (type === 'works') {
                comment = this;
            }
            if (comment.likeFlag === 'Y') {
                comment.likeFlag = 'N';
                !isNaN(+comment.likeNum) && comment.likeNum--;
            } else {
                comment.likeFlag = 'Y';
                this.at_play()
                if (!isNaN(+comment.likeNum)) {
                    if (+comment.likeNum === 9999) {
                        comment.likeNum = '1万'
                    } else {
                        comment.likeNum++;
                    }
                }
            }
            request({
                ...LIKES,
                method: comment.likeFlag === 'Y' ? 'POST' : 'DELETE',
                data: {
                    worksId: id,
                    likeObjId: type === 'works' ? id : comment.id,
                    likeObjType: type
                }
            }).then(res => {
                this.eventChannel.emit && this.eventChannel.emit('updateDetail', {
                    likeFlag: this.likeFlag,
                    likeNum: this.likeNum,
                    commentList: this.commentList
                })
            })
        },
        finishLoad(e) {
            this.finishLoadFlag = true
        },
        finishError() {
            this.finishLoadFlag = false
        },
        handleShare() {
            wx.navigateTo({
                url: `/pages/share/main?id=${this.id}&userPic=${this.data.userPic}&fullName=${this.data.fullName}&worksName=${this.data.worksName}&agreeDate=${this.data.agreeDate}`
            });
        },
        handleComment(e) {
            if (!this.inputValue.trim()) {
                return;
            }
            let data = {
                worksId: this.data.id,
                objId: this.data.id,
                objType: 'works',
                commentMsg: this.inputValue.trim(),
            }
            request({
                ...ADD_COMMENTS,
                data
            }).then(res => {
                if (!isNaN(+this.commentNum)) {
                    if (+this.commentNum === 9999) {
                        this.commentNum = '1万'
                    } else {
                        this.commentNum++;
                    }
                }
                this.inputValue = ''
                this.commentList.push({
                    likeFlag: 'N',
                    fullName: res.fullName,
                    commentMsg: res.commentMsg,
                    id: res.id,
                    likeNum: 0
                })
                this.eventChannel.emit && this.eventChannel.emit('updateDetail', {
                    commentNum: this.commentNum,
                    commentList: this.commentList
                })
            })
        }
    }
};
</script>
<style lang="less" scoped>
.detail {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    swiper {
        height: 100%;
    }
    swiper-item {
        height: 100%;
        background: #000;
        opacity: 0.8;
        img {
            background: #000;
            height: 100%;
            width: 100%;
        }
    }
    .detail-video {
        height: 100%;
        background: #000;
        opacity: 0.8;
        video {
            height: 100%;
            width: 100%;
        }
    }
    .item-nums-label {
        font-size: 10px;
        margin-left: -2px;
    }
    .detail-comment {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: #000;
        color: #fff;
        padding: 40px 10px 0 20px;
        z-index: 100;
        max-height: 300px;
        display: flex;
        flex-direction: column;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        transition: transform .3s;
        .detail-comment-title {
            position: absolute;
            top: 0;
            left: 0;
            padding: 10px 15px;
            color: #999;
        }
        .detail-colse {
            position: absolute;
            right: 0;
            top: 0;
            padding: 10px 15px;
            img {
                width: 12px;
                height: 12px;
            }
        }
        .detail-comment-content {
            flex: 1;
            overflow: auto;
        }
        .item-blank {
            text-align: center;
            line-height: 30px;
            font-size: 14px;
        }
        .item-comment {
            display: flex;
            margin: 5px 0;
        }
        .item-comment-content {
            flex: 1;
        }  
        
        .item-comment-like {
            font-size: 13px;
            height: 22px;
            padding-left: 10px;
            line-height: 22px;
            img {
                margin-top: 6px;
                width: 13px;
                height: 13px;
                margin-right: 10px;
            }
            .item-nums-num {
                display: inline-block;
                width: 40px;
            }
        } 
        input {
            margin: 10px 0;
        }
    }
    .detail-content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .7);
        color: #fff;
        padding: 20px 10px 20px 20px;
        transition: transform .3s;
        &-user {
            display: flex;
        }
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
            line-height: 1;
        }
        &-time {
            font-size: 10px;
            margin-top: 6px;
            line-height: 1;
        }
        &-oper {
            float: right;
            .save {
                img {
                    transform: translateY(1px);
                    margin: 0 15px 0 5px;
                }
            }
            .share {
                float: right;
                button {
                   width: 40px;
                   height: 40px;
                   line-height: 40px;
                   padding: 0;
                   border: 0;
                   img {
                       transform: translateY(-4px);
                       width: 28px;
                       height: 28px;
                       margin-left: 0;
                       margin-top: 1px;
                   }
                }
            }
            img {
                width: 20px;
                height: 20px;
                margin: 0 15px;
            }
            .item-num {
                position: relative;
                .num {
                    position: absolute;
                    display: block;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    text-align: center;
                    transform: translateY(100%)
                }
            }
            .comment {
                img {
                    transform: translateY(2px)
                }
            }
        }
        &-title {
            font-size: 16px;
            line-height: 2;
        }
        &-desc {
            font-size: 12px;
            line-height: 1.5;
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
