productApiModule = function(input, output, session) {
    productApiAddNew = session$registerDataObj(
        name = 'product-api-add-new',
        data = list(),
        filter = function(data, req) {
             if( req$REQUEST_METHOD == "POST" ) {
                print("POST REQUEST - PRODUCT")
                received = req$rook.input$read_lines() %>% fromJSON()
                productId = dataService$addProduct(
                    PRODUCT_NAME = received$PRODUCT_NAME
                )

                response = dataService$getProductById(productId) %>% as.list() %>% toJSON(auto_unbox = TRUE)
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
            products = dplyr::tbl(pool, "products")
            doesExists = (dplyr::tbl(pool, "transactions") %>%
                filter(TRANSMISSION_ID == transactionDate) %>%
                dplyr::left_join(products, by = c("PRODUCT_ID" = "ID")) %>%
                filter(PRODUCT_NAME == productName) %>% summarize(nrows = n()) %>%
                pull()) > 0
            shiny:::httpResponse(200, 'application/json', doesExists %>% toJSON(auto_unbox = TRUE))
        }

    )

    session$sendCustomMessage('productApi', list(
        productApiAddNew = productApiAddNew,
        productApiCheckIfExistsTransaction = productApiCheckIfExistsTransaction
    ))

}
