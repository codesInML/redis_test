const axios = require("axios")
const redis = require("redis")
const util = require("util")
const REDIS_URL = `redis://localhost:6379`

const client = redis.createClient(REDIS_URL)
client.set = util.promisify(client.set)
client.get = util.promisify(client.get)

const periodicAPICall = async () => {
    try {
           const id = Math.floor(Math.random() * 5000) + 1

           const cachedPhoto = await client.get(`photo-${id}`)

           if (cachedPhoto) periodicAPICall()

           const {data} = await axios.get(`https://jsonplaceholder.typicode.com/photos/${id}`)

            await client.set(`photo-${id}`, JSON.stringify(data), "EX", 60)
    
       setTimeout(() => periodicAPICall(), 6000)
    } catch (err) {
        console.log(err)
    }
}

periodicAPICall()