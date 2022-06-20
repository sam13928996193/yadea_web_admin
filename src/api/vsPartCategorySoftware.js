import request from '@/utils/request'

export default{ 
    getNormalList(){
        return request({
            url: `/vehicle/vsPartCategorySoftware/list`,
            method: 'get',
        })
            },  
// 分页列表
    getList(searchMap, page = 1, size = 20) {
        return request({
            url: `/vehicle/vsPartCategorySoftware/search`,
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
            url: `/vehicle/vsPartCategorySoftware/option`,
            method: 'post',
            data
        })
    },
    getById(id){
        return request({
            url: '/vehicle/vsPartCategorySoftware/option',
            method: 'get',
            params:{
                id
            }
        })
    },
    update(data){
        return request({
            url: `/vehicle/vsPartCategorySoftware/option`,
            method: 'put',
            data
        })
    },
    deleteById(id){
        return request({
            url: '/vehicle/vsPartCategorySoftware/option',
            method: 'delete',
            params:{
                id
            }
        })
    },
    uploadFile(data = {}) {
        return request({
          url: `/vehicle/vsPartCategorySoftware/upload/app`,
          method: 'post',
          data // data: data 简写
        })
      },
      // 删除APP文件接口
      deleteFile(imageUrl) {
        return request({
          url: `/vehicle/vsPartCategorySoftware/upload/app`,
          method: 'delete',
          params: { 'fileUrl': imageUrl }
        })
      },
}
