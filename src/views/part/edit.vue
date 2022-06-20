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
       
        <el-form-item label="零件类型编号" prop="partCategoryCode" disabled>
          <el-input v-model="pojo.partCategoryCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="零件类型名称" prop="partCategoryName" disabled>
          <el-input v-model="pojo.partCategoryName" disabled></el-input>
        </el-form-item>
        <el-form-item label="零件编号" prop="partCode">
          <el-input v-model="pojo.partCode"></el-input>
        </el-form-item>
        <el-form-item label="零件名称" prop="partName">
          <el-input v-model="pojo.partName"></el-input>
        </el-form-item> 
        <el-form-item label="检测Id" prop="checkID">
          <el-input v-model="pojo.checkID"></el-input>
        </el-form-item> 
        <el-form-item label="程序Id" prop="programID">
          <el-input v-model="pojo.programID"></el-input>
        </el-form-item> 
        <el-form-item label="状态" prop="status">
          <el-radio  v-model="pojo.status" label = 0>注销</el-radio>
          <el-radio  v-model="pojo.status" label = 1>有效</el-radio>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="pojo.remark"></el-input>
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
  import partApi from '@/api/part';
  export default ({
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
       pojo:{//提交的表单数据
        type: Object,
        default: {}
      },
      partCategoryOptions:{
        type: Array,
        default:[]
      },
      remoteClose:Function,   //这个方法是父组件传递的 用于关闭窗口
     
    },
    data() {
      return {
        rules: {
          partCategoryID: [
            { required: true, message: '请选择零件类型', trigger: 'blue' },
          ],
          partCode: [
            { required: true, message: '请输入零件代号', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          partName: [
            { required: true, message: '请输入零件名称', trigger: 'blur' },
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
          response = await partApi.update(this.pojo);
        }else{
          //新增
          response = await partApi.add(this.pojo);
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
        console.log('关闭')
        // 重置表单数据
        this.$refs['formData'].resetFields();
        // 触发父组件remoteClose事件
        this.remoteClose()
      }
  }});
</script>