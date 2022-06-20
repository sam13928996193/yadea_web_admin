<template>
  <div class="app-container" >
       <!-- 多条件查询 -->
    <el-form :inline="true" :model="query" class="demo-form-inline" size="mini">
      <el-form-item >
        <el-select clearable v-model="query.partCategoryID"  placeholder="零件类型" style="width:110px">
          <el-option
            v-for="item in partCategoryOptions"
            :key="item.ID"
            :label="item.partCategoryCode"
            :value="item.ID">
          </el-option>
        </el-select>
      </el-form-item >
      <el-form-item >
        <el-select clearable v-model="query.partID"  placeholder="零件" style="width:110px">
          <el-option
            v-for="item in partOptions"
            :key="item.ID"
            :label="item.partName"
            :value="item.ID">
          </el-option>
        </el-select>
      </el-form-item >
      <el-form-item >
         <el-select clearable v-model="query.faultCategoryID"  placeholder="故障类型" style="width:160px">
          <el-option
            v-for="item in faultCategoryOptions"
            :key="item.ID"
            :label="item.faultCategoryName"
            :value="item.ID">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-input v-model="query.faultCode" placeholder="故障码"></el-input>
      </el-form-item>
      <el-form-item >
        <el-input v-model="query.faultName" placeholder="故障描述"></el-input>
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
 
  <!-- <el-row type="flex" class="row-bg"> -->
    <el-row type="flex" class="row-bg" >
   <el-container style=" border: 1px solid #eee;margin-right:10px" >
       <!-- 零件类型故障列表 -->
         <!-- 车型配置树 -->
    <el-aside width="250px" style="background-color: rgb(238, 241, 246);">
       <h5 style="text-align:center; color:#909399">零件及故障类型</h5>
      <el-menu class="el-menu-vertical-demo" style="height: 100%;" unique-opened="true">
         <div v-for="(item,index) in treeList" :index="index"  :key="index">
              <!-- id如果是数字加上'' -->
              <el-submenu :index="item.ID"  @click.native="openMenu(item,index)">
                <template slot="title">
                  
                  <span slot="title">{{item.partCategoryCode}}
                    <span v-if="item.children.length !=0"> ({{item.children.length}})</span>
                  </span>    
                </template>
                <!-- @click.stop 外层包个div ,阻止点击事件冒泡 -->
                <div v-if="item.children.length!=0"  @click.stop>
                   <div v-for="(item1,index1) in item.children" :index="index1"  :key="index1">
                      <!-- id如果是数字加上'' -->
                   <el-submenu :index="item1.ID"  @click.native="openMenu1(item1,index1)" >
                      
                    <template slot="title">
           
                      <span slot="title">{{item1.partName}}
                        <span v-if="item1.children.length !=0"> ({{item1.children.length}})</span>
                      </span>    
                    </template>
                   
                    <div v-if="item1.children.length!=0"  @click.stop>
                      <el-menu-item 
                          v-for="(subItem,i) in item1.children" 
                          :index="subItem.id" 
                          :key="i"
                          @click.native="openFaultCategory(subItem,subItem.ID)"
                        >
                      <span slot="title">{{subItem.faultCategoryName}}</span>
                    </el-menu-item>
                    </div> 
                  </el-submenu>  
                  </div>       
           
                </div>       
            </el-submenu>
        </div>
      </el-menu>
    </el-aside>
      
      
      <el-main>
        <!-- 数据列表 -->
        <el-table :data="list" stripe border style="width: 100%">
          <el-table-column type="index" label='序' width="40"></el-table-column>
           <el-table-column
              prop="partCategoryName"
              label="零件类型"
              align="center"
              width="180">
          </el-table-column>
          <el-table-column
              prop="faultCategoryName"
              label="故障类型"
              align="center"
              width="100">
          </el-table-column>
          <el-table-column
              prop="faultCode"
              label="故障码"
              align="center"
              width="100">
          </el-table-column>
         <el-table-column
              prop="faultName"
              label="显示标识"
              align="center"
              width="100">
          </el-table-column>
         <el-table-column
              prop="grade"
              label="故障等级"
              align="center"
              width="80">
          </el-table-column>
          <el-table-column
              prop="action"
              label="故障现象"
              align="center"
              width="120">
          </el-table-column>
          <el-table-column
              prop="possible"
              label="故障原因"
              align="center"
              width="120">
          </el-table-column>
          <el-table-column
              prop="lamp"
              label="故障灯"
              align="center"
              width="120">
          </el-table-column>
          <el-table-column
              prop="frequency"
              label="故障频率"
              align="center"
              width="120">
          </el-table-column>
          <el-table-column
              prop="preCondition"
              label="前提条件"
              align="center"
              width="120">
          </el-table-column>
          <el-table-column
              prop="matureCondition"
              label="成熟条件"
              align="center"
              width="120">
          </el-table-column> 
          <el-table-column
              prop="relieveConditon"
              label="解除条件"
              align="center"
              width="120">
          </el-table-column> 
          <el-table-column
              prop="clearCondition"
              label="清除条件"
              align="center"
              width="120">
          </el-table-column> 
          <el-table-column
              prop="repairMethod"
              label="维修指引"
              align="center"
              width="120">
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
                <el-button size="mini" type="success" @click="handleEdit(scope.row.ID)">编辑</el-button>
                <el-button size="mini" type="danger"  @click="handleDelete(scope.row.ID)">删除</el-button>
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
    :pojo="edit.pojo" :partCategoryOptions="partCategoryOptions" :faultCategoryOptions="faultCategoryOptions" :remoteClose="remoteClose"/>
    
  </div>
</template>

<script>
import faultApi from '@/api/fault';
import faultCategoryApi from '@/api/faultCategory';
import partCategoryApi from '@/api/partcategory';
import partApi from '@/api/part'

import Edit from '@/views/fault/edit';


const StatusOptions = [
  { value: '0', name: "注销" },
  { value: '1', name: "有效" }
  
];
export default ({
  name:'FaultManage',//和对应路由表中配置的name值一致

  data () {
    return {
       treeList:[],
       list:[],
       partCategoryOptions:[],
       partOptions:[],
       faultCategoryOptions:[],
       page:{//分页对象
        current:1,//当前页码
        size:10,//每页显示条数
        total:0//总记录数
      },
      query:{
        status:'',
        partCategoryID:'',
        partID:'',
        faultCategoryID:'',
        faultCode:'',
        faultName:'',
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
                partCategoryID:'',
                partID:'',
                partCode:'',
                partName:'',
                faultCategoryID:'',
                faultCode:'',
                faultName:'',
                grade:'',
                action:'',
                possible:'',
                lamp:'',
                frequency:'',
                preCondition:'',
                matureCondition:'',
                relieveConditon:'',
                clearCondition:'',
                repairMethod:'',
                status:'1',
                remark:'',
                
              },
          currentpartCategoryID:'',
          currentfaultCategoryID:'',
          currentfaultCategoryCode:'',
          currentfaultCategoryName:''
        }
    }
  },
  created(){
    this.fetchTreeData();
    this.fetchData();
    this.getPartNormalList()
    this.getPartCategoryNormalList()
    this.getFaultCategoryNormalList()
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
     // 刷新左边树形车系车型
      async fetchTreeData(){
          const {data} = await faultCategoryApi.getListTree();
          this.treeList=data
      },
    fetchData(){
      faultApi.getList(this.query,this.page.current,this.page.size).then(response=>{
        this.list = response.data.records;
        this.page.total = response.data.total;
      })
    },
    // 获取零件类型下拉数据
    getPartCategoryNormalList(){
        partCategoryApi.getNormalList().then(response=>{
          this.partCategoryOptions = response.data.records;
        })
      },
    // 获取零件类型下拉数据
    getPartNormalList(){
        partApi.getNormalList().then(response=>{
          this.partOptions = response.data.records;
        })
      },
    // 获取故障类型下拉数据
    getFaultCategoryNormalList(){
      faultCategoryApi.getNormalList().then(response=>{
        
        this.faultCategoryOptions = response.data.records;
      })
    },
    //根据零件类别获取零件信息
    getBypartCategoryID(id){
      partApi.getBypartCategoryID(id).then(response=>{
        console.log(response.data)
        this.partOptions =  response.data;
      })
    },
     openMenu(item,index){
        this.query.partCategoryID=item.ID
        this.edit.currentpartCategoryID=item.ID
        this.edit.currentpartCategoryCode=item.partCategoryCode
        this.edit.currentpartCategoryName=item.partCategoryName
        this.query.partID=''
        this.edit.currentPartID=''
        this.query.faultCategoryID=''
        this.query.faultCategoryCode=''
        this.query.faultCategoryName=''
        this.edit.currentfaultCategoryID=''
        this.edit.currentfaultCategoryCode=''
        this.edit.currentfaultCategoryName=''
        this.fetchData()
        this.getBypartCategoryID(item.ID)
      },
      openMenu1(subItem,index){
        this.query.partID=subItem.ID
        this.query.partCode=subItem.partCode
        this.query.partName=subItem.partName
        this.edit.currentpartID=subItem.ID
        this.edit.currentpartCode=subItem.partCode
        this.edit.currentpartName=subItem.partName
        this.fetchData()
      },
      openFaultCategory(subItem,index){
        this.query.faultCategoryID=subItem.ID
        this.query.faultCategoryCode=subItem.faultCategoryCode
        this.query.faultCategoryName=subItem.faultCategoryName
        this.edit.currentfaultCategoryID=subItem.ID
        this.edit.currentfaultCategoryCode=subItem.faultCategoryCode
        this.edit.currentfaultCategoryName=subItem.faultCategoryName
        this.fetchData()
      },


    handleEdit(id) {
      faultApi.getById(id).then(response=>{
       if(response.code===20000){
          console.log('edit.pojo',response.data)
          this.edit.pojo = response.data;
          this.edit.title = '编辑'
          this.edit.dialogVisible = true
          if(this.edit.pojo.partCode.length===0){
            this.edit.pojo.faultCategoryID=this.edit.currentfaultCategoryID
            this.edit.pojo.faultCategoryCode=this.edit.currentfaultCategoryCode
            this.edit.pojo.faultCategoryName=this.edit.currentfaultCategoryName
          }
        
        }
      })
    },
    handleDelete(id) {
      this.$confirm('确认删除这条记录吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          faultApi.deleteById(id).then(response=>{
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
                partCategoryID:'',
                partID:'',
                partCode:'',
                partName:'',
                faultCategoryID:'',
                faultCode:'',
                faultName:'',
                grade:'',
                action:'',
                possible:'',
                lamp:'',
                frequency:'',
                preCondition:'',
                matureCondition:'',
                relieveConditon:'',
                clearCondition:'',
                repairMethod:'',
                status:'1',
                remark:'',
                
              }
      this.edit.dialogVisible = false
      this.fetchData()
    },
    // 打开新增
    openAdd(){
       if (this.edit.currentpartCategoryID.length ===0){
         this.$alert('请先选择零件类型', {
          confirmButtonText: '确定'
        });
        return
      }

      if (this.edit.currentfaultCategoryID.length ===0){
         this.$alert('请先选择故障类型', {
          confirmButtonText: '确定'
        });
        return
      }
      this.edit.title='新增'
      this.edit.dialogVisible = "true"
      this.edit.pojo.partCategoryID=this.edit.currentpartCategoryID
      this.edit.pojo.partCategoryCode=this.edit.currentpartCategoryCode
      this.edit.pojo.partCategoryName=this.edit.currentpartCategoryName
      this.edit.pojo.partID=this.edit.currentpartID
      this.edit.pojo.partCode=this.edit.currentpartCode
      this.edit.pojo.partName=this.edit.currentpartName
   
      this.edit.pojo.faultCategoryID=this.edit.currentfaultCategoryID
      this.edit.pojo.faultCategoryCode=this.edit.currentfaultCategoryCode
      this.edit.pojo.faultCategoryName=this.edit.currentfaultCategoryName
    },
    handleCurrentChangePartCategory(val){
      console.log(val)
      this.query.partCategoryID =val.ID
      this.edit.pojo.partCategoryID = val.ID
      this.edit.currentpartCategoryID = val.ID
      this.edit.currentpartCategoryCode = val.partCategoryCode
      this.edit.currentpartCategoryName = val.partCategoryName
      this.fetchData()

    }

  }
})
</script>

<style scoped>
</style>