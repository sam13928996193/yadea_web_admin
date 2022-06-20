import request from '@/utils/request'

export default{ 
    getNormalList(){
        return request({
            url: `/vehicle/vehicleModel/list`,
            method: 'get',
        })
            },  
// 分页列表
    getList(searchMap, page = 1, size = 20) {
        return request({
            url: `/vehicle/vehicleModel/search`,
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
            url: `/vehicle/vehicleModel/option`,
            method: 'post',
            data
        })
    },
    getById(id){
        return request({
            url: '/vehicle/vehicleModel/option',
            method: 'get',
            params:{
                id
            }
        })
    },
    update(data){
        return request({
            url: `/vehicle/vehicleModel/option`,
            method: 'put',
            data
        })
    },
    deleteById(id){
        return request({
            url: '/vehicle/vehicleModel/option',
            method: 'delete',
            params:{
                id
            }
        })
    },
    uploadFile(data = {}) {
        return request({
          url: `/vehicle/vehicleModel/upload/app`,
          method: 'post',
          data // data: data 简写
        })
      },
      // 删除APP文件接口
      deleteFile(imageUrl) {
        return request({
          url: `/vehicle/vehicleModel/upload/app`,
          method: 'delete',
          params: { 'fileUrl': imageUrl }
        })
      },
      //树形显示零件类型，零件
      getListTree(){
        return request({
            url: '/vehicle/vehicleModel/list/tree',
            method: 'get',
           
        })
    },
}
