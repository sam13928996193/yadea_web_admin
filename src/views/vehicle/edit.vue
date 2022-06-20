<template>
    <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="500px"
    :before-close="handleClose">
    
    <el-form
        status-icon
        ref="formData"
        :rules="rules"
        :model="pojo"
        label-position="right"
        label-width="100px"
        style="width: 400px"
      >
        <el-form-item label="车系" prop="vehicleSeriesID" disabled>
           <el-select clearable v-model="pojo.vehicleSeriesID"  disabled>
              <el-option
                v-for="item in vehicleSeriesOptions"
                :key="item.id"
                :label="item.vehicleSeriesName"
                :value="item.id">
             </el-option>
          </el-select>
        </el-form-item >
        <el-form-item label="车型" prop="vehicleModelID" disabled>
           <el-select clearable v-model="pojo.vehicleModelID"  disabled>
              <el-option
                v-for="item in vehicleModelOptions"
                :key="item.id"
                :label="item.vehicleModelName"
                :value="item.id">
             </el-option>
          </el-select>
        </el-form-item >
        <el-form-item label="配置" prop="vehicleConfigID" disabled>
           <el-select clearable v-model="pojo.vehicleConfigID"  disabled>
              <el-option
                v-for="item in vehicleConfigOptions"
                :key="item.id"
                :label="item.vehicleConfigName"
                :value="item.id">
             </el-option>
          </el-select>
        </el-form-item >
       <el-form-item label="VIN码" prop="vinCode">
          <el-input v-model="pojo.vinCode"></el-input>
        </el-form-item>
                <el-form-item label="出厂日期" prop="bornDate">
          <el-date-picker
            value-format="yyyy-mm-dd"
            type="date"
            placeholder="创建日期"
            v-model="pojo.bornDate"
            style="width: 50%;"
          ></el-date-picker>
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
  import vehicleApi from '@/api/vehicle';
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
      },

       vehicleModelOptions:{
        type: Array,
        default:[]
      },
      vehicleConfigOptions:{
        type: Array,
        default:[]
      },
    
     
    },
    data() {
      return {
        rules: {
          vinCode: [
            { required: true, message: '输入VIN码', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
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
          response = await vehicleApi.update(this.pojo);
        }else{
          //新增
          response = await vehicleApi.add(this.pojo);
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
      },
     
  }});
</script>