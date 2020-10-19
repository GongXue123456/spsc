<template>
    <div class="tab">
        <div
            v-for="(item, index) in list"
            :key="item"
            @click="handleClick(index)"
            class="tab-item"
            :class="{'actived': activeIndex === index}">
            <span>{{item}}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        list: {
            type: Object
        },
        defaultIndex: {
            type: Number,
            default: 0
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            activeIndex: this.defaultIndex
        };
    },
    methods: {
        handleClick(index) {
            if (this.disabled || index == this.activeIndex) {
                return;
            }
            this.activeIndex = index;
            this.$emit('change', index);
        }
    }
};
</script>

<style lang="less" scope>
.tab {
    display: flex;
    color: #999;
    font-family: PingFangSC-Medium;
    &-item {
        flex: 1;
        text-align: center;
        line-height: 1;
        background: #fff;
        font-size: 12px;
        span {
            display: inline-block;
            padding: 12px 5px 10px;
        }
        &.actived {
            color: #333;
            span {
                border-bottom: 2px solid rgb(241, 141, 53);
            }
        }
    }
}
</style>
