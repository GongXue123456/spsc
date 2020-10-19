<template>
    <div @click="handleLike" class="like" :class="class_name">
        <img
            mode="widthFix"
            :src="iconUrl"
            class="like-icon">
            <span class="like-num">{{data.like_num}}</span>
    </div>

</template>

<script>
import request from '@/utils/request.js';
import {LIKE, CANCEL_LIKE} from '@/utils/api.js';
import {toast} from '@/utils/bridge';
export default {
    props: {
        data: Object,
        class_name: String,
        icon: String,
        likedIcon: String
    },
    data() {
        return {
            isLike: this.data.is_like === 'Y',
            num: this.data.like_num
        }
    },
    computed: {
        iconUrl() {
            return this.data.is_like === 'Y' ? this.likedIcon : this.icon;
        }
    },
    methods: {
//        handleLike() {
//            let url = this.isLike ? CANCEL_LIKE : LIKE;
//            request({
//                ...url,
//                data: {
//                    activityId: this.data.activity_id,
//                    workId: this.data.id
//                }
//            }).then(res => {
//                if (this.isLike) {
//                    this.isLike = false;
//                    this.num--;
//                } else {
//                    this.isLike = true;
//                    this.num++;
//                }
//            });
//        }

        handleLike() {
            if(this.data.is_like != 'Y'){
                let url = LIKE;
                request({
                    ...url,
                    data: {
                        activityId: this.data.activity_id,
                        workId: this.data.id
                    }
                }).then(res => {
                    this.data.is_like = 'Y';
                    this.data.like_num++;
                });
            }
        }
    }
};
</script>

<style lang="less" scope>
.like {
    &-icon {
        vertical-align: top;
        width: 12px;
        height: 12px;
        margin-top: 3px;
        margin-right: 10px;
    }
    &-num {
        font-family: "PingFangSC-Regular";
        font-size: 14px;
        line-height: 18px;
        color: #666;
        vertical-align: top;
    }
}
</style>
