<template>

  <div class="app-container" >
       <!-- 多条件查询 -->
    <el-form :inline="true" :model="query" class="demo-form-inline" size="mini">
    
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

    <el-container style="height: 100%; border: 1px solid #eee">
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
    <el-container>
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
              prop="partCode"
              label="零件编号"
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
              prop="fileCode"
              label="文件编号"
              align="center"
              width="180">
          </el-table-column>
          <el-table-column
              prop="fileName"
              label="文件名称"
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
  </el-container>
  <edit :title="edit.title" :dialogVisible="edit.dialogVisible" 
    :pojo="edit.pojo" :partCategoryOptions="partCategoryOptions"  :partOptions="partOptions" :remoteClose="remoteClose"/>
  </div>
</template>

<script>
import partApi from '@/api/part';
import partCategoryApi from '@/api/partcategory';
import partFileApi from '@/api/partFile';
import Edit from './edit';
const StatusOptions = [
  { value: '0', name: "注销" },
  { value: '1', name: "有效" }
  
];
export default {
    name:'partFile',//和对应路由表中配置的name值一致

  data () {
    return {
       partTreeList:[],
       list:[],
       partOptions:[],
       partCategoryOptions:[],
       page:{//分页对象
        current:1,//当前页码
        size:10,//每页显示条数
        total:0//总记录数
      },
      query:{
        partCategoryID:'',
        partID:'',
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
                partCategoryID:'',
                partID:null,
                fileCode:'',
                fileName:'',
                fileUrl:'',
                fileVerision:'',
                remark:'',
              },
          currentpartCategoryID:'',
          currentpartID:''
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
      this.fetchPartTreeData()
      this.getPartCategoryNormalList()
      this.getPartNormalList()
      this.fetchData()
    },
  methods: {
      async fetchPartTreeData(){
          const {data} = await partApi.getListTree();
          this.partTreeList=data
          console.log(this.partTreeList)
      },
      getPartCategoryNormalList(){
        partCategoryApi.getNormalList().then(response=>{
          this.partCategoryOptions = response.data.records;
        })
      },
      getPartNormalList(){
        partApi.getNormalList().then(response=>{
          this.partOptions = response.data.records;
        })
      },
      openMenu(item,index){
        console.log('item1',item.id)
        this.query.partCategoryID=item.id
        this.query.partID=''
        this.edit.currentpartCategoryID=item.id
        this.fetchData()
      },
      openMenu1(subItem,index){
        this.query.partID=subItem.id
        this.edit.currentpartID=subItem.id
        this.fetchData()
      },
      fetchData(){
        partFileApi.getList(this.query,this.page.current,this.page.size).then(response=>{
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
                lastDate: null,
                partCategoryID:null,
                partID:null,
                fileCode:'',
                fileName:'',
                fileUrl:'',
                fileVerision:'',
                remark:'',
              }
      this.edit.dialogVisible = false
      this.fetchData()
    },
       // 打开新增
     openAdd(){
      this.edit.title='新增'
      this.edit.dialogVisible = "true"
      console.log(this.edit.currentpartCategoryID)
      this.edit.pojo.partCategoryID=this.edit.currentpartCategoryID
      this.edit.pojo.partID=this.edit.currentpartID
    },
    handleEdit(id) {
      partFileApi.getById(id).then(response=>{
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
          partFileApi.deleteById(id).then(response=>{
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