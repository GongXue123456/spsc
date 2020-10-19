<template>
  <div v-if="type === 'second'" class='release_box'>
    <div class="release_box_content">
      <div v-for="item in uploadImage" :key="item">
        <div class='pic_box item' @click="showImg(uploadImage, item.httpUrl + item.objId)" @longpress='_longtap' @touchstart='touchs' @touchend='touchend' @touchmove='touchm' >
          <img
            mode="aspectFill"
            :src="item.httpUrl + item.objId"
            :data-index = "index"
            @tap='previewImage'
            class="gays_pic_C"
          >
          <!-- 关闭按钮 -->
          <img src="/static/images/take-photo/close.png" class="del_pic" @click.stop='deletePic(index)' :data-index = "index">

        </div>
      </div>
      <div>
        <div class="nullPic pic_box item" @click='choose' v-if="uploadImage.length < 9">
            <img src="/static/images/increase.png"/>
        </div>
      </div>
      <!-- <div :y="y" :x="x" direction="all" damping="5000" friction="1" disabled="true" style="z-index: 3;">
        <div class='item-move' :hidden='hidden'>
          <img :src="maskImg" mode="aspectFill"/>
        </div>
      </div> -->
      <!-- <div class="nullPic" @click='choose' v-if="uploadImage.length < 9">
        <img src="/static/images/increase.png"/>
      </div> -->
    </div>
  </div>
</template>
<script>
import {chooseImage} from '@/utils/bridge.js';
import {UPLOAD_FILES, fileUrl} from '@/utils/api.js';
import {uploadFile} from '@/utils/request.js';
export default {
  props: ['type', 'changeUploadImage', 'imgSize'],
  data() {
      return {
        hidden: true,
        flag: false,
        maskImg: '',
        fileUrl,
        size: 0,
        sizeList: [],
        x: 0,
        y: 0,
        areaHeight: 0,
        uploadImage: [],
        disabled: true,
        longTapStart: false,
        elements: []
      }
      
  },
  onLoad(options) {
  },
  watch: {
    uploadImage(val) {
      if (this.uploadImage.length) {
        this.$emit("listChange", val, this.size)
        if (this.uploadImage.length < 9) {
          const Length = this.uploadImage.length + 1
          this.areaHeight = (parseInt(Length / 3) + (Length % 3 !== 0 ? 1 : 0)) * 232
        } else {
          this.areaHeight = 232 * 3
        }
      }
    },
    changeUploadImage: {
      immediate:true,
      handler: function() {
        this.uploadImage = this.changeUploadImage
        this.size = this.imgSize
      },
      deep: true
    }
  },
  methods: {
    // 上传图片 
    choose() {
      chooseImage(this.uploadImage.length).then(res => {
            var tempFiles = res.tempFiles;
            var files = [];
            for(let i = 0;i < tempFiles.length;i++){
                files.push({file: res.tempFiles[i].path});
                this.size += Number(tempFiles[i].size);
                this.sizeList.push(tempFiles[i].size)
            }
            this.$emit("listChange", '', this.size)
            if (this.size > 52428800) {
                wx.showToast({
                    title: '上传文件的大小不能超过50M',
                    icon: 'none',
                    duration: 2000
                });
                return;
            }
            Promise.All(tempFiles.map(item => {
                return new Promise((reslove, reject) => {
                    uploadFile({
                    ...UPLOAD_FILES,
                    filePath: item.path,
                    formData: {
                        workType: "picture"
                    }
                }).then(res => {
                    this.uploadImage = this.uploadImage.concat(res.data)
                    reslove(res);
                }).catch(err => {
                    reject(err);
                })
                })
            })).then(results => {
                console.log(results, "results")
            }).finally(()=>{
                if (this.uploadImage.length && this.uploadImage.length < tempFiles.length) {return}
                this.areaHeight = (parseInt(this.uploadImage.length / 3) + (this.uploadImage.length % 3 !== 0 ? 1 : 0)) * 225
            })
          
      });
    },
    showImg(list, objId) {
    
      let urls = list.map(item => {
        return item.httpUrl + item.objId
      })
      wx.previewImage({
        urls,
        current: objId
      })
    },
    //长按
    _longtap(e){
      this.maskImg = this.fileUrl + this.uploadImage[e.target.dataset.index].objId
      const detail = e.detail;
      this.x = e.currentTarget.offsetLeft
      this.y = e.currentTarget.offsetTop
      this.hidden = false,
      this.flag = true
      this.longTapStart = true
    },
    //触摸开始
    touchs(e){
      this.beginIndex = e.target.dataset.index
      wx.createSelectorQuery().selectAll(".item").fields({
        dataset: true,
        rect: true
      }, (res) => {
        this.elements = res
      }).exec()
    },
    //触摸结束
    touchend(e){
      if (!this.flag) {
        return;
      }
      const x = e.mp.changedTouches[0].clientX
      const y = e.mp.changedTouches[0].clientY
      let data = this.uploadImage
      for(var j = 0; j< this.elements.length; j++){
        const item =  this.elements[j];
        if(x>item.left && x<item.right && y>item.top && y<item.bottom){
          const endIndex = j;
          const beginIndex = this.beginIndex;
          //向后移动
          if (beginIndex < endIndex) {
            let tem = data[beginIndex];
            for (let i = beginIndex; i < endIndex; i++) {
              data[i] = data[i + 1]
            }
            data[endIndex] = tem;
          }
          //向前移动
          if (beginIndex > endIndex) {
            let tem = data[beginIndex];
            for (let i = beginIndex; i > endIndex; i--) {
              data[i] = data[i - 1]
            }
            data[endIndex] = tem;
          }

          this.uploadImage = data
        }
      }
      this.hidden = true,
      this.flag = false
      this.longTapStart = false
    },
    //滑动
    touchm(e){
      if(this.flag){
        this.x =  e.touches[0].pageX - 75
        this.y =  e.touches[0].pageY  - 731
      }
    },
    deletePic(index) {
      this.uploadImage.splice(index, 1)
      this.sizeList.splice(index, 1)
      this.size = 0
      for(let i = 0;i < this.sizeList.length;i++){
          this.size += Number(this.sizeList[i]);
      }
      this.$emit("listChange", '', this.size)
    }
  }
}
</script>
<style lang="less">
/* ===> */

/* test/test.wxss */
movable-area{
  width: 100%;
  z-index: 5;
}
.release_box_content {
    overflow: hidden;
    padding: 10px 0;
}
.del_pic{
  z-index: 4;
  width: 60rpx;
  height: 60rpx;
  position: absolute;
  right: -20rpx;
  top: -20rpx;
}
.pic_box{
  float: left;
  margin-left: 15rpx;
  margin-bottom: 15rpx;
  border-radius: 30rpx;
  width: 210rpx;
  height: 210rpx;
  position: relative
}

.item{
  float: left;
  width: 210rpx;
  height: 210rpx;
}
.gays_pic_C{
  width: 210rpx;
  height: 210rpx;
  border-radius: 30rpx;
}

.item-move{
  display: inline-block;
  width: 210rpx;
  height: 210rpx;
}

.item-move img{
  width: 210rpx;
  height: 210rpx;
  border-radius: 30rpx;
}

.nullPic{
  width: 210rpx;
  height: 210rpx;
  margin-bottom: 20rpx;
  margin-left: 20rpx;
  border-radius: 30rpx;
  background: #eee;
  text-align: center;
}
.nullPic img{
  width: 80rpx;
  height: 80rpx;
  position: relative;
  top: 65rpx;
}

</style>