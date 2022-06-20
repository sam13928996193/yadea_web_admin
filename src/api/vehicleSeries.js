import request from '@/utils/request'

export default{ 
    getNormalList(){
        return request({
            url: `/vehicle/vehicleSeries/list`,
            method: 'get',
        })
            },  
// 分页列表
    getList(searchMap, page = 1, size = 20) {
        return request({
            url: `/vehicle/vehicleSeries/search`,
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
            url: `/vehicle/vehicleSeries/option`,
            method: 'post',
            data
        })
    },
    getById(id){
        return request({
            url: '/vehicle/vehicleSeries/option',
            method: 'get',
            params:{
                id
            }
        })
    },
    update(data){
        return request({
            url: `/vehicle/vehicleSeries/option`,
            method: 'put',
            data
        })
    },
    deleteById(id){
        return request({
            url: '/vehicle/vehicleSeries/option',
            method: 'delete',
            params:{
                id
            }
        })
    },
    uploadFile(data = {}) {
        return request({
          url: `/vehicle/vehicleSeries/upload/app`,
          method: 'post',
          data // data: data 简写
        })
      },
      // 删除APP文件接口
      deleteFile(imageUrl) {
        return request({
          url: `/vehicle/vehicleSeries/upload/app`,
          method: 'delete',
          params: { 'fileUrl': imageUrl }
        })
      }
}
