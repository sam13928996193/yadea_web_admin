<template>
  <div class="app-container" >
       <!-- 多条件查询 -->
    <el-form :inline="true" :model="query" class="demo-form-inline" size="mini">
      <el-form-item >
        <el-select clearable v-model="query.vehicleSeriesID"  placeholder="请选择车系">
          <el-option
            v-for="item in vehicleSeriesOptions"
            :key="item.id"
            :label="item.vehicleSeriesName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
        <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="openAdd" >新增</el-button>
      </el-form-item>
  </el-form>
 
  <!-- <el-row type="flex" class="row-bg"> -->
    <el-row type="flex" class="row-bg" >

      <!-- 车系数据列表左侧栏 --> 
      <el-container style=" border: 1px solid #eee;margin-right:10px" >
      <el-aside width="200px">
        <el-table :data="vehicleSeriesOptions"  border style="width: 190px"   highlight-current-row
        @current-change="handleCurrentChangeVehicleSeries">   
            <el-table-column
                prop="vehicleSeriesName"
                label="车系选择"
                align="center"
                width="180">
            </el-table-column>
        
        </el-table>
      </el-aside>
        
     
      <el-main>
        <!-- 数据列表 -->
        <el-table :data="list" stripe border style="width: 100%">
          <el-table-column type="index" label='序' width="40"></el-table-column>
           <el-table-column
              prop="vehicleSeriesName"
              label="车系"
              align="center"
              width="180">
          </el-table-column>
          <el-table-column
              prop="partCategoryCode"
              label="系统编号"
              align="center"
              width="100">
          </el-table-column>
          <el-table-column
              prop="partCategoryName"
              label="车型名称"
              align="center"
              width="180">
          </el-table-column>
          
         
          <el-table-column prop="status" center label="状态" align="center" width="80">
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
              width="200px">  
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
      </el-main>
      </el-container>
    </el-row>
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
    :pojo="edit.pojo" :vehicleSeriesOptions="vehicleSeriesOptions" :partCategoryOptions="partCategoryOptions" :remoteClose="remoteClose"/>
    
  </div>
</template>

<script>
import partCategoryApi from '@/api/partcategory';
import vehicleSeriesApi from '@/api/vehicleSeries';
import vsPartCategoryApi from '@/api/vsPartCategory';

import Edit from '@/views/vsPartCategory/edit';


const StatusOptions = [
  { value: '0', name: "注销" },
  { value: '1', name: "有效" }
  
];
export default ({
  name:'VehicleModel',//和对应路由表中配置的name值一致

  data () {
    return {
       
       list:[],
       vehicleSeriesOptions:[],
       partCategoryOptions:[],
       page:{//分页对象
        current:1,//当前页码
        size:10,//每页显示条数
        total:0//总记录数
      },
      query:{
        vehicleSeriesID:''
      },
      StatusOptions,
      edit:{
          title:'',
          dialogVisible: false,
          pojo:{ID: null,
                status: '1',
                createUserID:'',
                createDate: new Date(),
                lastUserID: '',
                lastDate: null,
                sortID:'',
                vehicleSeriesID:'',
                partCategoryID:'',
                remark:''
       
              },
          currentvehicleSeriesID:''
        }
    }
  },
  created(){
    this.fetchData();
    this.getVehicleSeriesNormalList()
    this.getPartCategoryNormalList()
  },
  filters:{
    statusFilter(status){
      //0 注销，1有效
      const statusMap={'0':'danger', '1':'success'}
      return statusMap[status];
    },
    isStatus(value) {
      const obj = StatusOptions.find(obj => obj.value === value);
      return obj ? obj.name : null;
    }
  },
  components: {Edit},
  methods: {
    fetchData(){
      vsPartCategoryApi.getList(this.query,this.page.current,this.page.size).then(response=>{
        this.list = response.data.records; 
        this.page.total = response.data.total;
      })
    },
    getVehicleSeriesNormalList(){
      vehicleSeriesApi.getNormalList().then(response=>{
        this.vehicleSeriesOptions = response.data.records;
      })
    },
    //获取零件类别选择
    getPartCategoryNormalList(){
        partCategoryApi.getNormalList().then(response=>{
        this.partCategoryOptions = response.data.records;
      })
      },

    handleEdit(id) {
      vsPartCategoryApi.getById(id).then(response=>{
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
          vsPartCategoryApi.deleteById(id).then(response=>{
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
      this.edit.pojo = {ID: null,
                status: '1',
                createUserID:'',
                createDate: new Date(),
                lastUserID: '',
                lastDate: null,
                sortID:'',
                vehicleSeriesID:'',
                partCategoryID:'',
                remark:''
              }
      this.edit.dialogVisible = false
      this.fetchData()
    },
    // 打开新增
    openAdd(){
      this.edit.title='新增'
      this.edit.dialogVisible = "true"
      this.edit.pojo.vehicleSeriesID=this.edit.currentvehicleSeriesID
    },
    handleCurrentChangeVehicleSeries(val){
      
      this.query.vehicleSeriesID =val.id
      this.edit.pojo.vehicleSeriesID = val.id
      this.edit.currentvehicleSeriesID = val.id
      this.fetchData()

    }

  }
})
</script>

<style scoped>
</style>