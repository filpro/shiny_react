#' The application server-side
#' 
#' @param input,output,session Internal parameters for {shiny}. 
#'     DO NOT REMOVE.
#' @import shiny
#' @noRd
#' 

if (future::supportsMulticore()) {
  future::plan(future::multicore)
} else {
  future::plan(future::multisession)
}


logger::log_layout(logger::layout_glue_colors)
user_name = NULL
dataUpdateTrigger = reactiveVal(0);

app_server <- function( input, output, session ) {
  # List the first level callModules here
  callModule(mod_Heartbeat_server, "Heartbeat")
  callModule(mod_TransactionApi_server, "TransactionApi")
  callModule(mod_CustomerApi_server, "CustomerApi")
  callModule(mod_ProductApi_server, "ProductApi")

}
