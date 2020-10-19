<template>
    <div class="work-item">
        <div class="work-item-title">
            <div class="work-item-title-img">
                <img mode="widthFix" :src="data.head_imgurl">

            </div>
            <div class="work-item-title-text">
                <div class="work-item-title-author">{{data.fullname}}</div>
                <div v-if="show_time" class="work-item-title-time">{{data.time_desc}}</div>
            </div>
            <div class="work-item-title-icon">
                <img
                    v-if="index===0"
                    class="first"
                    mode="heightFix"
                    src="/static/images/first.png">
                <img
                    v-if="index===1"
                    class="second"
                    mode="heightFix"
                    src="/static/images/second.png">
                <img
                    v-if="index===2"
                    class="third"
                    mode="heightFix"
                    src="/static/images/third.png">
            </div>
            <like
                icon="/static/images/like.png"
                likedIcon="/static/images/selected.png"
                class_name="work-item-content-num"
                :data="data">
            </like>
        </div>
        <div class="work-item-img">
            <img v-if="data.type==='image'" @click="previewImage($event)" :data-url="data.work_media1" mode="aspectFill" :src="data.work_media1" class="">
            <img v-if="data.work_media2" @click="previewImage($event)" :data-url="data.work_media2" mode="aspectFill" :src="data.work_media2" class="">
            <img v-if="data.work_media3" @click="previewImage($event)" :data-url="data.work_media3" mode="aspectFill" :src="data.work_media3" class="">
            <video v-if="data.type==='video'" mode="widthFix" :src="data.work_media1" style="width: 100%;"></video>
        </div>
        <div class="work-item-content">
            <div v-if="data.work_title" class="work-item-title-author" style="color: #000;">{{data.work_title}}</div>
            <div class="work-item-content-desc">{{data.work_desc}}</div>
        </div>
    </div>
</template>

<script>
import like from '@/components/like';
export default {
    props: {
        data: Object,
        index: Number,
        'show_time': {
            type: Boolean,
            default: true
        }
    },
    components: {
        like
    },
    methods: {
        previewImage(e) {
            var urls = [];
            urls.push(this.data.work_media1);
            if(this.data.work_media2){
                urls.push(this.data.work_media2);
            }
            if(this.data.work_media3){
                urls.push(this.data.work_media3);
            }
            wx.previewImage({
                current: e.currentTarget.dataset.url, // 当前显示图片的http链接
                urls: urls // 需要预览的图片http链接列表
            })
//            this.$emit('previewImage', e.currentTarget.dataset.url);
        }
    }
};
</script>

<style lang="less" scope>
.work-item {
    padding-bottom: 14px;
    background: #fff;
    font-family: "PingFangSC-Regular";
    &-title {
        display: flex;
        align-items:center;
        padding-bottom: 5px;
        &-img {
            margin-right: 10px;
            img {
                border-radius: 50%;
                width: 40px;
                height: 40px;
                vertical-align: middle;
            }

        }
        &-author {
            font-size: 15px;
            line-height: 22px;
        }
        &-time {
            font-size: 12px;
            color: #999;
        }
        &-icon {
            margin-left: 15px;
            img {
                width: 16.5px;
                height: 22px;
                vertical-align: top;
            }
        }
    }
    &-img {
        padding: 0 15px;
        img {
            width: 105px;
            height: 105px;
            margin-right: 15px;
            &:nth-child(3n) {
                margin-right: 0;
            }
        }

    }
    &-content {
        padding: 5px 15px;
        font-size: 12px;
        color: #999;
        &-desc {
            font-size: 12px;
            line-height: 18px;
            color: #999;
        }
        &-num {
            padding-top: 6px;
        }
    }
}
</style>
