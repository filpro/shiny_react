server <- function(input, output, session) {
  
  source("db/connection.R")
  source("db/db_read.R")
  source("db/db_write.R")

  source('modules/CustomerApi.R')
  source('modules/TransactionApi.R')
  source('modules/ProductApi.R')
  callModule(customerApiModule,"customer_api_module")
  callModule(transactionApiModule,"transaction_api_module")
  callModule(productApiModule,"product_api_module")

# Cloudflare related - to keep session alive >100 seconds
  autoInvalidate <- reactiveTimer(90000)
  seconds = 0

  observeEvent(input$customRefreshCall, {
    dataUpdateTrigger(input$customRefreshCall)
  }, ignoreInit = TRUE)

  observeEvent(autoInvalidate(), {
    # Invalidate and re-execute this reactive expression every time the
    # timer fires.
    seconds <<- seconds + 90
    session$sendCustomMessage("sessionDuration", seconds)
  }, ignoreInit=TRUE)

}