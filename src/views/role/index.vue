<template>
  <div class="app-container" >
      <!-- 多条件查询 -->
    <el-form :inline="true" :model="query" class="demo-form-inline" size="mini">
      <el-form-item >
        <el-input v-model.trim="query.roleName" placeholder="请输入角色" ></el-input>
      </el-form-item>
      <el-form-item label="状态" placeholder="状态">
        <el-select v-model="query.status" clearable filterable style="width:85px">
          <el-option v-for="item in StatusOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
        <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
        <el-button v-if="!roleIds" icon="el-icon-circle-plus-outline" type="primary" @click="openAdd" >新增</el-button>
        <el-button v-if="roleIds" icon="el-icon-circle-plus-outline" type="success" @click="handleUserRole" >设置角色</el-button>
      </el-form-item>
  </el-form>
    <!-- 数据列表 -->
    <el-table :data="list" stripe border style="width: 100%" row-key="id" ref="multipleTable" @selection-change="handleSelectionChange">
    <!-- 多选 -->
    <!-- reserve-selection必须配合上面的row-key使用，这样可以在切换页面后，保留前面选中的行 -->
     <el-table-column v-if="roleIds" type="selection" align="center" reserve-selection   width="55"> </el-table-column>

    <el-table-column type="index" label='序号' width="50"></el-table-column>
    <el-table-column prop="roleName" label="角色名称" align="center" width="180"></el-table-column>
    <el-table-column prop="status" center label="状态" align="center">
      <template slot-scope="scope">
        <el-tag :type="scope.row.status | statusFilter">
           <span>{{ scope.row.status | isStatus }}</span>
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
        prop="roleName"
        label="备注"
        align="center">
    </el-table-column>
      <!-- 操作 -->
      <el-table-column v-if="!roleIds" label="操作" width="240">
        <!-- scope指当前行的数据对象，可以通过scope获取行中的列值 -->
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handlePermission(scope.row.id)">分配权限</el-button>
          <el-button size="mini" type="success" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger"  @click="handleDelete(scope.row.id)">删除</el-button>
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
    <!-- 编辑角色组件 -->
    <role-edit :title="edit.title" :dialogVisible="edit.dialogVisible" 
    :pojo="edit.pojo" :remoteClose="remoteClose"/>
    <!-- 设置权限的组件 -->
    <role-permission :title="permission.title" :dialogVisible="permission.dialogVisible" 
    :remoteClose="remotePermissonClose" :roleId="permission.roleId"/>
  </div>
</template>

<script>
import roleApi from '@/api/role';
import RoleEdit from './roleEdit';
import RolePermission from './rolePermission';

const StatusOptions = [
  { value: '0', name: "停用" },
  { value: '1', name: "正常" }
];
export default  ({
  name:'DeviceManage',//和对应路由表中配置的name值一致
  // 当用户管理模块，将当前这个组件文件作为子组件时，进行接收父组件传递过来的属性
  props:{
      roleIds:{
        type: Array,
        default: null
      },
      saveUserRole:Function
  },
  data () {
    return {
      list:[],
      page:{//分页对象
        current:1,//当前页码
        size:10,//每页显示条数
        total:0//总记录数
      },
      query:{
        roleName:'',
        status:''
      },
      StatusOptions,
      edit:{
        title:'',
        dialogVisible: false,
        pojo:{id: null,
              status: '1',
              createUserID:'',
              createDate: new Date(),
              lastUserID: '',
              lastDate: null,
              roleName:'',
              remark:''
              }
      },
       permission:{
        title:'',
        dialogVisible: false,
        roleId:null,
        pojo:{id: null,
              status: '1',
              createUserID:'',
              createDate: new Date(),
              lastUserID: '',
              lastDate: null,
              roleId:'',
              menuId:'',
              }
      },
      //存储选中的对象
      checkedRoleList: []

    }
  },
  filters:{
    statusFilter(status){
      //0 停用，1正常
      const statusMap={'0':'danger', '1':'success'}
      return statusMap[status];
    },
    isStatus(value) {
      const obj = StatusOptions.find(obj => obj.value === value);
      return obj ? obj.name : null;
    }
  },
  created(){
    this.fetchData();

  },
  components: {RoleEdit,RolePermission},

  methods: {
    async fetchData(){
       const {data} = await roleApi.getList(this.query,this.page.current,this.page.size)
        this.list = data.records;
        this.page.total = data.total;
        // 列表有数据后，勾选角色,创建自定义方法checkedRoles，此处调用
        this.checkedRoles()
    },
    // 勾选角色
    checkedRoles(){
      // 特别注意，一定要在el-table组件中加上ref="dataTable"
      // 首先清空上一次选中的 
       this.$refs.multipleTable.clearSelection();
      if(this.roleIds.length !==0 ){
        // 循环出查询到的每个角色数据，并进行判断父组件的roleIds中的每个角色对象 
        this.list.forEach(item=>{
          // 匹配到了，则应选中
          if(this.roleIds.indexOf(item.id.toString()) !== -1){
            // 选中，对应传递的角色对象
            this.$refs.multipleTable.toggleRowSelection(item,true)
          }
        })

      }

    },
    handleEdit(id) {
      roleApi.getById(id).then(response=>{
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
          roleApi.deleteById(id).then(response=>{
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
              status: '1',
              createUserID:'',
              createDate: new Date(),
              lastUserID: '',
              lastDate: null,
              roleName:'',
              remark:''
              }
      this.edit.dialogVisible = false
      this.fetchData()

    },
    // 打开新增
    openAdd(){
      this.edit.title='新增'
      this.edit.dialogVisible = "true"
    },
    handlePermission(id){
      // 分配权限
      this.permission.title = "分配权限"
      // 将点击的那个角色ID传递给子组件，进行查询当前角色拥有的菜单IDS
      this.permission.roleId= id
      this.permission.dialogVisible = true

    },
    remotePermissonClose(){
      this.permission.dialogVisible = false
      this.permission.roleId = null
      this.fetchData()

    },
    // 收集被选中的角色
     handleSelectionChange(val) {
        console.log(val);
        // val是选中的每个对象，将选中的对象封装到这个val数组中
        this.checkedRoleList = val
      },
    // 点击设置角色按钮触发该方法
    handleUserRole(){
      // 存放选中的角色id，并以数组的方式保存
      const checkedRoleIds = []
      this.checkedRoleList.forEach(item=>{
         checkedRoleIds.push(item.id)
      })
      // 触发父组件的事件函数
      this.$emit('saveUserRole',checkedRoleIds)
    }
  },
  watch:{
    roleIds(){
      this.query = {
        roleName:'',
        status:''
        }
      this.queryData()

    }
  }
})
</script>

<style scoped>
</style>