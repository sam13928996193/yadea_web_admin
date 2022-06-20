import request from '@/utils/request'

export default{ 
    getNormalList(){
        return request({
            url: `/vehicle/vehiclePart2/list`,
            method: 'get',
        })
            },  
// 分页列表
    getList(searchMap, page = 1, size = 20) {
        return request({
            url: `/vehicle/vehiclePart2/search`,
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
            url: `/vehicle/vehiclePart2/option`,
            method: 'post',
            data
        })
    },
    getById(id){
        return request({
            url: '/vehicle/vehiclePart2/option',
            method: 'get',
            params:{
                id
            }
        })
    },
    update(data){
        return request({
            url: `/vehicle/vehiclePart2/option`,
            method: 'put',
            data
        })
    },
    deleteById(id){
        return request({
            url: '/vehicle/vehiclePart2/option',
            method: 'delete',
            params:{
                id
            }
        })
    },
    uploadPartSoftwareFile(data = {}) {
        return request({
          url: `/vehicle/vehiclePart2/upload/app`,
          method: 'post',
          data // data: data 简写
        })
      },
      // 删除APP文件接口
      deletePartSoftwareFile(imageUrl) {
        return request({
          url: `/vehicle/vehiclePart2/upload/app`,
          method: 'delete',
          params: { 'fileUrl': imageUrl }
        })
      }
      
      
}
