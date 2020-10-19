<template>
    <div>
        <div class="mask"></div>
        <div class="bind-phone">
            <div class="bind-phone-header">
                <div class="bind-home-header-logo"></div>
                <div>申请使用</div>
            </div>
            <div class="bind-phone-title">你的手机号</div>
            <div class="bind-phone-btns">
                <div class="bind-phone-btns-cancel">
                    <button type="button">拒绝</button>
                </div>
                <div class="bind-phone-btns-allow">
                    <button type="button" open-type="getPhoneNumber" @bindgetphonenumber="getPhoneNumber">
                        允许
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import store from '@/utils/store';
export default {
    computed: {
        userinfo() {
            return store.state.userinfo;
        }
    },
    methods: {
        getPhoneNumber(e) {
        }
    }
};
</script>

<style lang="less" scope>
.mask {
    position: fixed;
    z-index: 100;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .5);
}
.bind-phone {
    z-index: 101;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
}
</style>
