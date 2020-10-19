<template>
    <div class="topbar">
        <div
            v-for="(item, index) in tabBar"
            :key="item"
            @click="handleClick(item, index)"
            class="topbar-item"
            :class='{"actived": activeIndex === index}'
        >
            <img v-if="activeIndex === index" class="topbar-item-img" :src="item.selectedIconPath" />
            <img v-else class="topbar-item-img" :src="item.iconPath" />
            <div class="topbar-item-text">{{item.text}}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: Number
        },
        defaultIndex: {
            type: Number
        }
    },
    data() {
        return {
            activeIndex: this.defaultIndex
        };
    },
    computed: {
        tabBar() {
            switch (this.type) {
                case 1:
                    return [
                        {
                            text: '活动首页',
                            pagePath: 'pages/index/main',
                            iconPath: '/static/tabs/home.png',
                            selectedIconPath: '/static/tabs/home-active.png'
                        },
                        {
                            text: '排行榜',
                            pagePath: 'pages/ranking/main',
                            iconPath: '/static/tabs/ranking.png',
                            selectedIconPath: '/static/tabs/ranking-active.png'
                        },
                        {
                            text: '发布',
                            pagePath: 'pages/release/main',
                            iconPath: '/static/tabs/release.png',
                            selectedIconPath: '/static/tabs/release-active.png'
                        },
                        {
                            text: '我的',
                            pagePath: 'pages/my/main',
                            iconPath: '/static/tabs/my.png',
                            selectedIconPath: '/static/tabs/my-active.png'
                        }
                    ]
                    break;
                case 2:
                    return [
                        {
                            text: '首页',
                            pagePath: '/pages/take-photo/index/main',
                            iconPath: '/static/tabs/home.png',
                            selectedIconPath: '/static/tabs/home-active.png'
                        },
                        {
                            text: '上传',
                            pagePath: '/pages/take-photo/update/main',
                            iconPath: '/static/tabs/release.png',
                            selectedIconPath: '/static/tabs/release-active.png'
                        },
                        {
                            text: '我的',
                            pagePath: '/pages/take-photo/my/main',
                            iconPath: '/static/tabs/my.png',
                            selectedIconPath: '/static/tabs/my-active.png'
                        }
                    ]
                    break;
                default:
                    break;
            }
        }

    },
    mounted() {
        console.log(getCurrentPages());
    },
    methods: {
        handleClick(item, index) {
            if (index !== this.defaultIndex) {
                wx.reLaunch({
                    url: item.pagePath
                });
            }
        }
    }
};
</script>

<style lang='less' scope>
.topbar {
    display: flex;
    font-family: PingFangSC-Medium;
    &-item {
        flex: 1;
        text-align: center;
        padding: 5px 0;
        background: #fafafa;
        color: #999;
        font-size: 10px;
        &.actived {
            color: #333;
        }
        &-img {
            width: 25px;
            height: 25px;
        }
    }
}
</style>
