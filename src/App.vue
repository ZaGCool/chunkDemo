<template>
    <div class='container'>
        <brand-form @send="add" @getKey='getKey'></brand-form>
        <brand-table :list="filterList" @del="del"></brand-table>
    </div>
</template>
<script>

import BrandForm from "./components/BrandForm"
import BrandTable from "./components/BrandTable"



export default {
    data(){
        return {
            list: [],
            key: ''
        }
    },
    created() {
        this.getList()
    },
    components: {
        BrandForm,
        BrandTable
    },
    computed: {
        filterList() {
            return this.list.filter(item=>item.name.includes(this.key))
        }
    },
    methods: {
        getList(){
            // 发起ajax请求
            this.$http.get('getBrandList')
            .then(res=>{
                console.log(res);
                if(res.data.status === 200) {
                    this.list = res.data.list
                }
            })
            .catch(err=>console.log(err))
        },
        add(name,desc){
            this.$http.post('addBrand',{
                    name,
                    desc,
                    time: new Date()
            }).then(res=>{
                if(res.data.status===200) {
                    console.log(res.data.msg);
                    
                    this.getList();
                }
            })
        },
        del(id){
           
           this.$http.get('deleteBrand',{
               params: {
                   id
               }
           })
           .then(res=>{
               if(res.data.status===200) {
                   console.log(res.data.msg);
                   
                   this.getList();
               }
           })
            
        },
        getKey(val) {
            this.key = val;
        }
    }

}
</script>
<style lang="less" scoped>
    .container {
      margin-top: 50px;
      width: 850px;

      
    }

   
</style>