customerApiModule = function(input, output, session) {
    customerApiAddNew = session$registerDataObj(
        name = 'customer-api-add-new',
        data = list(),
        filter = function(data, req) {
            if( req$REQUEST_METHOD == "POST" ) {
                received = req$rook.input$read_lines() %>% fromJSON()
                result = setters_list$addCustomer(
                    first_name = received$FIRST_NAME,
                    last_name = received$LAST_NAME
                )
                response = getters_list$getCustomersById(result) %>% as.list() %>% toJSON(auto_unbox = TRUE)
                shiny:::httpResponse(200, 'application/json', response)
            }
        }
    )

    customerApiGetAll = session$registerDataObj(
        name = 'customer-api-get-all',
        data = list(),
        filter = function(data, req) {
                log_info("GET REQUEST - GET ALL CUSTOMERS")
                oCC = openCloseConnection()
                customers = oCC(function(con){
                    customers = tbl(con, 'customers')
                    transactions = tbl(con, 'transactions')
                    result = customers %>% left_join(transactions %>% 
                        group_by(CUSTOMER_ID) %>% 
                        summarize(LAST_TRANSACTION = max(DATE_CREATED)), by=c("ID" = "CUSTOMER_ID")) %>% 
                        collect() 
                })

                response = customers %>% toJSON(auto_unbox = TRUE)
                shiny:::httpResponse(200, 'application/json', response)
        }
    )

        customerApiGetById = session$registerDataObj(
        name = 'customer-api-get-by-id',
        data = list(),
        filter = function(data, req) {
                #browser()
                log_info("GET REQUEST - GET CUSTOMER BY ID")
                query <- parseQueryString(req$QUERY_STRING)
                print(query)
                ids = query$ids %>% strsplit(',') %>% unlist()
                response = getters_list$getCustomersById(ids) %>% toJSON(auto_unbox = TRUE)
                shiny:::httpResponse(200, 'application/json', response )
            }
        )


    session$sendCustomMessage('customerApi', list(
        customerApiAddNew = customerApiAddNew,
        customerApiGetAll = customerApiGetAll,
        customerApiGetById = customerApiGetById
    ))
}