<template>
  <div class="app-container" >
      <!-- 多条件查询 -->
    <el-form :inline="true" :model="query" class="demo-form-inline" size="mini">
      <el-form-item >
        <el-input v-model.trim="query.vehicleSeriesCode" placeholder="车系编号" ></el-input>
      </el-form-item>
      <el-form-item >
        <el-input v-model="query.vehicleSeriesName" placeholder="车系名称"></el-input>
      </el-form-item>
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
    <el-table-column type="index" label='序号' width="50"></el-table-column>
    <el-table-column
        prop="vehicleSeriesCode"
        label="车系编号"
        align="center"
        width="180">
    </el-table-column>
    <el-table-column
        prop="vehicleSeriesName"
        label="车系描述"
        align="center"
        width="180">
    </el-table-column>
     <el-table-column align="center" prop="fileUrl" label="车系图标">
        <template slot-scope="scope">
          <el-image
            style="width: 90px; height: 60px"
            :src="scope.row.fileUrl"
            :preview-src-list="[scope.row.fileUrl]"
          />
        </template>
      </el-table-column>
     
    <el-table-column prop="status" center label="状态" align="center">
      <template slot-scope="scope">
        <el-tag :type="scope.row.status | statusFilter">
           <span>{{ scope.row.status | isStatus }}</span>
        </el-tag>
      </template>
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
    <edit :title="edit.title" :dialogVisible="edit.dialogVisible" 
    :pojo="edit.pojo" :remoteClose="remoteClose"/>
  </div>
</template>

<script>
import vehicleSeriesApi from '@/api/vehicleSeries';

import Edit from './edit';

const StatusOptions = [
  { value: '0', name: "下线" },
  { value: '1', name: "正常" }
];
export default {
  name:'VehicleSeries',//和对应路由表中配置的name值一致
  data () {
    return {
      list:[],
      page:{//分页对象
        current:1,//当前页码
        size:10,//每页显示条数
        total:0//总记录数
      },
      query:{
        vehicleSeriesCode:'',
        vehicleSeriesName:'',
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
              vehicleSeriesName:'',
              vehicleSeriesCode:'',
              fileUrl:'',
              remak:''
              }
      }

    }
  },
  filters:{
    statusFilter(status){
      //0 注销，1正常，2维修
      const statusMap={'0':'danger', '1':'success', '2':'warning'}
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
  components: {Edit},

  methods: {
    fetchData(){
      vehicleSeriesApi.getList(this.query,this.page.current,this.page.size).then(response=>{
        console.log(response);
        this.list = response.data.records;
        this.page.total = response.data.total;
      })
    },
    handleEdit(id) {
      vehicleSeriesApi.getById(id).then(response=>{
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
          vehicleSeriesApi.deleteById(id).then(response=>{
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
              vehicleSeriesName:'',
              vehicleSeriesCode:'',
              fileUrl:'',
              remak:''
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
}
</script>

<style scoped>
</style>