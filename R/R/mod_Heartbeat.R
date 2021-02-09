#' Heartbeat Server Function
#'
#' @noRd 
mod_Heartbeat_server <- function(input, output, session){
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
    
## To be copied in the UI
# mod_Heartbeat_ui("Heartbeat_ui_1")
    
## To be copied in the server
# callModule(mod_Heartbeat_server, "Heartbeat_ui_1")
 
