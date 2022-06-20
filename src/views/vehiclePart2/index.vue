<template>

  <div class="app-container" >
       <!-- 多条件查询 -->
    <el-form :inline="true" :model="query" class="demo-form-inline" size="mini">
    <!-- 选择车系 -->
      <el-form-item >
        <el-select clearable v-model="query.vehicleSeriesID"  placeholder="请选择车系">
          <el-option
            v-for="item in vehicleSeriesOptions"
            :key="item.id"
            :label="item.vehicleSeriesName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item >
     <!-- 选择车型 -->
      <el-form-item >
        <el-select clearable v-model="query.vehicleModelID"  placeholder="请选择车型">
          <el-option
            v-for="item in vehicleModelOptions"
            :key="item.id"
            :label="item.vehicleModelName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item >
      <!-- 选择车型配置 -->
      <el-form-item >
        <el-select clearable v-model="query.vehicleConfigID"  placeholder="请选择车型配置">
          <el-option
            v-for="item in vehicleConfigOptions"
            :key="item.id"
            :label="item.vehicleConfigName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item >
     <!-- 选择零件类别 -->
     <el-form-item >
        <el-select clearable v-model="query.partCategoryID"  placeholder="请选择零件类型">
          <el-option
            v-for="item in partCategoryOptions"
            :key="item.ID"
            :label="item.partCategoryCode"
            :value="item.ID">
          </el-option>
        </el-select>
      </el-form-item >
    <!-- 选择零件 -->
     <el-form-item >
        <el-select clearable v-model="query.partId"  placeholder="请选择零件">
          <el-option
            v-for="item in partOptions"
            :key="item.id"
            :label="item.partName"
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

    <el-container style="height:100%; border: 1px solid #eee">
    <!-- 车型配置树 -->
    <el-aside width="200px" style="background-color: rgb(238, 241, 246);">
       <h5 style="text-align:center; color:#909399">车系和车型</h5>
      <el-menu class="el-menu-vertical-demo" style="height: 100%;" unique-opened="true">
         <div v-for="(item,index) in treeList" :index="index"  :key="index">
              <!-- id如果是数字加上'' -->
              <el-submenu :index="item.id"  @click.native="openMenuSeries(item,index)">
                <template slot="title">
                  <i :class="item.fileUrl"></i>
                  <span slot="title">{{item.vehicleSeriesName}}
                    <span v-if="item.children.length !=0"> ({{item.children.length}})</span>
                  </span>    
                </template>
                <!-- @click.stop 外层包个div ,阻止点击事件冒泡 -->
                <div v-if="item.children.length!=0"  @click.stop>
                   <div v-for="(item1,index1) in item.children" :index="index1"  :key="index1">
                      <!-- id如果是数字加上'' -->
                   <el-submenu :index="item1.id"  @click.native="openMenuModel(item1,index1)" >
                      
                    <template slot="title">
                      <i :class="item1.fileUrl"></i>
                      <span slot="title">{{item1.vehicleModelName}}
                        <span v-if="item1.children.length !=0"> ({{item1.children.length}})</span>
                      </span>    
                    </template>
                   
                    <div v-if="item1.children.length!=0"  @click.stop>
                      <el-menu-item 
                          v-for="(subItem,i) in item1.children" 
                          :index="subItem.id" 
                          :key="i"
                          @click.native="openMenuConfig(subItem,subItem.id)"
                        >
                      <span slot="title">{{subItem.vehicleConfigName}}</span>
                    </el-menu-item>
                    </div> 
                  </el-submenu>  
                  </div>       
           
                </div>       
            </el-submenu>
        </div>
      </el-menu>
    </el-aside>

 
    <el-aside width="200px">
        <el-table :data="partCategoryOptions"  border style="width: 190px"   highlight-current-row
        @current-change="handleCurrentChangePartCategory" >  
            <el-table-column
                prop="partCategoryCode"
                label="零件类型"
                align="center"
                width="180" >
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
              prop="vehicleModelName"
              label="车型"
              align="center"
              width="100">
          </el-table-column>
          <el-table-column
              prop="vehicleConfigName"
              label="配置"
              align="center"
              width="100">
          </el-table-column>
           <el-table-column
              prop="partCategoryName"
              label="零件类型"
              align="center"
              width="100">
          </el-table-column>
          <el-table-column
              prop="partName"
              label="零件名称"
              align="center"
              width="180">
          </el-table-column>

          <el-table-column
              prop="checkID"
              label="检测Id"
              align="center"
              width="180">
          </el-table-column>
          <el-table-column
              prop="fileVersion"
              label="版本"
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
            <el-table-column label="操作" width="220">
              <!-- scope指当前行的数据对象，可以通过scope获取行中的列值 -->
              <template slot-scope="scope" >
                <el-button size="mini" type="primary" @click="handleCheck(scope.row.id)">审核</el-button>
                <el-button size="mini" type="success" @click="handleEdit(scope.row.id)">编辑</el-button>
                <el-button size="mini" type="danger"  @click="handleDelete(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>


        </el-table>
      </el-main>
    </el-container>

  <edit :title="edit.title" :dialogVisible="edit.dialogVisible" 
    :pojo="edit.pojo" :vehicleSeriesOptions="vehicleSeriesOptions" :vehicleModelOptions="vehicleModelOptions" :vehicleConfigOptions="vehicleConfigOptions" :partCategoryOptions="partCategoryOptions"  :partFilterOptions="partFilterOptions" :remoteClose="remoteClose"/>
  </div>
</template>

<script>
import partCategoryApi from '@/api/partcategory';
import partApi from '@/api/part';
import vehicleModelApi from '@/api/vehicleModel';
import vehicleSeriesApi from '@/api/vehicleSeries';
import vehicleConfigApi from '@/api/vehicleConfig';
import vehiclePartApi from '@/api/vehiclePart2';

import Edit from './edit';
const StatusOptions = [
  { value: '0', name: "注销" },
  { value: '1', name: "有效" }
  
];
export default {
    name:'VehiclePart2',//和对应路由表中配置的name值一致

  data () {
    return {
       containerHeight:{
            height: ""   
       },
       treeList:[],
       list:[],
       vehicleSeriesOptions:[],
       vehicleModelOptions:[],
       vehicleConfigOptions:[],
       partCategoryOptions:[],
       partOptions:[],
       partFilterOptions:[],
       page:{//分页对象
        current:1,//当前页码
        size:10,//每页显示条数
        total:0//总记录数
      },
      query:{
        partCategoryID:'',
        partID:'',
        vehicleSeriesID:'',
        vehicleModelID:'',
        vehicleConfigID:'',
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
                lastDate: '',
                sortID:'',
                vehicleSeriesID:'',
                vehicleModelID:'',
                partCategoryID:'',
                partID:null,
                remark:'',
              },
          currentVehicleSeriesID:'',
          currentVehicleModelID:'',
          currentVehicleConfigID:'',
          currentPartCategoryID:'',
          
        }
    }
  },

  components: {Edit},
    filters:{
    statusFilter(status){
      //0 停用，1有效
      const statusMap={'0':'danger', '1':'success'}
      return statusMap[status];
    },
    isStatus(value) {
      const obj = StatusOptions.find(obj => obj.value === value);
      return obj ? obj.name : null;
    }
  },
  created(){
      this.fetchTreeData()
       this.getPartCategoryNormalList()
       this.getVehicleSeriesNormalList()
       this.getVehicleModelNormalList()
       this.getVehicleConfigNormalList()
       this.getPartNormalList()
       this.fetchData()
    },
  methods: {
    // 刷新左边树形车系车型
      async fetchTreeData(){
          const {data} = await vehicleConfigApi.getListTree();
          console.log(data);
          this.treeList=data
      },
      //刷新左边零件类别
       getPartCategoryNormalList(){
         partCategoryApi.getNormalList().then(response=>{
        this.partCategoryOptions = response.data.records;

      })
    },
  
    
    // 給车系查询赋值下拉
    getVehicleSeriesNormalList(){
      vehicleSeriesApi.getNormalList().then(response=>{
        this.vehicleSeriesOptions = response.data.records;
      })
    },
    //获取车型下拉数据
    // 給车系查询赋值下拉
    getVehicleModelNormalList(){
      vehicleModelApi.getNormalList().then(response=>{
        this.vehicleModelOptions = response.data.records;
      })
    },
    // 給车系查询赋值下拉
    getVehicleConfigNormalList(){
      vehicleConfigApi.getNormalList().then(response=>{
        this.vehicleConfigOptions = response.data.records;
      })
    },
    getPartNormalList(){
        partApi.getNormalList().then(response=>{
          this.partOptions = response.data.records;
        })
      },
    getPartBypartCategoryID(id){
      partApi.getBypartCategoryID(id).then(response=>{
        this.partFilterOptions = response.data;
      })
    },
    openMenuSeries(item,index){
        this.query.vehicleSeriesID=item.ID
        this.query.vehicleModelID=''
        this.query.vehicleConfigID=''
        this.query.partCategoryID=''
        this.query.partID=''
        this.edit.currentVehicleSeriesID=item.ID
        this.edit.currentVehicleModelID=''
        this.edit.currentVehicleConfigID=''
        this.edit.currentPartCategoryID=''
        // this.fetchData()
      },
      openMenuModel(subItem,index){
        this.query.vehicleSeriesID=subItem.vehicleSeriesID
        this.query.vehicleModelID=subItem.ID
        this.query.vehicleConfigID=''
        this.query.partCategoryID=''
        this.query.partID=''
        this.edit.currentVehicleModelID=subItem.ID
        this.edit.currentVehicleConfigID=''
        this.edit.currentPartCategoryID=''

        this.fetchData()
      },
      openMenuConfig(subItem,index){
        this.query.vehicleSeriesID=subItem.vehicleSeriesID
        this.query.vehicleModelID=subItem.vehicleModelID
        this.query.vehicleConfigID=subItem.ID
        this.query.partCategoryID=''
        this.query.partID=''
        this.edit.currentVehicleSeriesID=subItem.vehicleSeriesID
        this.edit.currentVehicleModelID=subItem.vehicleModelID
        this.edit.currentVehicleConfigID=subItem.ID
        this.edit.currentPartCategoryID=''

        this.fetchData()
      },
      handleCurrentChangePartCategory(val){
      this.query.partCategoryID =val.ID
      this.edit.currentPartCategoryID = val.ID
      this.query.partId =''
      this.fetchData()
 
      },
      partCategoryClicked(val){
      console.log('click',val)
      },
      fetchData(){
        vehiclePartApi.getList(this.query,this.page.current,this.page.size).then(response=>{
        this.list = response.data.records;
        this.page.total = response.data.total;
      }) },
      // 子组件会触发此事件方法来关闭窗口
    remoteClose(){
      this.edit.pojo = {id: null,
                status: '1',
                createUserID:'',
                createDate: new Date(),
                lastUserID: '',
                lastDate: '',
                sortID:'',
                vehicleSeriesID:this.edit.currentvehicleSeriesID,
                vehicleModelID:this.edit.currentvehicleModelID,
                partCategoryID:this.edit.currentpartCategoryID,
                partID:null,
                remark:'',
              }
      this.edit.dialogVisible = false
      this.fetchData()
    },
       // 打开新增
     openAdd(){
      if (this.edit.currentVehicleSeriesID.length ===0){
         this.$alert('请点击车系', '车系选择提示', {
          confirmButtonText: '确定'
        });
        return
      }
      if (this.edit.currentVehicleModelID.length ===0){
         this.$alert('请点击车型', '车型选择提示', {
          confirmButtonText: '确定'
        });
        return
      }
      if (this.edit.currentPartCategoryID.length ===0){
         this.$alert('请选择零件类别', '零件类别选择提示', {
          confirmButtonText: '确定'
        });
        return
      }
       this.edit.pojo.partCategoryID=this.edit.currentPartCategoryID
      this.edit.pojo.vehicleSeriesID = this.edit.currentVehicleSeriesID
      this.edit.pojo.vehicleModelID = this.edit.currentVehicleModelID
      this.edit.pojo.vehicleConfigID = this.edit.currentVehicleConfigID
      this.edit.title='新增'
      this.edit.dialogVisible = "true"

     
      this.getPartBypartCategoryID(this.edit.pojo.partCategoryID)
    },

    handleEdit(id) {
 
      vehiclePartApi.getById(id).then(response=>{
       if(response.code===20000){
          this.edit.pojo = response.data;
          this.edit.title = '编辑'
          this.edit.dialogVisible = true
          this.getPartBypartCategoryID(this.edit.pojo.partCategoryId)

        }
      })
    },
       handleDelete(id) {
      this.$confirm('确认删除这条记录吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          vehiclePartApi.deleteById(id).then(response=>{
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
  }
}
</script>

<style scoped>
</style>