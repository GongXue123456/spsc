<template>
    <div>
        <canvas class="share" canvas-id="share"></canvas>
        <div class="share-btn" @click="handleSave" v-if="codeUrl">
            保存
        </div>
    </div>
</template>

<script>
import { showFormatTime, showFormatNum } from '@/utils/index';
import { toast } from '@/utils/bridge.js';
import request from '@/utils/request.js';
import { WORKS_ID, fileUrl, ADD_COMMENTS, LIKES } from '@/utils/api.js';
import store from '@/utils/store';

export default {
    data() {
        return {
            id: '',
            data: {},
            codeUrl: ''
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
        }
    },
    onLoad(option) {
        this.id = '';
        if (option.id) {
            this.id = option.id;
            this.data = option;
        }
    },
    methods: {
        getData() {
            request({
                url: '/qrcode',
                needLogin: true,
                method: 'POST',
                data: {
                    page: 'pages/detail/main',
                    id: this.id
                }
            }).then(res => {
                this.codeUrl = res.qrCode;
                wx.getImageInfo({
                    src: res.qrCode + '?time=' + Date.now(),
                    success: res => {
                        this.draw(res);
                    }
                })
            })
        },
        handleSave() {
            wx.canvasToTempFilePath({
                canvasId: 'share',
                success: res => {
                    toast('保存成功，长按图片下载或者分享图片');
                    setTimeout(() => {
                        wx.previewImage({
                            current: res.tempFilePath,
                            urls: [res.tempFilePath]
                        });
                    }, 500)
                    
                }
            })
        },
        lineShow(ctx, text) {
            const width = wx.getSystemInfoSync().windowWidth;
            const ratio = width / 350;
            const chr = text.split('');
            const row = [];
            let temp = '';
            for (let i = 0; i < chr.length; i++) {
                if (ctx.measureText(temp).width < width - 40 * ratio) {
                    temp += chr[i];
                } else {
                    temp += chr[i];
                    row.push(temp);
                    temp = '';
                }
            }
            temp && row.push(temp);
            return row;
        },
        draw(qrCode) {
            const ctx = wx.createCanvasContext('share');
            const width = wx.getSystemInfoSync().windowWidth;
            const ratio = width / 350;
            ctx.drawImage('/static/images/upload-head.png', 0, 0, width, 190 * ratio);
            ctx.setTextAlign('center');
            ctx.setFillStyle('#ffffff');
            ctx.setFontSize(20 * ratio);
            ctx.fillText("— 随拍随传 —", width / 2, 40 * ratio);
            ctx.setTextAlign('left');
            ctx.setFontSize(12 * ratio);
            const text = '优质服务无处不在，当您身边出现优质服务画面、优秀服务故事、服务感人场景时，欢迎您随时拍下来，并上传到这里！我们会根据实际情况，对上传的内容进行整合，通过合适的方式开展适宜的宣传，提升公司服务形象，宣传一线人员的服务精神。';
            let row = this.lineShow(ctx, text);
            row.forEach((item, index) => {
                ctx.fillText(item, 15 * ratio, (70 + index * 22) * ratio);
            })
            ctx.setTextAlign('right');
            ctx.setFontSize(10 * ratio)
            ctx.fillText("中国移动浙江公司客户服务部", width - 15 * ratio, 170 * ratio)
            ctx.setTextAlign('left');
            ctx.setFontSize(14 * ratio);
            ctx.setFillStyle('#000000');
            row = this.lineShow(ctx, this.data.worksName);
            row.forEach((item, index) => {
                ctx.fillText(item, 20 * ratio, (220 + index * 25) * ratio);
            })
            const qrImgSize = 150 * ratio;
            ctx.drawImage(qrCode.path, (width - qrImgSize) / 2, 250 * ratio, qrImgSize, qrImgSize)
            ctx.draw();
        }
    }
};
</script>
<style lang="less" scoped>
.share {
    width: 100%;
    height: 450px;
    background: #fff;
    // &-head {
    //     position: relative;
    //     padding: 20px 15px;
    //     color: #fff;
    //     &-background {
    //         position: absolute;
    //         z-index: -1;
    //         height: 190px;
    //         width: 100%;
    //         top: 0;
    //         left: 0;
    //         right: 0;
    //         bottom: 0;
    //     }
    //     &-title {
    //         margin-bottom: 16px;
    //         font-size: 20px;
    //         line-height: 23px;
    //         text-align: center;
    //     }
    //     &-content {
    //         margin-bottom: 9px;
    //         font-size: 12px;
    //         line-height: 23px;
    //     }
    //     &-sponsor {
    //         font-size: 10px;
    //         text-align: end;
    //     }
    // }
    // .share-title {
    //     display: flex;
    //     padding: 10px 20px;
    //     &-img {
    //         display: block;
    //         margin-right: 10px;
    //         width: 40px;
    //         height: 40px;
    //         border-radius: 50%;
    //         background: #eee;
    //     }
    //     &-text {
    //         flex: 1;
    //         padding: 5px 0;
    //     }
    //     &-name {
    //         font-size: 14px;
    //         line-height: 1;
    //     }
    //     &-time {
    //         font-size: 10px;
    //         margin-top: 6px;
    //         line-height: 1;
    //     }
    // }
    // .share-content {
    //     padding: 0 20px;
    //     &-title {
    //         font-size: 16px;
    //         color: rgb(51, 51, 51);
    //         line-height: 2;
    //     }
    //     &-desc {
    //         display: block;
    //         font-size: 12px;
    //         color: rgb(153, 153, 153);
    //         line-height: 1.5;
    //     }
        
    // }
    // .share-qrcode {
    //     margin-top: 20px;
    //     text-align: center;
    //     img {
    //         width: 150px;
    //         height: 150px;
    //     }
    // }
    &-btn {
        width: 345px;
        margin-left: 15px;
        text-align: center;
        height: 44px;
        background-color: #09bb07;
        border-radius: 5px;
        font-family: PingFangSC-Regular;
        font-size: 18px;
        line-height: 44px;
        color: #fff;
    }
}
</style>
