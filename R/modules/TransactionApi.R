transactionApiModule = function(input, output, session) {
    transactionApiAddNew = session$registerDataObj(
        name = 'transaction-api-add-new',
        data = list(),
        filter = function(data, req) {
             if( req$REQUEST_METHOD == "POST" ) {
                print("POST REQUEST - TRANSACTION")
                received = req$rook.input$read_lines() %>% fromJSON()

                productId = dataService$addProduct(
                    ID = NULL,
                    PRODUCT_NAME = received$PRODUCT_ID
                )

                result = dataService$addTransaction(
                    CUSTOMER_ID = received$CUSTOMER_ID,
                    PRODUCT_ID = productId,
                    TRANSMISSION_ID = received$TRANSMISSION_ID,
                    PRODUCT_PRICE = received$PRODUCT_PRICE,
                    IS_PAID = FALSE,
                    IS_DELIVERED = FALSE
                )

                response = dataService$getCustomerById(result) %>% as.list() %>% toJSON(auto_unbox = TRUE)
                shiny:::httpResponse(200, 'application/json', response)
            }
        }
    )

    transactionApiGetAll = session$registerDataObj(
        name = 'transaction-api-get-all',
        data = list(),
        filter = function(data, req) {
            print("GET REQUEST - GET ALL TRANSACTIONS")
            response = dataService$getAllTransactions() %>% toJSON(auto_unbox = TRUE)
            shiny:::httpResponse(200, 'application/json', response)
        }
    )

    transactionApiGetByDates = session$registerDataObj(
        name = 'transaction-api-get-by-dates',
        data = list(),
        filter = function(data, req) {
            print("GET REQUEST - GET TRANSACTION BY ID")
            query <- parseQueryString(req$QUERY_STRING)
            print(query)
            dateFrom = query$dateFrom
            dateTo = query$dateTo
            filteredTransactions = dataService$getAllTransactions()[TRANSMISSION_ID >= dateFrom & TRANSMISSION_ID <= dateTo]
            filteredCustomers = dataService$getAllCustomers()[which(ID %in% filteredTransactions$CUSTOMER_ID)] 
            filteredProducts = dataService$getAllProducts()[which(ID %in% filteredTransactions$PRODUCT_ID)] 
            response = list(filteredTransactions, filteredCustomers, filteredProducts) %>% toJSON(auto_unbox = TRUE)
            shiny:::httpResponse(200, 'application/json', response)
        }
    )

    session$sendCustomMessage('transactionApi', list(
        transactionApiAddNew = transactionApiAddNew,
        transactionApiGetAll = transactionApiGetAll,
        transactionApiGetByDates = transactionApiGetByDates
    ))

}
