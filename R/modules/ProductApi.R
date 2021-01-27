productApiModule = function(input, output, session) {
    productApiAddNew = session$registerDataObj(
        name = 'product-api-add-new',
        data = list(),
        filter = function(data, req) {
             if( req$REQUEST_METHOD == "POST" ) {
                log_info("POST REQUEST - PRODUCT")
                received = req$rook.input$read_lines() %>% fromJSON()
                productId = setters_list$addProduct(
                    PRODUCT_NAME = received$PRODUCT_NAME
                )

                response = getters_list$getProductsById(productId) %>% as.list() %>% toJSON(auto_unbox = TRUE)
                shiny:::httpResponse(200, 'application/json', response)
            }
        }
    )

    productApiCheckIfExistsTransaction = session$registerDataObj(
        name = 'product-api-check-if-exists-transaction',
        data = list(),
        filter = function(data, req) {
            query <- parseQueryString(req$QUERY_STRING)
            productName = query$productName
            transactionDate = as.Date(query$transactionDate)
            oCC = openCloseConnection()
            doesExists = oCC(function(con){
                products = dplyr::tbl(con, "products")
                result = (dplyr::tbl(con, "transactions") %>%
                    filter(TRANSMISSION_ID == transactionDate) %>%
                    dplyr::left_join(products, by = c("PRODUCT_ID" = "ID")) %>%
                    filter(PRODUCT_NAME == productName) %>% summarize(nrows = n()) %>%
                    pull()) > 0
                result
            })

            shiny:::httpResponse(200, 'application/json', doesExists %>% toJSON(auto_unbox = TRUE))
        }

    )

    session$sendCustomMessage('productApi', list(
        productApiAddNew = productApiAddNew,
        productApiCheckIfExistsTransaction = productApiCheckIfExistsTransaction
    ))

}
