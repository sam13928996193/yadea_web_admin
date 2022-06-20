import request from '@/utils/request'

export default{ 
    getNormalList(){
        return request({
            url: `/vehicle/vehicleConfig/list`,
            method: 'get',
        })
            },  
// 分页列表
    getList(searchMap, page = 1, size = 20) {
        return request({
            url: `/vehicle/vehicleConfig/search`,
            method: 'post',
            data:{
                ...searchMap,
                page,
                size
            }
        })
    },
    add(data){
        return request({
            url: `/vehicle/vehicleConfig/option`,
            method: 'post',
            data
        })
    },
    getById(id){
        return request({
            url: '/vehicle/vehicleConfig/option',
            method: 'get',
            params:{
                id
            }
        })
    },
    update(data){
        return request({
            url: `/vehicle/vehicleConfig/option`,
            method: 'put',
            data
        })
    },
    deleteById(id){
        return request({
            url: '/vehicle/vehicleConfig/option',
            method: 'delete',
            params:{
                id
            }
        })
    },
    uploadSoftwareFile(data = {}) {
        return request({
          url: `/vehicle/vehicleConfig/upload/app`,
          method: 'post',
          data // data: data 简写
        })
      },
      // 删除APP文件接口
      deleteSoftwareFile(imageUrl) {
        return request({
          url: `/vehicle/vehicleConfig/upload/app`,
          method: 'delete',
          params: { 'fileUrl': imageUrl }
        })
      },
      //树形显示零件类型，零件
      getListTree(){
        return request({
            url: '/vehicle/vehicleConfig/list/tree',
            method: 'get',
           
        })
    },
      
      
}
