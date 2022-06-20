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
        <el-form-item label="车系" prop="partCategoryID">
           <el-select clearable v-model="pojo.partCategoryID"  placeholder="请选择系统">
              <el-option
                v-for="item in partCategoryOptions"
                :key="item.ID"
                :label="item.partCategoryName"
                :value="item.ID">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sortID">
          <el-input v-model="pojo.sortID"></el-input>
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
  import vsPartCategoryApi from '@/api/vsPartCategory';
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
      partCategoryOptions:{
        type: Array,
        default:[]
      }
    },
    data() {
      return {
        rules: {
          vehicleSeriesID: [
            { required: true, message: '请选择车系', trigger: 'blue' },
          ],
          partCategoryID: [
            { required: true, message: '请选择系统', trigger: 'blur' },
           
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
          response = await vsPartCategoryApi.update(this.pojo);
        }else{
          //新增
          response = await vsPartCategoryApi.add(this.pojo);
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