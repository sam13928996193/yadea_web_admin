<template>
    <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="900px"
    :before-close="handleClose"
    :close-on-click-modal="false">
    
    <el-form
        status-icon
        ref="formData"
        :rules="rules"
        :model="pojo"
        label-position="right"
        label-width="100px"
        style="width: 750px"
      >
       
        <el-form-item label="零件类型" prop="partCategoryName" disabled>
          <el-input v-model="pojo.partCategoryName" disabled></el-input>
        </el-form-item>
        <el-form-item label="零件名称" prop="partName" disabled>
          <el-input v-model="pojo.partName" disabled></el-input>
        </el-form-item>
        <el-form-item label="故障类型" prop="faultCategoryName" disabled>
          <el-input v-model="pojo.faultCategoryName" disabled></el-input>
        </el-form-item>
        <el-form-item label="故障码" prop="faultCode">
          <el-input v-model="pojo.faultCode"></el-input>
        </el-form-item>
        <el-form-item label="显示标识" prop="faultName">
          <el-input v-model="pojo.faultName"></el-input>
        </el-form-item> 
         <el-form-item label="故障等级" prop="grade">
          <el-input v-model="pojo.grade"></el-input>
        </el-form-item> 
        <el-form-item label="故障现象" prop="action" >
          <mavon-editor v-model="pojo.action"/>
        </el-form-item>
         <el-form-item label="故障原因" prop="possible" >
          <mavon-editor v-model="pojo.possible"/>
        </el-form-item>
        <el-form-item label="故障灯" prop="lamp" >
          <mavon-editor v-model="pojo.lamp"/>
        </el-form-item>
         <el-form-item label="故障频率" prop="frequency" >
          <mavon-editor v-model="pojo.frequency"/>
        </el-form-item>
        <el-form-item label="前置条件" prop="preCondition" >
          <mavon-editor v-model="pojo.preCondition"/>
        </el-form-item>
        <el-form-item label="成熟条件" prop="matureCondition" >
          <mavon-editor v-model="pojo.matureCondition"/>
        </el-form-item>
        <el-form-item label="解除条件" prop="relieveConditon" >
          <mavon-editor v-model="pojo.relieveConditon"/>
        </el-form-item>
        <el-form-item label="清理条件" prop="clearCondition" >
          <mavon-editor v-model="pojo.clearCondition"/>
        </el-form-item> 
         <el-form-item label="维修指导" prop="repairMethod" >
          <mavon-editor v-model="pojo.repairMethod"/>
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
  import faultApi from '@/api/fault';

  // 引入mavon-editor组件和样式，这里必须加{}结构，获取其中导出的mavonEditor组件
  import {mavonEditor} from 'mavon-editor';
  import 'mavon-editor/dist/css/index.css'
  export default ({
    // 祖册为子组件
    components:{mavonEditor},
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
      faultCategoryOptions:{
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
          faultCategoryID: [
            { required: true, message: '请输入故障类型编号', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          faultCode: [
            { required: true, message: '请输入故障码', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ],
         faultName: [
            { required: true, message: '请输入显示标识', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ],
         repairMethod: [
            { required: true, message: '请输入维修指导', trigger: 'blur' }
           
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
          response = await faultApi.update(this.pojo);
        }else{
          //新增
          response = await faultApi.add(this.pojo);
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