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
        <el-form-item label="仪器序列号" prop="deviceSerialNo">
          <el-input v-model="pojo.deviceSerialNo"></el-input>
        </el-form-item>
        <el-form-item label="APP版本号" prop="appVersion">
          <el-input v-model="pojo.appVersion"></el-input>
        </el-form-item>
        <el-form-item label="VCI版本号" prop="vciVersion">
          <el-input v-model="pojo.vciVersion"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio disabled v-model="pojo.status" label = 0>注销</el-radio>
          <el-radio disabled v-model="pojo.status" label = 1>正常</el-radio>
          <el-radio disabled v-model="pojo.status" label = 2>维修</el-radio>
        </el-form-item>
        <el-form-item label="出厂日期" prop="createDate">
          <el-date-picker
            value-format="yyyy-mm-dd"
            type="date"
            placeholder="出厂日期"
            v-model="pojo.createDate"
            style="width: 50%;"
          ></el-date-picker>
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
  import deviceApi from '@/api/device';
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
          deviceSerialNo: [
            { required: true, message: '请输入仪器序列号', trigger: 'blur' },
            { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
          ],
          appVersion: [
            { required: true, message: '请输入APP版本号', trigger: 'blur' },
            { min: 4, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
          ],
          vciVersion: [
            { required: true, message: '请输入VCI版本号', trigger: 'blur' },
            { min: 4, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
          ],
          createDate: [
            { required: true, message: '请选择出厂日期', trigger: 'blur' }
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
        if(this.pojo.id){
          // 修改
          response = await deviceApi.update(this.pojo);
        }else{
          //新增
          response = await deviceApi.add(this.pojo);
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
  }};
</script>