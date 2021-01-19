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
                    TRANSMISSION_ID = as.Date(received$TRANSMISSION_ID) %>% as.character(),
                    PRODUCT_PRICE = received$PRODUCT_PRICE,
                    IS_PAID = FALSE,
                    IS_DELIVERED = FALSE
                )

                response = dataService$getTransactionById(result) %>% as.list() %>% toJSON(auto_unbox = TRUE)
                refreshDataTrigger(result)

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
            dateFrom = query$dateFrom
            dateTo = query$dateTo
            filteredTransactions = dataService$getAllTransactions()[TRANSMISSION_ID >= dateFrom & TRANSMISSION_ID <= dateTo]
            filteredCustomers = dataService$getAllCustomers()[which(ID %in% filteredTransactions$CUSTOMER_ID)] 
            filteredProducts = dataService$getAllProducts()[which(ID %in% filteredTransactions$PRODUCT_ID)] 
            response = list(filteredTransactions, filteredCustomers, filteredProducts) %>% toJSON(auto_unbox = TRUE)
            shiny:::httpResponse(200, 'application/json', response)
        }
    )

    transactionApiUpdate = session$registerDataObj(
        name = 'transaction-api-update',
        data = list(),
        filter = function(data, req) {
             if( req$REQUEST_METHOD == "POST" ) {
                print("POST REQUEST - UPDATE TRANSACTION")
                received = req$rook.input$read_lines() %>% fromJSON()
                result = dataService$addTransaction(
                    CUSTOMER_ID = received$CUSTOMER_ID,
                    PRODUCT_ID = received$PRODUCT_ID,
                    TRANSMISSION_ID = received$TRANSMISSION_ID,
                    PRODUCT_PRICE = received$PRODUCT_PRICE,
                    IS_PAID = received$IS_PAID,
                    IS_DELIVERED = received$IS_DELIVERED,
                    update_id = received$ID
                )
                response = dataService$getTransactionById(result) %>% as.list() %>% toJSON(auto_unbox = TRUE)
                shiny:::httpResponse(200, 'application/json', response)
            }
        }
    )

    transactionApiDelete = session$registerDataObj(
        name = 'transaction-api-delete',
        data = list(),
        filter = function(data, req) {
             if( req$REQUEST_METHOD == "POST" ) {
                print("POST REQUEST - DELETE TRANSACTION")
                received = req$rook.input$read_lines() %>% fromJSON()
                object = data.table(
                    CUSTOMER_ID = received$CUSTOMER_ID,
                    PRODUCT_ID = received$PRODUCT_ID,
                    TRANSMISSION_ID = received$TRANSMISSION_ID,
                    PRODUCT_PRICE = received$PRODUCT_PRICE,
                    IS_PAID = received$IS_PAID,
                    IS_DELIVERED = received$IS_DELIVERED,
                    IS_DELETED = TRUE
                )
                result = dataService$addRow("transactions", object, prefix = "T", update_id = received$ID)
                response = received$ID
                shiny:::httpResponse(200, 'application/json', response)
            }
        }
    )

    refreshDataTrigger = function(message) {
        session$sendCustomMessage('refreshDataTrigger',message)
    }

    session$sendCustomMessage('transactionApi', list(
        transactionApiAddNew = transactionApiAddNew,
        transactionApiGetAll = transactionApiGetAll,
        transactionApiGetByDates = transactionApiGetByDates,
        transactionApiUpdate = transactionApiUpdate,
        transactionApiDelete = transactionApiDelete
    ))

}
