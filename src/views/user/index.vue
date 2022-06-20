<template>
  <div class="app-container" >
      <!-- 多条件查询 -->
    <el-form :inline="true" :model="query" class="demo-form-inline" size="mini">
      <el-form-item >
        <el-input v-model.trim="query.username" placeholder="用户名" ></el-input>
      </el-form-item>
      <el-form-item >
        <el-input v-model="query.mobile" placeholder="手机号"> </el-input>
      </el-form-item>
     
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
        <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="openAdd" >新增</el-button>
      </el-form-item>
  </el-form>
    <!-- 数据列表 -->
    <el-table :data="list" stripe border style="width: 100%">
    <el-table-column type="index" label='序号' width="50"></el-table-column>
    <el-table-column prop="username" label="用户号" align="center" width="80"></el-table-column>
    <el-table-column prop="nickname" label="昵称" align="center" width="80"></el-table-column>
    <el-table-column prop="mobile" label="手机号" align="center" width="110"> </el-table-column>
    <el-table-column prop="emaile" label="邮箱" align="center"> </el-table-column>
    <el-table-column prop="isAccountNonExpired" center label="账号过期" align="center">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.isAccountNonExpired ===0" type="success">正常</el-tag>
        <el-tag v-if="scope.row.isAccountNonExpired ===1" type="danger">过期</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="isAccountNonLocked" center label="账号锁定" align="center">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.isAccountNonLocked ===0" type="success">正常</el-tag>
        <el-tag v-if="scope.row.isAccountNonLocked ===1" type="danger">锁定</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="isCredentialsNonExpired" center label="密码过期" align="center">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.isCredentialsNonExpired ===0" type="success">正常</el-tag>
        <el-tag v-if="scope.row.isCredentialsNonExpired ===1" type="danger">过期</el-tag>
      </template>
    </el-table-column>
        <el-table-column prop="deleted" center label="账号停止" align="center">
    <template slot-scope="scope">
        <el-tag v-if="scope.row.deleted ===0" type="success">正常</el-tag>
        <el-tag v-if="scope.row.deleted ===1" type="danger">停止</el-tag>
      </template>
    </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="340">
        <!-- scope指当前行的数据对象，可以通过scope获取行中的列值 -->
        <template slot-scope="scope" v-if="scope.row.deleted===0">
          <el-button size="mini" type="success" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger"  @click="handleDelete(scope.row.id)">删除</el-button>
          <el-button size="mini" type="primary" @click="handleRole(scope.row.id)">设角色</el-button>
          <el-button size="mini" type="primary"  @click="handlePwd(scope.row.id)">改密码</el-button>
        </template>
      </el-table-column>


    </el-table>
    <!-- 分页功能 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :page-sizes="[10, 20, 50]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>
    <!-- 打开子新增编辑组件 -->
    <user-edit :title="edit.title" :dialogVisible="edit.dialogVisible" 
    :remoteClose="remoteClose" :pojo="edit.pojo"/>
    <!-- 打开角色编辑组件，复用角色窗口 -->
    <el-dialog title="设置角色" :visible.sync="role.dialogVisible" width="60%" >
      <!-- ：roleIds 是当前用户所拥有的角色ID，@saveUserRole 子组件触发父组件执行角色保存  -->
      <role :roleIds="role.roleIds" @saveUserRole="saveUserRole"/>
    </el-dialog>
    <!-- 打开密码修改组件 -->
    <password :title="pwd.title" :dialogVisible="pwd.dialogVisible" 
    :remotePwdClose="remotePwdClose" :pojo="pwd.pojo"/>
  </div>
</template>

<script>
// * 相当于导出默认对象，导出对象中所有的方法，as 给*取个别名，方便调用
import * as userApi from '@/api/user';

import UserEdit from './userEdit.vue';
import Password from './password';
import Role from '../role';


export default ({
  name:'user',//和对应路由表中配置的name值一致
  data () {
    return {
      list:[],
      page:{//分页对象
        current:1,//当前页码
        size:10,//每页显示条数
        total:0//总记录数
      },
      query:{
        username:'',
        mobile:''
      },

      edit:{
        title:'',
        dialogVisible: false,
        pojo:{id: null,
              createUserID:'',
              createDate: new Date(),
              lastUserID: '',
              lastDate: new Date(),
              username:'',
              password:'',
              nickname:'',
              imageUrl:'',
              mobile:'',
              email:'',
              isAccountNonExpired: 0,
              isAccountNonLocked: 0,
              isCredentialsNonExpired: 0,
              isSupervisor: 0,
              role:'',
              remark: ''}
      },
      role:{
        dialogVisible:false,
        // 传递到子组件中时，至少会传递一个空数组[],子组件判断是否有roleIds值，来判读是否为设置角色动作
        roleIds:[],
        userId:null //保存点击角色时的用户ID
      },
      pwd:{
        title:'修改密码',
        dialogVisible:false,
        pojo:{
          userId: null,
          password:null,
          checkPassword:null
        }
      }

    }
  },
 
  created(){
    this.fetchData();
  },
  components: {UserEdit,Role,Password},

  methods: {
    async fetchData(){
      const {data} = await userApi.getList(this.query,this.page.current,this.page.size)
        this.list = data.records;
        this.page.total = data.total;
    },
    handleEdit(id) {
      userApi.getById(id).then(response=>{
        if(response.code===20000){
         
          this.edit.pojo = response.data;
          this.edit.title = '编辑'
          this.edit.dialogVisible = true
        }
      })
    },
    handleDelete(id) {
      this.$confirm('确认删除这条记录吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          userApi.deleteById(id).then(response=>{
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
    // 分页改变每页的记录数
    handleSizeChange(val){
      this.page.size=val;
      this.fetchData()
    },
    // 分页改变当前页码
    handleCurrentChange(val){
      this.page.current = val;
      this.fetchData()
    },
    // 多条件查询
    queryData(){
      this.page.current = 1
      this.fetchData()
    },
    reload(){
      this.query = {}
    },
    // 子组件会触发此事件方法来关闭窗口
    remoteClose(){
      this.edit.pojo = {id: null,
              createUserID:'',
              createDate: new Date(),
              lastUserID: '',
              lastDate: new Date(),
              username:'',
              password:'',
              nickname:'',
              imageUrl:'',
              mobile:'',
              email:'',
              isAccountNonExpired: 0,
              isAccountNonLocked: 0,
              isCredentialsNonExpired: 0,
              isSupervisor: 0,
              role:'',
              remark: ''}
      this.edit.dialogVisible = false
      this.fetchData()
    },
    // 打开新增
    openAdd(){
      this.edit.title='新增 默认密码与用户名一致'
      this.edit.dialogVisible = true
    },
    //设置角色
    handleRole(id){
      this.role.roleIds=[]
      this.role.userId=id
      
      userApi.getRoleIdsByUserId(id).then(response=>{
        //将获取到的角色ID传递给子组件
        this.role.roleIds = response.data
        this.role.dialogVisible = true
      })
      
    },
    //修改密码
    handlePwd(id){
       this.pwd.title='修改密码';
       this.pwd.dialogVisible=true;
       this.pwd.pojo.userId=id;
    },
    // 角色列表子组件会触发此方法来保存当前用户选择的角色id
    saveUserRole(checkedRoleIds){
      userApi.saveUserRole(this.role.userId,checkedRoleIds).then(response=>{
         if (response.code ===20000){
             this.$message({
                message: '分配角色成功',
                type: 'success'
              });
          this.role.dialogVisible = false
          
        }else{
             this.$message({
                message: "分配角色失败",
                type: 'error'
              });
        }
      })
    },
    remotePwdClose(){
      this.pwd.pojo = {
            userId: null,
            password: null,
            checkPassword: null}
      this.pwd.dialogVisible = false
      this.fetchData()
    }
  }
})
</script>

<style scoped>
</style>