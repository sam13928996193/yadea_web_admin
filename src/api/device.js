import request from '@/utils/request'

export default{ 
// 分页列表
    getList(searchMap, page = 1, size = 20) {
        return request({
            url: `device/devicemanage/search`,
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
            url: `device/devicemanage/option`,
            method: 'post',
            data
        })
    },
    getById(id){
        return request({
            url: 'device/devicemanage/option',
            method: 'get',
            params:{
                id
            }
        })
    },
    update(data){
        return request({
            url: `device/devicemanage/option`,
            method: 'put',
            data
        })
    },
    deleteById(id){
        return request({
            url: 'device/devicemanage/option',
            method: 'delete',
            params:{
                id
            }
        })
    }
}
