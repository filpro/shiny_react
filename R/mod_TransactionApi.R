#' TransactionApi Server Function
#'
#' @noRd 
#' @import jsonlite
#' @import dplyr
mod_TransactionApi_server <- function(input, output, session){
      transactionApiAddNew = session$registerDataObj(
        name = 'transaction-api-add-new',
        data = list(),
        filter = function(data, req) {
             if( req$REQUEST_METHOD == "POST" ) {
                log_info_dev("POST REQUEST - TRANSACTION")
                received = req$rook.input$read_lines() %>% fromJSON()
                response = future(transactionAddNew(received), seed = TRUE)
                response %...>% (function(transaction) {
                    dataUpdateTrigger(transaction$ID)
                    shiny:::httpResponse(200, 'application/json', transaction %>% as.list() %>% toJSON(auto_unbox = TRUE))                    
                })
            }
        }
    )

    transactionApiGetAll = session$registerDataObj(
        name = 'transaction-api-get-all',
        data = list(),
        filter = function(data, req) {
            log_info_dev("GET REQUEST - GET ALL TRANSACTIONS")
            response = future(getAllTransactions(), seed = TRUE)
            response %...>% toJSON(auto_unbox = TRUE) %...>% shiny:::httpResponse(200, 'application/json', .)            
        }
    )

    transactionApiGetByDates = session$registerDataObj(
        name = 'transaction-api-get-by-dates',
        data = list(),
        filter = function(data, req) {
            log_info_dev("GET REQUEST - GET TRANSACTION BETWEEN DATES")
            query <- parseQueryString(req$QUERY_STRING)
            dateFrom = query$dateFrom
            dateTo = query$dateTo
            oCC = openCloseConnection()
            result = oCC(function(con) {
                #browser()
                result = list()
                filteredTransactions = getTable('transactions', function(table, con) {
                    table %>% filter(TRANSMISSION_ID >= dateFrom & TRANSMISSION_ID <= dateTo) 
                }, conInput = con)
                log_info_dev("EXECUTING TRANSACTIONS")
                result[[1]] = filteredTransactions %>% collect()
                log_info_dev("TRANSACTIONS DONE, NOW CUSTOMERS: ")
                filteredCustomers = getTable('customers', function(table, con) {
                    table %>%
                    inner_join(filteredTransactions %>% select(CUSTOMER_ID), by=c("ID" = "CUSTOMER_ID")) %>%
                    distinct()
                }, conInput = con)
                log_info_dev("EXECUTING CUSTOMERS")
                result[[2]] = filteredCustomers %>% collect()
                log_info_dev("CUSTOMERS DONE, NOW PRODUCTS: ")     
                #browser()           
                filteredProducts = getTable('products', function(table, con) {
                    table %>% 
                    inner_join(filteredTransactions %>% select(PRODUCT_ID), by=c("ID" = "PRODUCT_ID")) %>%
                    distinct()
                    }, conInput = con)
                log_info_dev("EXECUTING PRODUCTS")
                result[[3]] = filteredProducts %>% collect()
                log_info_dev("PRODUCTS DONE, NOW SENDING BACK RESPONSE: ")
                return(result)
            })
            response = result %>% jsonlite::toJSON(auto_unbox = TRUE)
            shiny:::httpResponse(200, 'application/json', response)
        }
    )

    transactionApiUpdate = session$registerDataObj(
        name = 'transaction-api-update',
        data = list(),
        filter = function(data, req) {
             if( req$REQUEST_METHOD == "POST" ) {
                log_info_dev("POST REQUEST - UPDATE TRANSACTION")
                received = req$rook.input$read_lines() %>% fromJSON()
                result = addTransaction(
                    CUSTOMER_ID = received$CUSTOMER_ID,
                    PRODUCT_ID = received$PRODUCT_ID,
                    TRANSMISSION_ID = received$TRANSMISSION_ID,
                    PRODUCT_PRICE = received$PRODUCT_PRICE,
                    IS_PAID = received$IS_PAID,
                    IS_DELIVERED = received$IS_DELIVERED,
                    update_id = received$ID
                )
                response = getTransactionsById(result) %>% as.list() %>% jsonlite::toJSON(auto_unbox = TRUE)
                shiny:::httpResponse(200, 'application/json', response)
            }
        }
    )

    transactionApiDelete = session$registerDataObj(
        name = 'transaction-api-delete',
        data = list(),
        filter = function(data, req) {
             if( req$REQUEST_METHOD == "POST" ) {
                log_info_dev("POST REQUEST - DELETE TRANSACTION")
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
                result = appendTable("transactions", object, prefix = "T", update_id = received$ID)
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
    
## To be copied in the UI
# mod_TransactionApi_ui("TransactionApi_ui_1")
    
## To be copied in the server
# callModule(mod_TransactionApi_server, "TransactionApi_ui_1")
 
