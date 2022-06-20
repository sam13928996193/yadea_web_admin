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
        <el-form-item label="车系" prop="vehicleSeriesID">
           <el-select clearable v-model="pojo.vehicleSeriesID"  placeholder="请选择车系">
              <el-option
                v-for="item in vehicleSeriesOptions"
                :key="item.id"
                :label="item.vehicleSeriesName"
                :value="item.id">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="车型编号" prop="vehicleModelCode">
          <el-input v-model="pojo.vehicleModelCode"></el-input>
        </el-form-item>
        <el-form-item label="车型名称" prop="vehicleModelName">
          <el-input v-model="pojo.vehicleModelName"></el-input>
        </el-form-item> 
        <el-form-item label="动力总成" prop="powerTrain">
          <el-input v-model="pojo.powerTrain"></el-input>
        </el-form-item> 
        <el-form-item label="款式" prop="style">
          <el-input v-model="pojo.style"></el-input>
        </el-form-item> 
        <el-form-item label="发动机" prop="engine">
          <el-input v-model="pojo.engine"></el-input>
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
  import vehicleModelApi from '@/api/vehicleModel';
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
        default: {}
      },
      vehicleSeriesOptions:{
        type: Array,
        default:[]
      }
    },
    data() {
      return {
        rules: {
          vehicleSeriesId: [
            { required: true, message: '请选择车系', trigger: 'blue' },
          ],
          vehicleModelCode: [
            { required: true, message: '请输入车型编号', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          vehicleModelName: [
            { required: true, message: '请输入车型名称', trigger: 'blur' },
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
          response = await vehicleModelApi.update(this.pojo);
        }else{
          //新增
          response = await vehicleModelApi.add(this.pojo);
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