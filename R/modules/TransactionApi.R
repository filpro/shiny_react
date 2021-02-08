transactionApiModule = function(input, output, session) {
    transactionApiAddNew = session$registerDataObj(
        name = 'transaction-api-add-new',
        data = list(),
        filter = function(data, req) {
             if( req$REQUEST_METHOD == "POST" ) {
                log_info("POST REQUEST - TRANSACTION")

                received = req$rook.input$read_lines() %>% fromJSON()
                result = setters_list$addTransaction(
                    CUSTOMER_ID = received$CUSTOMER_ID,
                    PRODUCT_ID = received$PRODUCT_ID,
                    TRANSMISSION_ID = as.Date(received$TRANSMISSION_ID) %>% as.character(),
                    PRODUCT_PRICE = received$PRODUCT_PRICE,
                    IS_PAID = FALSE,
                    IS_DELIVERED = FALSE
                )

                response = getters_list$getTransactionsById(result) %>% as.list() %>% toJSON(auto_unbox = TRUE)
                dataUpdateTrigger(result)

                shiny:::httpResponse(200, 'application/json', response)
            }
        }
    )

    transactionApiGetAll = session$registerDataObj(
        name = 'transaction-api-get-all',
        data = list(),
        filter = function(data, req) {
            log_info("GET REQUEST - GET ALL TRANSACTIONS")
            response = getters_list$getAllTransactions() %>% toJSON(auto_unbox = TRUE)
            shiny:::httpResponse(200, 'application/json', response)
        }
    )

    transactionApiGetByDates = session$registerDataObj(
        name = 'transaction-api-get-by-dates',
        data = list(),
        filter = function(data, req) {
            log_info("GET REQUEST - GET TRANSACTION BETWEEN DATES")
            query <- parseQueryString(req$QUERY_STRING)
            dateFrom = query$dateFrom
            dateTo = query$dateTo
            oCC = openCloseConnection()
            result = oCC(function(con) {
                #browser()
                result = list()
                filteredTransactions = getters_list$getTable('transactions', function(table, con) {
                    table %>% filter(TRANSMISSION_ID >= dateFrom & TRANSMISSION_ID <= dateTo) 
                }, conInput = con)
                log_info("EXECUTING TRANSACTIONS")
                result[[1]] = filteredTransactions %>% collect()
                log_info("TRANSACTIONS DONE, NOW CUSTOMERS: ")
                filteredCustomers = getters_list$getTable('customers', function(table, con) {
                    table %>%
                    inner_join(filteredTransactions %>% select(CUSTOMER_ID), by=c("ID" = "CUSTOMER_ID")) %>%
                    distinct()
                }, conInput = con)
                log_info("EXECUTING CUSTOMERS")
                result[[2]] = filteredCustomers %>% collect()
                log_info("CUSTOMERS DONE, NOW PRODUCTS: ")     
                #browser()           
                filteredProducts = getters_list$getTable('products', function(table, con) {
                    table %>% 
                    inner_join(filteredTransactions %>% select(PRODUCT_ID), by=c("ID" = "PRODUCT_ID")) %>%
                    distinct()
                    }, conInput = con)
                log_info("EXECUTING PRODUCTS")
                result[[3]] = filteredProducts %>% collect()
                log_info("PRODUCTS DONE, NOW SENDING BACK RESPONSE: ")
                return(result)
            })
            response = result %>% toJSON(auto_unbox = TRUE)
            shiny:::httpResponse(200, 'application/json', response)
        }
    )

    transactionApiUpdate = session$registerDataObj(
        name = 'transaction-api-update',
        data = list(),
        filter = function(data, req) {
             if( req$REQUEST_METHOD == "POST" ) {
                log_info("POST REQUEST - UPDATE TRANSACTION")
                received = req$rook.input$read_lines() %>% fromJSON()
                result = setters_list$addTransaction(
                    CUSTOMER_ID = received$CUSTOMER_ID,
                    PRODUCT_ID = received$PRODUCT_ID,
                    TRANSMISSION_ID = received$TRANSMISSION_ID,
                    PRODUCT_PRICE = received$PRODUCT_PRICE,
                    IS_PAID = received$IS_PAID,
                    IS_DELIVERED = received$IS_DELIVERED,
                    update_id = received$ID
                )
                response = getters_list$getTransactionsById(result) %>% as.list() %>% toJSON(auto_unbox = TRUE)
                shiny:::httpResponse(200, 'application/json', response)
            }
        }
    )

    transactionApiDelete = session$registerDataObj(
        name = 'transaction-api-delete',
        data = list(),
        filter = function(data, req) {
             if( req$REQUEST_METHOD == "POST" ) {
                log_info("POST REQUEST - DELETE TRANSACTION")
                received = req$rook.input$read_lines() %>% fromJSON()
                object = tibble(
                    CUSTOMER_ID = received$CUSTOMER_ID,
                    PRODUCT_ID = received$PRODUCT_ID,
                    TRANSMISSION_ID = received$TRANSMISSION_ID,
                    PRODUCT_PRICE = received$PRODUCT_PRICE,
                    IS_PAID = received$IS_PAID,
                    IS_DELIVERED = received$IS_DELIVERED,
                    IS_DELETED = TRUE
                )
                result = setters_list$appendTable("transactions", object, prefix = "T", update_id = received$ID)
                response = received$ID
                shiny:::httpResponse(200, 'application/json', response)
            }
        }
    )

    observeEvent(dataUpdateTrigger(), {
        session$sendCustomMessage('refreshDataTrigger',dataUpdateTrigger())
    }, ignoreInit=TRUE)

    session$sendCustomMessage('transactionApi', list(
        transactionApiAddNew = transactionApiAddNew,
        transactionApiGetAll = transactionApiGetAll,
        transactionApiGetByDates = transactionApiGetByDates,
        transactionApiUpdate = transactionApiUpdate,
        transactionApiDelete = transactionApiDelete
    ))

}
