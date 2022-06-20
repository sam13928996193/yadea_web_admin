import request from '@/utils/request'

export default{ 
    getNormalList(){
        return request({
            url: `/part/partSoftware/list`,
            method: 'get',
        })
            },  
// 分页列表
    getList(searchMap, page = 1, size = 20) {
        return request({
            url: `/part/partSoftware/search`,
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
            url: `/part/partSoftware/option`,
            method: 'post',
            data
        })
    },
    getById(id){
        return request({
            url: '/part/partSoftware/option',
            method: 'get',
            params:{
                id
            }
        })
    },
    update(data){
        return request({
            url: `/part/partSoftware/option`,
            method: 'put',
            data
        })
    },
    deleteById(id){
        return request({
            url: '/part/partSoftware/option',
            method: 'delete',
            params:{
                id
            }
        })
    },
    uploadPartSoftwareFile(data = {}) {
        return request({
          url: `/part/partSoftware/upload/app`,
          method: 'post',
          data // data: data 简写
        })
      },
      // 删除APP文件接口
      deletePartSoftwareFile(imageUrl) {
        return request({
          url: `/part/partSoftware/upload/app`,
          method: 'delete',
          params: { 'fileUrl': imageUrl }
        })
      }
      
      
}
