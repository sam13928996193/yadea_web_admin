<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
      <!-- v-loading="loading" 懒加载，显示加载中- -->
      <el-form ref="formData"  v-loading="loading" label-width="80px">
          <!-- 
              :data绑定需要渲染的数据 
              show-checkbox 显示勾选框
              node-key="id" 树节点的唯一标识属性名
              props 配置响应数据中对应展示的属性名 children是子菜单的属性名，label显示的菜单名属性名
              default-checked-keys 默认勾选的集合
              default-expanded-keys 默认展开
              accordion  手风琴展开模式，每次只展开一个，会将上次展开的缩起
          -->
        <el-tree
                ref="tree" 
                :data="menuList" show-checkbox
                node-key="id"
                :props="{children:'children',label:'menuName'}"
                :default-checked-keys="menuIds"
                >
        </el-tree>
    </el-form>


    <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="submitForm('formData')">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>
  var d = new Date();
  
  import menuApi from '@/api/menu';
  import roleApi from '@/api/role';
  export default {
    // props是父组件传递的数据或执行的方法
    props:{
      
      title:{
        type: String,
        default: ''
      },
      dialogVisible: {
        type: Boolean,
        default: false
      },
      remoteClose:Function,   //这个方法是父组件传递的 用于关闭窗口
      roleId:{
        type: Number,
        default: null
      }
    },
    data() {
      return {
         loading:false,//数据加载提示
         menuList:[],//存储所有菜单的数组
         menuIds:[],//角色已拥有的菜单
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        rules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ],
          
        }
      }
    },
    watch:{
        dialogVisible(val){ //监听弹窗visible为ture的情况下，就调用菜单列表服务，加载所有菜单
            if(val){
                this.getMenuList();
            }
        }
    },
    methods: {
      // 查询所有的菜单
      getMenuList(){
          this.loading=true;
          menuApi.getList({menuName:''}).then(response=>{
              this.menuList = response.data;
            //   查询角色之前所拥有的菜单ids，然后进行回显
              this.menuIds = [];
              this.getMenuIdsByRoleId();
          });
          this.loading=false;
      },
      // 通过角色id查询角色所拥有的菜单
      async getMenuIdsByRoleId(){
          const {data} =await roleApi.getMenuIdsByRoleId(this.roleId);
          this.menuIds = data;
          
          console.log(data);

      },
      // formName就是传递进来的ref名字
      submitForm(formName) {
        // 获取所有被选中的菜单ID
          const checkedMenuIds = this.$refs.tree.getCheckedKeys();
           roleApi.saveRoleMenu(this.roleId,checkedMenuIds).then(response=>{
            if(response.code===20000){
              this.$message({
                message:'分配权限成功',
                type:'success'
              })
              this.handleClose()
            }else{
              this.$message({
                message:'保存失败',
                type:'error'
              })
            }
           })
         
      },
      async submitData(){
        // let response = null
        // if(this.pojo.id){
        //   // 修改
        //   response = await roleApi.update(this.pojo);
        // }else{
        //   //新增
        //   response = await roleApi.add(this.pojo);
        // }
          
        // if (response.code ===20000){
        //      this.$message({
        //         message: response.message,
        //         type: 'success'
        //       });
        //       // 关闭窗口
        //       this.handleClose();
        // }else{
        //      this.$message({
        //         message: "保存失败",
        //         type: 'error'
        //       });
        // }
      },

      handleClose(){
        
         this.menuList = []
         this.menuIds = []
        // // 重置表单数据
        // this.$refs['formData'].resetFields();
        // 触发父组件remoteClose事件
        this.remoteClose()
      }
  }};
</script>