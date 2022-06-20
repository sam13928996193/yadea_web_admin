<template>
    <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="500px"
    :before-close="handleClose"
    :close-on-click-modal="false">
    
    <el-form
        status-icon
        ref="formData"
        :rules="rules"
        :model="pojo"
        label-position="right"
        label-width="100px"
        style="width: 400px"
      >
        <el-form-item label="类型" prop="menuType">
          <el-radio  v-model="pojo.menuType" label = 1>目录</el-radio>
          <el-radio  v-model="pojo.menuType" label = 2>菜单</el-radio>
          <el-radio  v-model="pojo.menuType" label = 3 v-if="pojo.parentID !==0">按钮</el-radio>
        </el-form-item>

        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="pojo.menuName"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="menuCode">
          <el-input v-model="pojo.menuCode"></el-input>
        </el-form-item>
        <el-form-item label="请求地址" prop="menuUrl" v-if="pojo.menuType !=3">
          <el-input v-model="pojo.menuUrl"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="menuIcon" v-if="pojo.menuType !=3">
          <el-input v-model="pojo.menuIcon"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="menuSort">
          <el-input-number v-model="pojo.menuSort"  :min="1" :max="10000" ></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input  type="textarea" v-model="pojo.remark"></el-input>
        </el-form-item>
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
      pojo:{//提交的表单数据
        type: Object,
        default: {

        }
      }
    },
    data() {
      return {
        rules: {
            menuType: [
            { required: true, message: '请选择类型', trigger: 'change' }
            ],
          menuName: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          menuCode: [
            { required: true, message: '请输入权限标识', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ],
         
          
        }
      }
    },
    methods: {
      // formName就是传递进来的ref名字
      submitForm(formName) {
          this.$refs[formName].validate((valid) => {
          if (valid) {
           
            // 判断类型是否为按钮，按钮则不提交，请求地址和图标，将两个属性设置为空
            if (this.pojo.menuType===3){
                this.pojo.menuUrl='';
                this.pojo.menuIcon='';
            }
            this.submitData();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      async submitData(){
        let response = null
        if(this.pojo.id){
          // 修改
          response = await menuApi.update(this.pojo);
         
        }else{
          
          response = await menuApi.add(this.pojo);
        }
          
        if (response.code ===20000){
             this.$message({
                message: response.message,
                type: 'success'
              });
              // 关闭窗口
              this.handleClose();
        }else{
             this.$message({
                message: "保存失败",
                type: 'error'
              });
        }
      },

      handleClose(){
        // 重置表单数据
        this.$refs['formData'].resetFields();
        // 触发父组件remoteClose事件
        this.remoteClose()
      }
  }};
</script>