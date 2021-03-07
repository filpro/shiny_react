#' CustomerApi Server Function
#'
#' @noRd 
#' @import jsonlite
#' @import dplyr
mod_CustomerApi_server <- function(input, output, session){
      customerApiAddNew = session$registerDataObj(
        name = 'customer-api-add-new',
        data = list(),
        filter = function(data, req) {
            if( req$REQUEST_METHOD == "POST" ) {
                received = req$rook.input$read_lines() %>% fromJSON()
                response = future(customerAddNew(received), seed = TRUE)
                response %...>% as.list() %...>% toJSON(auto_unbox = TRUE) %...>% shiny:::httpResponse(200, 'application/json', .)
            }
        }
    )

    customerApiGetAll = session$registerDataObj(
        name = 'customer-api-get-all',
        data = list(),
        filter = function(data, req) {
                log_info_dev("GET REQUEST - GET ALL CUSTOMERS")
                response = future(customerGetAll(), seed = TRUE)
                response %...>% 
                    toJSON(auto_unbox = TRUE) %...>% 
                    shiny:::httpResponse(200, 'application/json', .)
        }
    )

        customerApiGetById = session$registerDataObj(
        name = 'customer-api-get-by-id',
        data = list(),
        filter = function(data, req) {
                #browser()
                log_info_dev("GET REQUEST - GET CUSTOMER BY ID")
                query <- parseQueryString(req$QUERY_STRING)
                print(query)
                ids = query$ids %>% strsplit(',') %>% unlist()
                response = getCustomersById(ids) %>% toJSON(auto_unbox = TRUE)
                shiny:::httpResponse(200, 'application/json', response )
            }
        )


    session$sendCustomMessage('customerApi', list(
        customerApiAddNew = customerApiAddNew,
        customerApiGetAll = customerApiGetAll,
        customerApiGetById = customerApiGetById
    ))
}
    
## To be copied in the UI
# mod_CustomerApi_ui("CustomerApi_ui_1")
    
## To be copied in the server
# callModule(mod_CustomerApi_server, "CustomerApi_ui_1")
 
