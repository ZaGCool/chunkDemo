<template>
    <form class="form-inline">
            <div class="form-group">
                <label>名称</label>
                <input type="text" v-focus v-model="name" class="form-control">
            </div>
            <div class="form-group">
                <label>描述</label>
                <input type="text" v-model="desc" @keyup.enter.exact="add" class="form-control">
            </div>
            <button type="button" class="btn btn-primary" @click="add">添加</button>
            <div class="form-group">
                <label>搜索关键字:</label>
                <input type="text" v-model="key" class="form-control">
            </div>
        </form>
</template>
<script>
export default {
    data(){
        return {
            name: '',
            desc: '',
            key: ''
        }
    },
    watch: {
        key(val){
            this.$emit('getKey',val)
        }
    },
    methods: {
        add(){
            if(!this.name.trim() || !this.desc.trim()) return alert("请您输入完善输入内容");
            this.$emit('send', this.name,this.desc);
            this.name = '';
            this.desc = "";
        }
    }
}
</script>

<style lang="less" scoped>
    .form-inline {
        margin-bottom: 20px;
    }
    .form-group:nth-last-of-type(1) {
        margin-left: 80px;
    }
</style>