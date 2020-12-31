transactionApiModule = function(input, output, session) {
    transactionApiAddNew = session$registerDataObj(
        name = 'transaction-api-add-new',
        data = list(),
        filter = function(data, req) {
             if( req$REQUEST_METHOD == "POST" ) {
                print("POST REQUEST - TRANSACTION")
                received = req$rook.input$read_lines() %>% fromJSON()
                result = dataService$addTransaction(
                    CUSTOMER_ID = received$CUSTOMER_ID,
                    PRODUCT_ID = received$PRODUCT_ID,
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

    session$sendCustomMessage('transactionApi', list(
        transactionApiAddNew = transactionApiAddNew,
        transactionApiGetAll = transactionApiGetAll
    ))

}
