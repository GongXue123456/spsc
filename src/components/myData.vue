<template>
    <div class="my-data" v-if="!isLoading">
        <div class="my-data-title">
            <span>{{title}}</span>
            <img
                :class="{'is-delete': deleteList.length}"
                v-if="showEdit"
                @click="handleDelete"
                src="/static/images/delete.png">
        </div>
        <div class="my-data-list">
            <div
                class="my-data-item"
                v-for="item in list"
                :key="item.id">
                <img
                    v-if="item.type==='image'"
                    class="my-data-item-img"
                    mode="aspectFill"
                    @click="previewImage(item)"
                    :src="item.work_media1">
                <video
                    v-else-if="item.type==='video'"
                    class="my-data-item-img"
                    mode="aspectFill"
                    :src="item.work_media1"></video>
                <img
                    v-if="showEdit"
                    class="my-data-item-select"
                    :class="{'is-delete': item.isSelect}"
                    src="/static/images/select.png"
                    @click="handleSelect(item)"
                >
                <like
                    icon="/static/images/like-small.png"
                    likedIcon="/static/images/selected.png"
                    class_name="my-data-item-num"
                    :data="item">
                </like>
                <div class="my-data-item-desc">{{item.fullname}}—{{item.work_title}}</div>
            </div>
            <div
                class="my-data-empty"
                v-if="list.length === 0 && !isLoading">
                您还没有发布作品
            </div>
        </div>
        <div
            v-if="isMore && !isLoading"
            class="my-data-more"
            @click="hanldeMore">
            加载更多
        </div>
    </div>
</template>

<script>
import like from '@/components/like';
import request from '@/utils/request';
import {PAGE_MY_WORK, PAGE_MY_LIKE, DELETE} from '@/utils/api';
import {toast} from '@/utils/bridge';
export default {
    components: {
        like
    },
    props: ['type', 'status'],
    data() {
        return {
            urlMap: {
                work: PAGE_MY_WORK,
                like: PAGE_MY_LIKE
            },
            title: this.status === 'ON' ? '进行中' : '已结束',
            isMore: false,
            isLoading: false,
            list: [],
            pageSize: 6,
            pageNum: 1,
            deleteList: []
        };
    },
    computed: {
        showEdit() {
            return this.status === 'ON' && this.type === 'work'
        }
    },
    watch: {
        type(value) {
            this.init();
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.pageNum = 1;
            this.fetchData();
        },
        fetchData() {
            if (this.pageNum === 1) {
                this.isLoading = true;
            }
            request({
                ...this.urlMap[this.type],
                data: {
                    actStatus: this.status,
                    limit: this.pageSize,
                    page: this.pageNum
                }
            }).then(res => {
                this.isLoading = false;
                if (this.pageNum === 1) {
                    this.list = res.list;
                } else {
                    this.list = [...this.list, ...res.list]
                }
                if (res.lastPage) {
                    this.isMore = false;
                } else {
                    this.isMore = true;
                }
            });
        },
        hanldeMore() {
            this.pageNum += 1;
            this.fetchData();
        },
        handleSelect(item) {
            let index = this.deleteList.indexOf(item.id);
            if (index === -1) {
                this.deleteList.push(item.id);
            } else {
                this.deleteList.splice(index, 1);
            }
            this.list.map(item => {
                item.isSelect = this.deleteList.indexOf(item.id) !== -1;
                return item;
            })
        },
        handleDelete() {
            if (this.deleteList.length) {
                request({
                    ...DELETE,
                    data: {
                        workIds: JSON.stringify(this.deleteList)
                    }
                }).then(res => {
                    this.list = this.list.filter(item => {
                        return this.deleteList.indexOf(item.id) === -1;
                    })
                    this.deleteList = [];
                });
            }else{
                toast("请按活动作品右上角勾选键选择要删除的作品");
            }
        },
        previewImage(item) {
            console.log(item.work_media1);
            var urls = [];
            urls.push(item.work_media1);
            if(item.work_media2){
                urls.push(item.work_media2);
            }
            if(item.work_media3){
                urls.push(item.work_media3);
            }
            wx.previewImage({
                urls: urls,
                current: item.work_media1
            })
//            wx.previewImage({
//                urls: this.list.map(item => item.work_imgurl),
//                current: url
//            })
        }
    },
    onPullDownRefresh() {

        this.init();
    },
};
</script>

<style lang="less" scope>
.my-data {
    padding: 0 15px;
    margin-bottom: 10px;
    background: #fff;
    &-title {
        font-size: 14px;
        padding: 10px 0;
        display: flex;
        align-items: center;
        span {
            flex: 1;
        }
        img {
            opacity: .3;
            width: 16px;
            height: 16px;
        }
        .is-delete {
            opacity: 1;
        }
    }
    &-list {
        overflow: hidden;
    }
    &-item {
        position: relative;
        float: left;
        width: 105px;
        margin-right: 15px;
        height: 105px;
        margin-bottom: 45px;
        /*display: flex;*/
        align-items: center;
        justify-content: center;
        background-color: #eee;
        &:nth-child(3n) {
            margin-right: 0;
        }
        &-img {
            width: 105px;
            height: 105px;
        }
        &-select {
            position: absolute;
            right: 10px;
            top: 10px;
            width: 15px;
            height: 15px;
            opacity: .3;
            &.is-delete {
                opacity: 1;
            }
        }
        &-num {
            width: 60px;
            height: 10px;
            position: absolute;
            left: 0;
            bottom: 0;
            right: 0;
            top:0;
            padding: 12px 10px 10px;
            display: flex;
            background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .3));
            .like-icon {
                vertical-align: middle;
                margin-top: 0;
            }
            span {
                color: #fff;
            }
        }
        &-desc {
            font-size: 11.5px;
        }
    }
    &-more {
        font-size: 14px;
        color: #999;
        text-align: center;
        padding: 10px 0;
        margin-top: -15px;
        &:before {
            content: '-';
            color: #eee;
            margin-right: 5px;
        }
        &:after {
            content: '-';
            color: #eee;
            margin-left: 5px;
        }
    }
    &-empty {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        text-align: center;
        color: #999999;
        padding: 48px 0 68px;
    }
}
</style>
