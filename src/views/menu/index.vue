<template>
  <div class="app-container">
    <!-- 菜单管理 -->
     <!-- 多条件查询 -->
    <el-form :inline="true" :model="query" class="demo-form-inline" size="mini">
      <el-form-item >
        <el-input v-model.trim="query.menuName" placeholder="菜单名称" ></el-input>
      </el-form-item>
     
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="fetchData">查询</el-button>
        <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="handleAdd(0)" >新增一级菜单</el-button>
      </el-form-item>
  </el-form>
    <!-- 数据列表 -->
    <!-- 设置row-key="id" 并包含child子集才会被渲染为树状结构 -->
    <el-table row-key="id" :data="list" stripe border style="width: 100%">
    <el-table-column type="index" label='序号' width="50"></el-table-column>
    <el-table-column
        prop="menuName"
        label="菜单名称"
        width="180">
    </el-table-column>
    <el-table-column
        prop="menuUrl"
        label="请求地址"
        align="center"
        width="180">
    </el-table-column>
    <el-table-column
        prop="menuCode"
        label="权限标识"
        align="center"
      >   
    </el-table-column>
 
    <el-table-column prop="menuType" center label="类型" align="center">
      <template slot-scope="scope">
        <span v-if="scope.row.menuType===1">目录</span>
        <span v-if="scope.row.menuType===2">菜单</span>
        <span v-if="scope.row.menuType===3">按钮</span>
      </template>
    </el-table-column>
    <el-table-column prop="menuIcon" label="图标" align="center" width="80">
      <template slot-scope="scope">
       <i :class="scope.row.menuIcon"></i>
      </template>
    </el-table-column>
        <el-table-column
        prop="menuSort"
        label="排序"
        align="center"
        width="80"
      >
    </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="230" >
        <!-- scope指当前行的数据对象，可以通过scope获取行中的列值 -->
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleAdd(scope.row.id)">新增</el-button>
          <el-button size="mini" type="success" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger"  @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>


    </el-table>
    <!-- 这是新增或者编辑组件 -->
    <menu-edit :title="edit.title" :dialogVisible="edit.dialogVisible" :pojo="edit.pojo" :remoteClose="remoteClose"/>
  </div>
</template>

<script>


import menuApi from '@/api/menu';
import MenuEdit from './menuEdit.vue';
export default {
   data () {
    return {
       
       list:[],
       AgentOptions:[],
       query:{
        menuName:''
      },
      edit:{
          title:'',
          dialogVisible: false,
          pojo:{id: null,
                status: '1',
                createUserID:'',
                createDate: new Date(),
                lastUserID: '',
                lastDate: null,
                parentID:0,
                menuUrl:'',
                menuCode:'',
                menuName:'',
                menuType:'',
                menuIcon:'',
                menuSort:'',
                remark:''
              }
        }
    }
  },
  created(){
    this.fetchData();
  },
  components: {MenuEdit},

  methods: {
      async fetchData(){
       const {data}  = await menuApi.getList(this.query)
       console.log(data);
       this.list = data;
    },
    
    // 新增，0为增加一级菜单，大于0增加子菜单,id作为新菜单的parentID
    handleAdd(id){
      // 初始化父ID
      this.edit.pojo.parentID=id;
      this.edit.title="新增";
      this.edit.dialogVisible=true;
      
    },
    //编辑
    handleEdit(id){
       menuApi.getById(id).then(response=>{
        if(response.code===20000){
         
          this.edit.pojo = response.data;
          this.edit.title = '编辑'
          this.edit.dialogVisible = true
        }
      })
    },
  
    //删除菜单
    handleDelete(id) {
      this.$confirm('确认删除当前节点与子节点的数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          menuApi.deleteById(id).then(response=>{
             this.$message({
             type: response.code===20000?'success':'error',
             message: response.message
          });
          // 删除后刷新列表数据
          this.fetchData()
          })
         
        }).catch(()=>{
          //取消删除不用理会
        });
    },
    // 重置
    reload(){
      this.query = {menuName:""};
      this.fetchData();
    },
     remoteClose(){
      this.edit.pojo = {id: null,
                status: '1',
                createUserID:'',
                createDate: new Date(),
                lastUserID: '',
                lastDate: null,
                parentID:0,
                menuUrl:'',
                menuCode:'',
                menuName:'',
                menuType:'',
                menuIcon:'',
                menuSort:'',
                remark:''
              }
      this.edit.dialogVisible = false
      this.fetchData()
    },

  }
}
</script>

<style scoped>
</style>