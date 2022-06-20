<template>
  <div class="app-container" >
 
      <!-- 多条件查询 -->
    <el-form :inline="true" :model="query" class="demo-form-inline" size="mini">
      <el-form-item >
        <el-input v-model.trim="query.repairShopCode" placeholder="维修店编号" ></el-input>
      </el-form-item>
      <el-form-item >
        <el-input v-model="query.repairShopName" placeholder="维修店名称"></el-input>
      </el-form-item>
      <el-form-item >
        <el-select clearable v-model="query.agentID"  placeholder="请选择经销商">
          <el-option
            v-for="item in AgentOptions"
            :key="item.id"
            :label="item.agentName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item >
      <el-form-item label="状态" placeholder="状态">
        <el-select v-model="query.status" clearable filterable style="width:85px">
          <el-option v-for="item in StatusOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>     
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
        <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="openAdd" >新增</el-button>
      </el-form-item>
  </el-form>
    <!-- 数据列表 -->
    <el-table :data="list" stripe border style="width: 100%">
      <el-table-column type="index" label='序号' width="40"></el-table-column>
      <el-table-column
          prop="repairShopCode"
          label="维修店编号"
          align="center"
          width="100">
      </el-table-column>
      <el-table-column
          prop="repairShopName"
          label="维修店名称"
          align="center"
          width="120">
      </el-table-column>
      <el-table-column
          prop="agentName"
          label="上级经销商"
          align="center"
          width="120">
      </el-table-column>
      <el-table-column
          prop="createDate"
          label="创建日期"
          align="center"
          width="100">
      </el-table-column>
      <el-table-column
          prop="linkmen"
          label="联系人"
          align="center"
          width="70px"
        >    
      </el-table-column>
      <el-table-column
          prop="phone"
          label="联系电话"
          align="center"
          width="120px">  
      </el-table-column>
      <el-table-column
          prop="email"
          label="邮箱"
          align="center">  
      </el-table-column>  
      <el-table-column
          prop="address"
          label="地址"
          align="center">  
      </el-table-column> 
      <el-table-column prop="status" center label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">
            <span>{{ scope.row.status | isStatus }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="remark"
          label="备注"
          align="center"
          width="80px">  
      </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="180">
          <!-- scope指当前行的数据对象，可以通过scope获取行中的列值 -->
          <template slot-scope="scope">
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
    
    <repairshop-edit :title="edit.title" :dialogVisible="edit.dialogVisible" 
    :pojo="edit.pojo" :AgentOptions="AgentOptions" :remoteClose="remoteClose"/>
    
  </div>
</template>

<script>
import repairShopApi from '@/api/repairShop';
import agentApi from '@/api/agent';

import RepairshopEdit from '@/views/repairshop/repairshopEdit';


const StatusOptions = [
  { value: '0', name: "注销" },
  { value: '1', name: "有效" }
  
];
export default ({
  name:'repairShop',//和对应路由表中配置的name值一致

  data () {
    return {
       
       list:[],
       AgentOptions:[],
       page:{//分页对象
        current:1,//当前页码
        size:10,//每页显示条数
        total:0//总记录数
      },
      query:{
        repairShopCode:'',
        repairShopName:'',
        status:'',
        agentID:''
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
                repairShopCode:'',
                repairShopName:'',
                linkmen:'',
                phone:'',
                email:'',
                address:'',
                remark:'',
                agentID:''
              }
        }
    }
  },
  created(){
    this.fetchData();
    this.getAgentNormalList()
  },
  filters:{
    statusFilter(status){
      //0 注销，1有效
      const statusMap={'0':'danger', '1':'success', '2':'warning'}
      return statusMap[status];
    },
    isStatus(value) {
      const obj = StatusOptions.find(obj => obj.value === value);
      return obj ? obj.name : null;
    }
  },
  components: {RepairshopEdit},
  methods: {
    fetchData(){
      repairShopApi.getList(this.query,this.page.current,this.page.size).then(response=>{
        console.log(response);
        this.list = response.data.records;
        this.page.total = response.data.total;
      })
    },
    getAgentNormalList(){
      agentApi.getNormalList().then(response=>{
        console.log(response.data);
        this.AgentOptions = response.data.records;

      })

    },

    handleEdit(id) {
      repairShopApi.getById(id).then(response=>{
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
          repairShopApi.deleteById(id).then(response=>{
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
                repairShopCode:'',
                repairShopName:'',
                linkmen:'',
                phone:'',
                email:'',
                address:'',
                remark:'',
                agentID:''
              }
      this.edit.dialogVisible = false
      this.fetchData()
    },
    // 打开新增
    openAdd(){
      this.edit.title='新增'
      this.edit.dialogVisible = "true"
    }

  }
})
</script>

<style scoped>
</style>