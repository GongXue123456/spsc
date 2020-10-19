<template>
    <div class="approve" v-if="data">
        <div class="approve-head">
            <img class="approve-head-background" mode="widthFix" src="/static/images/upload-head.png"/>
            <div class="approve-head-title">— 随拍随传 —</div>
            <div class="approve-head-content">优质服务无处不在，当您身边出现优质服务画面、优秀服务故事、服务感人场景时，欢迎您随时拍下来，并上传到这里！我们会根据实际情况，对上传的内容进行整合，通过合适的方式开展适宜的宣传，提升公司服务形象，宣传一线人员的服务精神。</div>
            <div class="approve-head-sponsor">中国移动浙江公司客户服务部</div>
        </div>
        <div class="approve-content">
            <div class="approve-content-item">
                <div class="approve-content-item-lable">发布人姓名</div>
                <div class="approve-content-item-value">{{data.fullName}}</div>
            </div>
            <div class="approve-content-item">
                <div class="approve-content-item-lable">发布人所在部门</div>
                <div class="approve-content-item-value">{{data.organizeName}}</div>
            </div>
            <div class="approve-content-item block">
                <div class="approve-content-item-lable">{{data.worksType === 'video' ? '视频' : '图片'}}</div>
                <div class="approve-content-item-info">
                    <video
                        v-if="data.worksType === 'video'"
                        class="approve-content-item-video"
                        :autoplay="true"
                        :src="fileUrl + data.dtlList[0].objId">
                    </video>
                    <div v-else class="approve-content-item-imgs">
                        <img
                            v-for="(img, imgIndex) in data.dtlList"
                            :key="imgIndex"
                            :src="fileUrl + img.objId"
                            :class="['approve-content-item-img', {'no-margin': imgIndex % 3 === 0}]"
                            mode="aspectFit"
                            @click="handlePreview(data.dtlList, img)">
                    </div>
                </div>
            </div>
            <div class="approve-content-item">
                <div class="approve-content-item-lable">标题</div>
                <div class="approve-content-item-value">{{data.worksName}}</div>
            </div>
            <div class="approve-content-item block">
                <div class="approve-content-item-lable">内容</div>
                <text class="approve-content-item-textarea">{{data.worksDesc}}</text>
            </div>
        </div>
        <div class="approve-btn" v-if="data.worksStatus != 3">
            <span v-if="data.worksStatus == 1" @click="handleApprove('AGREE')">同意</span>
            <span v-if="data.worksStatus == 1" @click="showReject">拒绝</span>
            <span v-if="data.worksStatus == 2 || data.worksStatus == 1 || data.fullName == userInfo.realName" @click="showDelete">删除</span>
        </div>
        <div v-if="showInput" class="approve-mask"></div>
        <div v-if="showInput" class="approve-input">
            <input :cursor-spacing="10" v-model="notes" @blur="inputBlur" @confirm="handleApprove('REJECT')" :focus="true" placeholder="内容" />
        </div>
    </div>
</template>

<script>
    import request from '@/utils/request.js';
    import {WORKS_ID, fileUrl} from '@/utils/api.js';
    import {toast} from '@/utils/bridge';
    import store from '@/utils/store';

    export default {
        data() {
            return {
                id: '',
                data: null,
                notes: '',
                showInput: false,
                fileUrl
            };
        },
        onLoad(option) {
            this.id = option.id
            this.getData();
        },
        computed: {
            userInfo() {
                return store.state.userInfo;
            }
        },
        methods: {
            getData() {
                request({
                    url: '/works/' + this.id,
                    method: 'GET',
                }).then(res => {
                    this.data = res;
                    if (+res.worksStatus !== 1) {
                        toast('该作品已审核');
                    }
                })
            },
            handlePreview(list, img) {
                let urls = list.map(item => {
                    return fileUrl + item.objId
                })
                wx.previewImage({
                    urls,
                    current: fileUrl + img.objId
                })
            },
            handleApprove(operation) {
                request({
                    url: '/works/approve/' + this.id,
                    data: {
                        operation,
                        notes: this.notes
                    },
                    method: 'POST',
                }).then(res => {
                    this.showInput = false;
                    this.notes = '';
                    wx.navigateBack();
                })
            },
            showReject() {
                this.notes = '退回修改';
                this.showInput = true
            },
            inputBlur() {
                this.notes = '';
                this.showInput = false
            },
            showDelete() {
                wx.showModal({
                    title: '提示',
                    content: '确定删除该作品？',
                    success: res => {
                        if (res.confirm) {
                            this.handleApprove('DELETE');
                        }
                    }
                })
            }
        }
    };
</script>
<style lang="less" scoped>
    .approve {
        font-family: "PingFangSC-Regular";
        &-head {
            position: relative;
            padding: 20px 15px;
            color: #fff;
            &-background {
                position: absolute;
                z-index: -1;
                height: 190px;
                width: 100%;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
            }
            &-title {
                margin-bottom: 16px;
                font-size: 20px;
                line-height: 23px;
                text-align: center;
            }
            &-content {
                margin-bottom: 9px;
                font-size: 12px;
                line-height: 23px;
            }
            &-sponsor {
                font-size: 10px;
                text-align: end;
            }
        }
        &-mask {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 10px;
            z-index: 100;
            background: #000;
            opacity: .3;
        }
        &-input {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 10px;
            z-index: 1000;
            background: #fff;
            input {
                border: 1px solid #aaa;
                border-radius: 4px;
                padding: 5px 10px;
            }
        }
        &-content {
            color: #333333;
            font-size: 14px;
            &-item {
                padding: 10px;
                font-size: 16px;
                border-bottom: 1px solid rgb(238, 238, 238);
                display: flex;
                &.block {
                    display: block;
                }
                &-lable {
                    flex: 1;
                    min-width: 150px;
                }
                &-value {
                    color: #999;
                    text-align: right;
                }
                &-info {
                    margin-top: 10px;
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
                &-textarea {
                    display: block;
                    margin-top: 10px;
                    background-color: rgb(242, 242, 242);
                    border-radius: 2px;
                    padding: 10px;
                    font-size: 13px;
                }
            }
        }
        &-btn {
            display: flex;
            padding: 20px;
            span {
                flex: 1;
                margin: 0 10px;
                text-align: center;
                border-radius: 5px;
                line-height: 40px;
                color: #fff;
                background-color: rgb(12, 183, 145);
            }
            span:first-child {
                background-color: rgb(60, 133, 237);
            }
            span:last-child {
                background-color: rgb(239, 172, 42);
            }
        }
        
    }
</style>
