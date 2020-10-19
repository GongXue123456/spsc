<script>
export default {
    // onLaunch(option) {
    //     if (option.scene == 1047 || option.scene == 1048 || option.scene == 1049) {
    //         wx.navigateTo({
    //             url: '/pages/detail/main?id=' + decodeURIComponent(option.query.scene)
    //         });
    //     }
    // },
    created() {
    }
};
</script>

<style>
.container {
    height: 100%;
    box-sizing: border-box;
    background-color: #eee;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-flow: wrap;
}
.flex-start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}
.flex-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.text-overflow-3 {
    display: -webkit-box;
    overflow: hidden;
    white-space: normal;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
.text-overflow-2 {
    display: -webkit-box;
    overflow: hidden;
    white-space: normal;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.text-overflow-1 {
    display: -webkit-box;
    overflow: hidden;
    white-space: normal;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}
</style>
