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
       <el-form-item label="车系" prop="vehicleSeriesID" disabled>
           <el-select clearable v-model="pojo.vehicleSeriesID"  disabled>
              <el-option
                v-for="item in vehicleSeriesOptions"
                :key="item.ID"
                :label="item.vehicleSeriesName"
                :value="item.ID">
          </el-option>
        </el-select>
        </el-form-item >
        <el-form-item label="系统模块" prop="partCategoryID" disabled>
           <el-select clearable v-model="pojo.partCategoryID"  disabled>
              <el-option
                v-for="item in partCategoryOptions"
                :key="item.ID"
                :label="item.partCategoryCode"
                :value="item.ID">
          </el-option>
        </el-select>
        </el-form-item >
       
        <el-form-item label="程序编号" prop="fileCode">
          <el-input v-model="pojo.fileCode"></el-input>
        </el-form-item>
        <el-form-item label="程序名称" prop="fileName">
          <el-input v-model="pojo.fileName"></el-input>
        </el-form-item> 
          <el-form-item label="程序路径" prop="fileUrl">
            <el-input v-model="pojo.fileUrl"></el-input>
            <el-upload
              ref="upload"
              class="upload-demo"
              drag
              action=""
              :show-file-list="true"
              :http-request="uploadMainFile"
              >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传XXX文件</div>
            </el-upload>
        </el-form-item>
        <el-form-item label="版本说明" prop="fileVersion">
          <el-input v-model="pojo.fileVersion"></el-input>
        </el-form-item>
     
        <!-- <el-form-item label="状态" prop="status">
          <el-radio  v-model="pojo.status" label = 0>注销</el-radio>
          <el-radio  v-model="pojo.status" label = 1>有效</el-radio>
        </el-form-item> -->
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
  
  import Api from '@/api/vsPartCategorySoftware';
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
      },
     
    },
    data() {
      return {
        rules: {
      
          vehicleSeriesID: [
            { required: true, message: '请选择车系', trigger: 'blue' },
          ],
          partCategoryID: [
            { required: true, message: '请选择系统', trigger: 'blue' },
          ],
          FileCode: [
            { required: true, message: '请输入程序编号', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ],

          fileName: [
            { required: true, message: '请输入程序名称', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ],
          fileUrl: [
            { required: true, message: '请选择程序检测程序', trigger: 'blur' },

          ],
          fileVersion: [
            { required: true, message: '请输入成本版本号', trigger: 'blur' },
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
          response = await Api.update(this.pojo);
        }else{
          //新增
          response = await Api.add(this.pojo);
        }
          
        if (response.code ===20000){
             this.$message({
                message: response.message,
                type: 'success'
              });
              // // 关闭窗口
              // this.$refs.upload.uploadFiles = []
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
        //this.$refs.upload.uploadFiles = []
        this.$refs['formData'].resetFields();
        this.$refs['upload'].clearFiles();
        // 触发父组件remoteClose事件
        this.remoteClose()
      },
      // 上传文件，file为上传的文件对象
      uploadMainFile(file){
        const data = new FormData()
        data.append('file',file.file);
        Api.uploadFile(data).then(response=>{
          this.deleteFile();
          this.pojo.fileUrl = response.data;
          
        }).catch(error=>{
          this.$message({
                message: "上传失败",
                type: 'error'
              });
        })
      },
      deleteFile(){
        // 如果之前有文件，就删除
        if(this.pojo.fileUrl && this.pojo.fileUrl !== this.oldFileUrl){
           Api.deleteFile(this.pojo.fileUrl);

        }
      }
 
  }});
</script>