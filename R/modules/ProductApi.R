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

    session$sendCustomMessage('productApi', list(
        productApiAddNew = productApiAddNew
    ))

}
