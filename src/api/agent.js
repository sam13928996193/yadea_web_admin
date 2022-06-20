import request from '@/utils/request'

export default{ 
        //选择列表
        getNormalList(){
            return request({
                url: `device/agentmanage/list`,
                method: 'get',
            })
        },  

    // 分页列表
        getList(searchMap, page = 1, size = 20) {
            return request({
                url: `device/agentmanage/search`,
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
                url: `device/agentmanage/option`,
                method: 'post',
                data
            })
        },
        getById(id){
            return request({
                url: 'device/agentmanage/option',
                method: 'get',
                params:{
                    id
                }
            })
        },
        update(data){
            return request({
                url: `device/agentmanage/option`,
                method: 'put',
                data
            })
        },
        deleteById(id){
            return request({
                url: 'device/agentmanage/option',
                method: 'delete',
                params:{
                    id
                }
            })
        }
    }
    