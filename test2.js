const http = require("http")
let data = require("./data")

const getPaginationOptions = (options) => {
    return options.reduce((total, option) => {
        if(option.includes("limit")) {
            total.limit = option.split("=")[1]
        }
        if(option.includes("orderBy")) {
            total.orderBy = option.split("=")[1]
        }
        if(option.includes("page")) {
            total.page = option.split("=")[1]
        }

        return total
    }, {})
}

// Example of endpoint: /api/v1?limit=10?page=3?orderBy=title
const server = http.createServer(async (req, res) => {
    const [baseUrl, options] = req.url.split("?")

    const option = options ? getPaginationOptions(options.split("&")) : ""

    if (baseUrl == "/api/v1" && req.method === "GET") {
        try {
            // for pages
            let returnedData;

            
            if (option.orderBy) {
                returnedData = data.sort(function(a, b){
                    if(a[option.orderBy] < b[option.orderBy]) { return -1; }
                    if(a[option.orderBy] > b[option.orderBy]) { return 1; }
                    return 0;
                })
            }

            if (option.page) {
                const startIndex = (option.page - 1)  * option.limit
                const endIndex = option.page * option.limit
                
                returnedData = data.slice(startIndex, endIndex)
            }

            if (option.limit && !option.page) {
                returnedData = data.slice(0, option.limit)
            }

            // set the status code and content-type
            res.writeHead(200, { "Content-Type": "application/json" });
            // send the data
            res.end(JSON.stringify(returnedData));
        } catch (error) {
            // set the status code and content-type
            res.writeHead(404, { "Content-Type": "application/json" });
            // send the error
            res.end(JSON.stringify({ message: error }));
        }
    }
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
})

server.listen(3030, () => {
    console.log("server started on port 3030")
})