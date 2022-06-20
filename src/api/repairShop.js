import request from '@/utils/request'

export default{ 
        //选择列表
        getNormalList(){
            return request({
                url: `device/repairShopManage/list`,
                method: 'post',
            })
        },  

    // 分页列表
        getList(searchMap, page = 1, size = 20) {
            return request({
                url: `device/repairShopManage/search`,
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
                url: `device/repairShopManage/option`,
                method: 'post',
                data
            })
        },
        getById(id){
            return request({
                url: 'device/repairShopManage/option',
                method: 'get',
                params:{
                    id
                }
            })
        },
        update(data){
            return request({
                url: `device/repairShopManage/option`,
                method: 'put',
                data
            })
        },
        deleteById(id){
            return request({
                url: 'device/repairShopManage/option',
                method: 'delete',
                params:{
                    id
                }
            })
        }
    }
    