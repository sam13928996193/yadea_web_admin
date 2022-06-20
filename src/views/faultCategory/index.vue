<template>
  <div class="app-container" >
       <!-- 多条件查询 -->
    <el-form :inline="true" :model="query" class="demo-form-inline" size="mini">
      <el-form-item >
        <el-select clearable v-model="query.partCategoryID"  placeholder="选择零件类型" style="width:120px">
          <el-option
            v-for="item in partCategoryOptions"
            :key="item.ID"
            :label="item.partCategoryCode"
            :value="item.ID">
          </el-option>
        </el-select>
      </el-form-item >
      <el-form-item >
        <el-select clearable v-model="query.partID"  placeholder="选择零件" style="width:120px">
          <el-option
            v-for="item in partOptions"
            :key="item.ID"
            :label="item.partName"
            :value="item.ID">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-input v-model.trim="query.faultCategoryCode" placeholder="故障类型编号" ></el-input>
      </el-form-item>
      <el-form-item >
        <el-input v-model="query.faultCategoryName" placeholder="故障类型名称"></el-input>
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
      <!-- 零件类型数据选择列表 --> 
      <el-container style=" border: 1px solid #eee;margin-right:10px" >
       <el-aside width="200px" style="background-color: rgb(238, 241, 246);">
      <el-menu class="el-menu-vertical-demo">
         <div v-for="(item,index) in partTreeList" :index="index"  :key="index">
              <!-- id如果是数字加上'' -->
              <el-submenu :index="item.id"  @click.native="openMenu(item,index)">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span slot="title">{{item.partCategoryCode}}
                    <span v-if="item.children.length !=0"> ({{item.children.length}})</span>
                  </span>    
                </template>
                <!-- @click.stop 外层包个div ,阻止点击事件冒泡 -->
                <div v-if="item.children.length!=0"  @click.stop>
                      <el-menu-item 
                          v-for="(subItem,i) in item.children" 
                          :index="subItem.id" 
                          :key="i"
                          @click.native="openMenu1(subItem,subItem.id)"
                        >
                      <span slot="title">{{subItem.partName}}</span>
                    </el-menu-item>               
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
              prop="faultCategoryCode"
              label="故障类型编号"
              align="center"
              width="100">
          </el-table-column>
          <el-table-column
              prop="faultCategoryName"
              label="故障类型名称"
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
    :pojo="edit.pojo" :partCategoryOptions="partCategoryOptions" :partOptions="partOptions" :remoteClose="remoteClose"/>
    
  </div>
</template>

<script>
import faultCategoryApi from '@/api/faultCategory';
import partCategoryApi from '@/api/partcategory';
import partApi from '@/api/part';

import Edit from '@/views/faultCategory/edit';


const StatusOptions = [
  { value: '0', name: "注销" },
  { value: '1', name: "有效" }
  
];
export default ({
  name:'FaultCategory',//和对应路由表中配置的name值一致

  data () {
    return {
       partTreeList:[],
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
        partCategoryID:'',
        partID:'',
        faultCategoryCode:'',
        faultCategoryName:'',
        status:'',
        
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
                partCategoryCode:'',
                partCategoryName:'',
                partID:'',
                partCode:'',
                partName:'',
                faultCategoryCode:'',
                faultCategoryName:'',
                remark:'',
                
              },
          currentpartCategoryID:'',
          currentpartCategoryCode:'',
          currentpartCategoryName:'',
          currentpartID:'',
          currentpartCode:'',
          currentpartName:''
        }
    }
  },
  created(){
    this.fetchPartTreeData()
    this.fetchData()
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
    fetchData(){
      faultCategoryApi.getList(this.query,this.page.current,this.page.size).then(response=>{
        this.list = response.data.records;
        
        this.page.total = response.data.total;
      })
    },
    async fetchPartTreeData(){
          const {data} = await partApi.getListTree();
          this.partTreeList=data
      },
    getPartNormalList(){
          partApi.getNormalList().then(response=>{
          this.partOptions = response.data.records;
        })
    },
    getPartCategoryNormalList(){
        partCategoryApi.getNormalList().then(response=>{
          this.partCategoryOptions = response.data.records;
        })
      },
    getFaultCategoryNormalList(){
      faultCategoryApi.getNormalList().then(response=>{
        console.log(response.data);
        this.faultCategoryOptions = response.data.records;
      })
    },
        openMenu(item,index){
        this.query.partCategoryID=item.ID

        this.query.partID=''
        this.query.faultCategoryCode=''
        this.query.faultCategoryName=''
        this.edit.currentpartCategoryID=item.ID
        this.edit.currentpartCategoryCode=item.partCategoryCode
        this.edit.currentpartCategoryName=item.partCategoryName
      
        this.edit.currentpartID=''
        this.edit.currentpartCode=''
        this.edit.currentpartName=''
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


    async handleEdit(id) {
      const {data} = await faultCategoryApi.getById(id)
      
           
       
          this.edit.pojo = data;
          this.edit.title = '编辑'
          this.edit.dialogVisible = true
          if(this.edit.pojo.partCode == null){
             this.edit.pojo.partID=this.edit.currentpartID
             this.edit.pojo.partCode=this.edit.currentpartCode
             this.edit.pojo.partName=this.edit.currentpartName
          }
         
        
        },

    handleDelete(id) {
      this.$confirm('确认删除这条记录吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          faultCategoryApi.deleteById(id).then(response=>{
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
                partCategoryCode:'',
                partCategoryName:'',
                partID:'',
                partCode:'',
                partName:'',
                faultCategoryCode:'',
                faultCategoryName:'',
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
      this.edit.title='新增'
      this.edit.dialogVisible = "true"
      this.edit.pojo.partCategoryID=this.edit.currentpartCategoryID
      this.edit.pojo.partCategoryCode=this.edit.currentpartCategoryCode
      this.edit.pojo.partCategoryName=this.edit.currentpartCategoryName
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