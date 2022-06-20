<template>
    <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="600px"
    :before-close="handleClose"
    :close-on-click-modal="false">
    
    <el-form
        status-icon
        ref="formData"
        :rules="rules"
        :model="pojo"
        label-position="right"
        label-width="100px"
        style="width: 500px"
      >
        <el-form-item label="系统类型编号" prop="partCategoryCode">
          <el-input v-model="pojo.partCategoryCode"></el-input>
        </el-form-item>
        <el-form-item label="系统类型名称" prop="partCategoryName">
          <el-input v-model="pojo.partCategoryName"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="pojo.remark"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio disabled v-model="pojo.status" label = 0>停用</el-radio>
          <el-radio disabled v-model="pojo.status" label = 1>正常</el-radio>
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
  import partCategoryApi from '@/api/partcategory';
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
      remoteClose:Function,   //这个方法是父组件传递的 用于关闭窗口
      pojo:{//提交的表单数据
        type: Object,
        default: {
              ID: null,
              status: '1',
              createUserID:'',
              createDate: new Date(),
              lastUserID: '',
              lastDate: null,
              partCategoryCode:'',
              partCategoryName:'',
              remark:''

        }
      }
    },
    data() {
      return {
        rules: {
          partCategoryCode: [
            { required: true, message: '请输入零件类型编号', trigger: 'blur' },
            { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
          ],
          partCategoryName: [
            { required: true, message: '请输入零件类型名称', trigger: 'blur' },
            { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
          ]
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
        
        if(this.pojo.ID){
          // 修改
          response = await partCategoryApi.update(this.pojo);
        }else{
          //新增
          response = await partCategoryApi.add(this.pojo);
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