<template>
    <div class="info container">
        <div class="info-content">
            <textarea
                :value="userInfo.notes"
                placeholder="填写资料"
                :auto-focus="true"
                @confirm="handleSubmit"
            ></textarea>
        </div>
    </div>
</template>

<script>
import request from '@/utils/request.js';
import { USER } from '@/utils/api.js';
import store from '@/utils/store';
export default {
    data() {
        return {
        };
    },
    computed: {
        userInfo() {
            return store.state.userInfo;
        }
    },
    methods: {
        handleSubmit(e) {
            this.isLoading = true;
            request({
                ...USER,
                data: {
                    notes: e.mp.detail.value
                }
            }).then(res => {
                this.userInfo.notes = e.mp.detail.value;
                store.commit('updateUserInfo', this.userInfo)
                wx.navigateBack();
            });
        }
    }
};
</script>

<style lang="less" scope>
.info {
    textarea {
        width: 100%;
        padding: 10px;
        background: #fff;
    }
}
</style>
