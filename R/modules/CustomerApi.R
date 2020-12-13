customerApiModule = function(input, output, session) {
    customerApiAddNew = session$registerDataObj(
        name = 'customer-api-add-new',
        data = list(),
        filter = function(data, req) {
            if( req$REQUEST_METHOD == "POST" ) {
                received = req$rook.input$read_lines() %>% fromJSON()
                shiny:::httpResponse(200, 'application/json', received %>% toJSON(auto_unbox = TRUE))
            }
        }
    )

    customerApiGetAll = session$registerDataObj(
        name = 'customer-api-get-all',
        data = list(),
        filter = function(data, req) {
                print("GET REQUEST - GET CUSTOMER ALL")
                shiny:::httpResponse(200, 'application/json', iris %>% toJSON(auto_unbox = TRUE))
        }
    )

        customerApiGetById = session$registerDataObj(
        name = 'customer-api-get-by-id',
        data = list(),
        filter = function(data, req) {
                #browser()
                print("GET REQUEST - GET CUSTOMER BY ID")
                query <- parseQueryString(req$QUERY_STRING)
                print(query)
                ids = query$ids %>% strsplit(',') %>% unlist() %>% as.numeric()
                shiny:::httpResponse(200, 'application/json', iris %>% toJSON(auto_unbox = TRUE))
            }
        )


    session$sendCustomMessage('customerApi', list(
        customerApiAddNew = customerApiAddNew,
        customerApiGetAll = customerApiGetAll,
        customerApiGetById = customerApiGetById
    ))
}