<template>
    <div class="activity-item">
        <div @click="toDetail" class="activity-item-img">
            <img mode="widthFix" :src="data.activity_imgurl">
            <div class="activity-item-img-end" v-if="data.status === 'END'">
                <img mode="widthFix" src="/static/images/end-activity.png">
            </div>
        </div>
        <div class="activity-item-content">
            <div @click="toDetail">
            <div class="activity-item-title">{{data.activity_name}}</div>
            <div class="activity-item-time">
                活动时间：{{beginTime}} 至 {{endTime}}
            </div>
            </div>
            <div class="activity-item-desc">{{data.activity_desc}}</div>
            <div class="activity-item-tip" v-if="source==='detail' && data.status==='ON'">
                {{data.issignup === "Y" ? '请上传照片' : '您还没有打卡哦!'}}
            </div>
            <template v-if="data.status==='ON'">
                <div

                    class="activity-item-btn"
                    v-if="source==='list' || data.issignup==='N'">
                    <div v-if="data.issignup==='N'">

                        <div @click="handleSign"> 打卡</div>
                    </div>
                    <div v-if="data.issignup==='Y'">

                        <div @click="handleRelease"> 发布</div>
                    </div>


                </div>
                <div
                    @click="handleRelease"
                    v-if="source==='detail' && data.issignup==='Y'"
                    class="activity-item-btn">

                    <img src="/static/images/camera.png">
                </div>
            </template>
            <div class="activity-item-num">
                <div class="activity-item-num-sign">{{data.signup_num}}人打卡</div>
                <div
                    v-if="data.head_imgurls && data.head_imgurls.length"
                    :class="'activity-item-num-img-' + data.head_imgurls.length" >
                    <img
                        v-for="item in data.head_imgurls"
                        :key="item.head_imgurl"
                        :src="item.head_imgurl">
                </div>
                <div class="activity-item-num-join">{{data.joinin_num}}人参与</div>
            </div>
        </div>

    </div>
</template>

<script>
import {formatTime} from '@/utils/index.js';
import {SIGN} from '@/utils/api';
import request from '@/utils/request';
import {toast} from '@/utils/bridge';
export default {
    props: ['data', 'source'],
    computed: {
        beginTime() {
            return this.data.begin_time.substring(0, 10);
        },
        endTime() {
            return this.data.end_time.substring(0, 10);
        }
    },
    methods: {
        handleSign() {
            if (this.data.issignup === 'Y') {
                return;
            }
            request({
                ...SIGN,
                data: {
                    activityId: this.data.id
                }
            }).then(res => {
                toast({
                    title: '打卡成功',
                    icon: 'success'
                });
                this.$emit('update', {
                    data: this.data,
                    key: 'issignup',
                    value: 'Y'
                });
                this.$emit('update', {
                    data: this.data,
                    key: 'signup_num',
                    value: this.data.signup_num + 1
                });
            });
        },
        toDetail() {
            this.$emit('navigate');
        },
        handleRelease() {

            wx.navigateTo({
                url: `/pages/detail-release/main?id=${this.data.id}&name=${this.data.activity_name}`
            });
        }
    }
};
</script>

<style lang="less" scope>
.activity-item {
    background-color: #fff;
    font-family: "PingFangSC-Regular";
    &-img {
        position: relative;
        img {
            width: 100%;
            vertical-align: middle;
        }
        &-end {
            position: absolute;
            z-index: 10;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: rgba(0, 0, 0, .5);
            img {
                position: absolute;
                height: 92px;
                width: 120px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
    &-content {
        font-family: "PingFangSC-Medium";
        padding: 15px;
    }
    &-title {
        font-size: 16px;
        line-height: 1;
        color: #333;
    }
    &-time {
        font-size: 14px;
        line-height: 1;
        margin-top: 10px;
        color: #333;
    }
    &-desc {
        margin-top: 6px;
        padding-bottom: 10px;
        font-size: 14px;
        line-height: 22px;
        color: #999;
    }
    &-tip {
        font-size: 14px;
        line-height: 1;
        margin-bottom: 20px;
        text-align: center;
        color: #00b5ff;
    }
    &-btn {
        width: 75px;
        height: 75px;
        margin: 0 auto;
        border-radius: 50%;
        font-size: 18px;
        color: #fff;
        line-height: 75px;
        text-align: center;
        background: #3eb4fb;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
            display: block;
            width: 35px;
            height: 30px;
        }
    }
    &-num {
        margin-top: 15px;
        display: flex;
        font-size: 12px;
        color: #999;
        line-height: 25px;
        &-sign,
        &-join {
            margin-right: 10px;
        }
        &-img-1,
        &-img-2,
        &-img-3,
        &-img-4,
        &-img-5,
        &-img-6{
            img {
                position: relative;
                width: 25px;
                height: 25px;
                border-radius: 50%;
                border: 1.5px solid #fff;
                vertical-align: middle;
                &:nth-child(1) {
                    left: 0;
                    z-index: 3;
                }
                &:nth-child(2) {
                    left: -5px;
                    z-index: 2;
                }
                &:nth-child(3) {
                    left: -10px;
                    z-index: 1;
                }
                &:nth-child(4) {
                    left: -15px;
                    z-index: 1;
                }
                &:nth-child(5) {
                    left: -20px;
                    z-index: 1;
                }
                &:nth-child(6) {
                    left: -25px;
                    z-index: 1;
                }
            }
        }
        &-img-1 {
            margin-right: 10px;
        }
        &-img-2 {
            margin-right: 5px;
        }
    }
}
</style>
