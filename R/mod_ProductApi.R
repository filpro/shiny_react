#' ProductApi Server Function
#'
#' @noRd 
#' @import jsonlite
#' @import dplyr
#' @import future
#' @import promises
mod_ProductApi_server <- function(input, output, session, is_authenticated){
      productApiAddNew = session$registerDataObj(
        name = 'product-api-add-new',
        data = list(),
        filter = function(data, req) {
            if( req$REQUEST_METHOD == "POST" ) {
                log_info_dev("POST REQUEST - PRODUCT")
                received = req$rook.input$read_lines() %>% fromJSON()
                response = future(productAddNew(received$PRODUCT_NAME), seed=TRUE)
                response %...>% 
                    as.list() %...>% 
                    toJSON(auto_unbox = TRUE) %...>% 
                    shiny:::httpResponse(200, 'application/json', .)
            }
        }
    )

    productApiCheckIfExistsTransaction = session$registerDataObj(
        name = 'product-api-check-if-exists-transaction',
        data = list(),
        filter = function(data, req) {
            query <- parseQueryString(req$QUERY_STRING)
            result = future(checkIfExistsTransaction(query$productName, as.Date(query$transactionDate)), seed=TRUE)
            result %...>% toJSON(auto_unbox=TRUE) %...>% shiny:::httpResponse(200, 'application/json', .)
        }

    )



    observeEvent(is_authenticated(), {
        if(is_authenticated()) {
            session$sendCustomMessage('productApi', list(
                productApiAddNew = productApiAddNew,
                productApiCheckIfExistsTransaction = productApiCheckIfExistsTransaction
            ))
        }
    })

 
}
    
## To be copied in the UI
# mod_ProductApi_ui("ProductApi_ui_1")
    
## To be copied in the server
# callModule(mod_ProductApi_server, "ProductApi_ui_1")
 
