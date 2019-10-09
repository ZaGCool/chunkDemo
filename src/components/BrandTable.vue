<template>
    <table class="table table-bordered">
            <thead>
                <tr>
                    <th width="10%">序号</th>
                    <th width="20%">名称</th>
                    <th width="30%">描述</th>
                    <th width="30%">创建时间</th>
                    <th width="10%">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="list.length===0"><td colspan="5">没有更多数据啦</td></tr>
                <tr v-else :class="[index%2==0?'success':'default']" v-for="(item,index) in list" :key="item.id">
                    <td>{{ index+1 }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.desc }}</td>
                    <td>{{ item.time | dataFilter   }}</td>
                    <td><a href="#" @click.stop.prevent="del(item.id)">删除</a></td>
                </tr>
            </tbody>
        </table>
        
</template>
<script>


export default {
    props: ['list'],
    methods: {
        del(id){
            this.$emit('del',id)
        }
    }

}
</script>

<style lang="less" scoped>
    .table.table-bordered th,
    .table.table-bordered td {
      text-align: center;
      vertical-align: middle;
    }
</style>