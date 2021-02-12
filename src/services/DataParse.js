class DataParse {

    mayus(data) {
        let mayus = {}
        Object.keys(data).map((key) => {
            if (typeof data[key] === 'string') {
                mayus[key] = data[key].toUpperCase().trim()
            } else {
                mayus[key] = data[key]
            }
            return null
        })

        return mayus
    }

}

export default new DataParse()