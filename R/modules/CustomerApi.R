customerApiModule = function(input, output, session) {
    customerApiAddNew = session$registerDataObj(
        name = 'customer-api-add-new',
        data = list(),
        filter = function(data, req) {
            if( req$REQUEST_METHOD == "POST" ) {
                received = req$rook.input$read_lines() %>% fromJSON()
                result = dataService$addCustomer(
                    first_name = received$FIRST_NAME,
                    last_name = received$LAST_NAME
                )
                response = dataService$getCustomerById(result) %>% as.list() %>% toJSON(auto_unbox = TRUE)
                shiny:::httpResponse(200, 'application/json', response)
            }
        }
    )

    customerApiGetAll = session$registerDataObj(
        name = 'customer-api-get-all',
        data = list(),
        filter = function(data, req) {
                print("GET REQUEST - GET CUSTOMER ALL")
                response = dataService$getAllCustomers() %>% toJSON(auto_unbox = TRUE)
                shiny:::httpResponse(200, 'application/json', response)
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
                ids = query$ids %>% strsplit(',') %>% unlist()
                response = dataService$getCustomerById(ids) %>% toJSON(auto_unbox = TRUE)
                shiny:::httpResponse(200, 'application/json', response )
            }
        )


    session$sendCustomMessage('customerApi', list(
        customerApiAddNew = customerApiAddNew,
        customerApiGetAll = customerApiGetAll,
        customerApiGetById = customerApiGetById
    ))
}