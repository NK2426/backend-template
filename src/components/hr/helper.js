const helper =  { 
    getPagination(page, size) {
        const limit = size ? +size : 20
        const offset = page ? page * limit : 0    
        return { limit, offset }
    },
    getPagingData(data, page, limit)  {
        const { count: totalItems, rows: datas  } = data
        const currentPage = page ? +page : 0
        const totalPages = Math.ceil(totalItems/limit)
        return { status:200, message:'Success', datas, totalItems, totalPages, currentPage  }
    },
    getError(err = {}){
console.log('err->',err.message," *** ->",err.errors[0]['message'],typeof(err.errors))
        let message = err.message
        if(Array.isArray(err.errors)){
            message = err.errors[0] && err.errors[0]['message'] ?  err.errors[0]['message'] : message 
        }
        console.log(message,"details for end:")
        return message
    }
}

export default helper;