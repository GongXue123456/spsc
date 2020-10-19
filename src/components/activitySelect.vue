<template>
    <picker
        :value="index"
        :range="array"
        range-key="activity_name"
        mode="selector"
        @change="handleSelectedChange">
        <slot></slot>
    </picker>
</template>

<script>
import request from '@/utils/request.js';
import {toast} from '@/utils/bridge';
import {PAGE_SELECT, PAGE_RANK_SELECT} from '@/utils/api';
export default {
    props: ['source'],
    data() {
        return {
            index: 0,
            array: []
        };
    },
    computed: {
        selected() {
            if (this.array[this.index]) {
                return this.array[this.index];
            }
            return null;
        }
    },
    methods: {
        show() {
            if (!this.array.length) {
                this.pageSelect();
            }
        },
        pageSelect() {
            let url = this.source === 'ranking'
                ? PAGE_RANK_SELECT
                : PAGE_SELECT;
            request({
                ...url,
                data: {
                    page: 1,
                    limit: 20
                }
            }).then(res => {
                if (res && res.list.length) {
                    this.array = res.list;
                }
                this.handleEmit();
            });

        },
        handleSelectedChange(e) {
            this.index = e.mp.detail.value;
            this.handleEmit();
        },
        handleEmit() {
            if (!this.selected) {
                toast('您还没有参加活动！');
                setTimeout(() => {
                    wx.switchTab({
                        url: '/pages/index/main'
                    });
                }, 1000);
            } else {
                this.$emit('change', this.selected);
            }
        }
    },
    mounted() {
        this.pageSelect();
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
    }
}
</style>
