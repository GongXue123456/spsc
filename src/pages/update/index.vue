<template>
    <div class="upload" v-if="userInfo.roleCd !== 'RL_YK'">
        <div class="upload-head">
            <img class="upload-head-background" mode="widthFix" src="/static/images/upload-head.png"/>
            <div class="upload-head-title">— 随拍随传 —</div>
            <div class="upload-head-content">优质服务无处不在，当您身边出现优质服务画面、优秀服务故事、服务感人场景时，欢迎您随时拍下来，并上传到这里！我们会根据实际情况，对上传的内容进行整合，通过合适的方式开展适宜的宣传，提升公司服务形象，宣传一线人员的服务精神。</div>
            <div class="upload-head-sponsor">中国移动浙江公司客户服务部</div>
        </div>
        <div class="upload-content">
            <div class="upload-content-title flex-between">
                <div class="upload-content-request">请填写标题</div>
                <div class="upload-content-title-content">
                    <input type="text" v-model="uploadTitle"></div>
            </div>
            <div class="upload-content-type flex-between">
                <div class="upload-content-request">请选择类型</div>
                <div class="upload-content-type-content flex-between">
                    <div class="upload-content-type-content-click" @click="typeChoose('first')"><img :src="uploadChoose === 'first' ? '/static/images/clicked.png' : '/static/images/click.png'"><span :style="{color: uploadChoose === 'first' ? '#4598f1' : '#999999'}"> 视频</span></div>
                    <div class="upload-content-type-content-click" @click="typeChoose('second')"><img :src="uploadChoose === 'second' ? '/static/images/clicked.png' : '/static/images/click.png'"><span :style="{color: uploadChoose === 'second' ? '#4598f1' : '#999999'}"> 图片</span></div>
                </div>
            </div>
            <div class="upload-content-describe">
                <div class="upload-content-request">请添加描述</div>
                <div class="upload-content-describe-input">
                    <textarea :maxlength="150" v-model="uploadDesc"></textarea>
                </div>
            </div>
            <div class="upload-content-position flex-between">
                <div class="upload-content-request">添加位置</div>
                <button v-if="showToSetting" @tap="openSetting">去设置页</button>
                <div v-if="!showToSetting" class="upload-content-position-content flex-start" @click="handlechooseLocation">
                    <div v-if="!uploadLocation.name">点击选择位置 </div>
                    <div class="text-overflow-1" v-else>{{uploadLocation.name}} </div>
                    <img src="/static/images/position.png">
                </div>
            </div>
            <div class="upload-content-uploading flex-between">
                <div class="upload-content-request">请上传文件</div>
                <div v-if="uploadChoose === 'first' && !uploadVideo" @click="handleChooseMedia" class="upload-content-uploading-content">
                    <span>上传</span>
                </div>
            </div>
            <div class="upload-content-uploading-list" :style="{minHeight: uploadChoose === 'second' ? '260rpx' : ''}">
                <div v-if="uploadChoose !== 'first'">
                    <moveImg :type="uploadChoose" @listChange='handleListChange' :changeUploadImage='changeUploadImage' :imgSize="imgSize"></moveImg>
                </div>
                <div v-if="uploadChoose === 'first' && uploadVideo">
                    <img src="/static/images/blue-delete.png" @click="deleteMedia($event)">
                    <div class="upload-video" v-if="uploadVideo !== ''">
                        <video
                            :auto="false"
                            :show-fullscreen-btn="false"
                            mode="aspectFill"
                            :src="uploadVideo.httpUrl + uploadVideo.objId"
                        >
                        </video>
                    </div>
                </div>
            </div>
            <div class="flex-between upload-content-size">
                <div class="upload-content-request">文件大小</div>
                <div class="upload-content-size-content">{{size !== 0 ? size : ''}}</div>
            </div>
        </div>
        <div class="upload-btn">
            <button type="button" @click="handleRelease">提交</button>
        </div>
    </div>
</template>

<script>
    import moveImg from '@/components/moveImg';
    import {chooseVideo, toast, chooseLocation} from '@/utils/bridge.js';
    import request, {uploadFile} from '@/utils/request.js';
    import {UPLOAD_FILES, SUBMIT_WORK, getVideo, fileUrl} from '@/utils/api.js';
    import store from '@/utils/store';

    export default {
        components: {
            moveImg
        },
        data() {
            return {
                loading: false,
                uploadTitle: '',
                uploadDesc: '',
                uploadImage: [],
                uploadVideo: '',
                fileUrl,
                uploadLocation: {},
                showToSetting: false,
                size: '',
                imgSize: 0,
                videoSize: 0,
                selectedActivity: null,
                uploadChoose: 'first',
                changeUploadImage: []
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
            }
        },
        computed: {
            userInfo() {
                return store.state.userInfo;
            }
        },
        watch: {
            size() {
                if (this.size) {
                    if (this.size < 1024) {
                        this.size = (this.size).toFixed(0) + 'B';
                    } else if (this.size >= 1024 && this.size < 1048576 ){
                        this.size = (this.size / 1024).toFixed(0)+ 'KB';
                    } else if (this.size >= 1048576 ){
                        this.size = (this.size / 1048576).toFixed(0) + 'M';
                    }
                }
            }
        },
        methods: {
            handleChooseMedia() {
                if (this.uploadChoose === 'first') {
                    chooseVideo().then(res => {
                        this.videoSize = res.size;
                        this.size = this.videoSize
                        if (res.size > 52428800) {
                            wx.showToast({
                                title: '上传文件的大小不能超过50M',
                                icon: 'none',
                                duration: 2000
                            });
                            return;
                        }
                        uploadFile({
                            ...UPLOAD_FILES,
                            'filePath': res.tempFilePath,
                            formData: {
                                workType: "video"
                            }
                        }).then(res => {
                            this.uploadVideo = res.data
                        }).catch(err => {
                            wx.showToast({
                                title: err.msg,
                                icon: 'none'
                            });
                        })
                    }).catch((err) => {
                    });
                }
            },
            handleRelease() {
                if (this.loading) {
                    return;
                }
                if (!this.uploadTitle) {
                    toast('请输入标题');
                    return;
                } else if (this.uploadTitle.trim().length > 14) {
                    toast('标题太长，请输入14字符');
                    return;
                } else if (!this.uploadDesc) {
                    toast('请添加描述');
                    return;
                } else if (this.uploadDesc.trim().length > 150) {
                    toast('描述太长，请输入150字符');
                    return;
                } else if (this.uploadChoose !== 'first' && this.uploadImage.length === 0) {
                    toast('请先选择图片文件');
                    return;
                } else if (this.uploadChoose === 'first' && !this.uploadVideo) {
                    toast('请先选择视频文件');
                    return;
                }
                var that = this
                wx.showModal({
                    title: '提示',
                    content: '您上传的图片和视频将可能会在互联网上传播和浏览，上传作品时，请确保视频或图片上的人物没有肖像权风险、其他内容不存在抄袭等违法行为，若存在上述风险，由上传人自行承担法律责任。',
                    success: function (res) {
                        if (res.confirm) {
                            that.loading = true;
                            if (that.uploadChoose === 'first') {
                                var uploadVideo = [];
                                uploadVideo[0] = that.uploadVideo;
                                uploadVideo[0].worksType = 'video';
                            } else {
                                that.uploadImage.forEach(item => {
                                    item.worksType = 'picture'
                                })
                            }
                            request({
                                ...SUBMIT_WORK,
                                data: {
                                    dtlList: that.uploadChoose !== 'first' ? that.uploadImage : uploadVideo,
                                    worksName: that.uploadTitle,
                                    worksDesc: that.uploadDesc,
                                    worksType: that.uploadChoose === 'first' ? 'video' : 'picture',
                                    address: that.uploadLocation.name 
                                }
                            }).then(res => {
                                that.loading = false;
                                wx.showToast({
                                    title: '提交成功',
                                    icon: 'none',
                                    duration: 1200
                                });
                                that.uploadImage = [];
                                that.uploadVideo = '';
                                that.uploadTitle = '';
                                that.uploadLocation = '';
                                that.uploadChoose = 'first'
                                that.handleListChange('', '');
                                that.uploadDesc = '';
                                that.size = '';
                                that.imgSize = 0;
                                that.videoSize = 0;
                                that.changeUploadImage = []
                            }).catch(err => {
                                that.loading = false;
                            });
                        } else if (res.cancel) {
                            return false;
                        }
                    }
                })
            },
            // 选择位置
            handlechooseLocation() {
                chooseLocation().then(res => {
                    this.uploadLocation = res;
                }).catch(err => {
                    if (err.errMsg === 'chooseLocation:fail require permission desc' || err.errMsg === 'chooseLocation:fail auth deny') {
                        wx.showToast({
                            title: '请前往设置页开启地理位置使用权限',
                            icon: 'none',
                            duration: 4000
                        });
                    }
                    if (err.errMsg === 'chooseLocation:fail require permission desc') {
                        this.showToSetting = true
                    }
                    if (err.errMsg === 'chooseLocation:fail auth deny') {
                        this.showToSetting = true
                    }
                })
            },
            openSetting(res) {
                var that = this
                wx.openSetting({
                    success (res) {
                        if (res.authSetting['scope.userLocation'] === false) {
                            that.showToSetting = true
                        } else if (res.authSetting['scope.userLocation'] === true) {
                            that.showToSetting = false
                        }
                    }
                })
            },
            // 删除视频
            deleteMedia(e) {
                var that = this
                var uploadChoose = this.uploadChoose
                wx.showModal({
                    title: '操作提醒',
                    content: '确认删除？',
                    success: function (res) {
                        if (res.confirm) {
                            if (uploadChoose === 'first'){
                                that.uploadVideo = '';
                                that.size = ''
                                that.videoSize = 0
                            }
                        } else if (res.cancel) {
                            return false;
                        }
                    }
                })
            },
            // 选择上传文件类型
            typeChoose(type) {
                this.uploadChoose = type
                if (this.uploadChoose === "second" && this.uploadImage.length) {
                    this.changeUploadImage = this.uploadImage
                }
                if (this.uploadChoose === "second") {
                    this.size = this.imgSize
                } else if (this.uploadChoose === "first") {
                    this.size = this.videoSize
                }
            },
            handleListChange(val, size) {
                this.uploadImage = val
                this.imgSize = size
                this.size = this.imgSize
            }
        }
    };
</script>
<style lang="less" scoped>
    button:after {
        border: none;
    }
    button {
        background-color: #fff;
    }
    .upload {
        font-family: "PingFangSC-Regular";
        &-head {
            position: relative;
            padding: 40rpx 30rpx;
            border-bottom: 20rpx solid #eee;
            color: #fff;
            &-background {
                position: absolute;
                z-index: -1;
                height: 380rpx;
                width: 100%;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
            }
            &-title {
                margin-bottom: 32rpx;
                font-size: 40rpx;
                line-height: 46rpx;
                text-align: center;
            }
            &-content {
                margin-bottom: 18rpx;
                font-size: 24rpx;
                line-height: 46rpx;
            }
            &-sponsor {
                font-size: 20rpx;
                text-align: end;
            }
        }
        &-content > div{
            padding: 0 30rpx;
            background-color: #fff;
            margin-bottom: 2rpx;
        }
        &-content {
            background-color: #eee;
            color: #333333;
            &-request {
                font-size: 32rpx;
                line-height: 100rpx;
            }
            &-title {
                &-content {
                    input {
                        width: 500rpx;
                        color: #999999;
                    }
                }
            }
            &-type {
                &-content {
                    &-click {
                        margin-left: 40rpx;
                        img {
                            width: 32rpx;
                            height: 32rpx;
                            vertical-align: middle;
                        }
                    }
                }
            }
            &-describe {
                &-input {
                    padding-bottom: 16px;
                    textarea {
                        width: 100%;
                        background-color: #f2f2f2;
                    }
                }
            }
            &-position {
                button {
                    position: absolute;
                    right: 0;
                    color: #4598f1;
                    font-size: 14px;
                }
                &-content {
                    div {
                        width: 530rpx;
                        margin-right: 7rpx;
                        color: #999999;
                        font-size: 13px;
                        text-align: end;
                    }
                }
                img {
                    width: 28rpx;
                    height: 36rpx;
                    vertical-align: middle;
                }
            }
            &-uploading {
                margin-bottom: 0 !important;
                &-list {
                    position: relative;
                    border-bottom: 20rpx solid #fff;
                    img {
                        position: absolute;
                        top: -70rpx;
                        right: 40rpx;
                        width: 45rpx;
                        height: 45rpx;
                    }
                    &-img {
                        width: 210rpx;
                        height: 210rpx;
                        border-radius: 10rpx;
                        background: #eee;
                        margin-right: 15rpx;
                        margin-bottom: 15rpx;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        img {
                            width: 30px;
                            height: 30px;
                        }
                        img.review-img {
                            width: 80px;
                            height: 80px;
                        }
                    }
                    .upload-img{
                        img{
                            width: 210rpx;
                            height: 210rpx;
                            margin-right: 15rpx;
                            margin-bottom: 15rpx;
                            border-radius: 20rpx;
                            display: inline-block;
                            &:nth-child(3n) {
                                float: none;
                            }
                        }
                    }
                    .upload-video {
                        video{
                            width: 100%;
                        }
                    }
                }
                &-content {
                    color: #4598f1;
                }
            }
            &-size {
                &-content {
                  color: #999999;  
                }
            }
        }
        &-btn {
            padding: 50rpx 75rpx;
            button {
                width: 100%;
	            height: 98rpx;
                background: #4598f1;
                border-radius: 10rpx;
                color: #fff;
                font-size: 18px;
                font-family: "PingFangSC-Medium";
	            line-height: 98rpx;
            }
        }
    }
</style>
