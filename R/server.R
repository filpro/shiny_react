server <- function(input, output, session) {
  source('modules/CustomerApi.R')
  callModule(customerApiModule,"customer_api_module")

  modMtcars = mtcars
  modMtcars = cbind(name = rownames(modMtcars), modMtcars)
  rownames(modMtcars) <- NULL
  outputMtcars = modMtcars  %>% toJSON()

  observeEvent(input$call, {
    print('The call has been made!')
    session$sendCustomMessage("test", outputMtcars)
    session$sendCustomMessage("urlPath", pathUrl)
  })

  pathUrl = session$registerDataObj(
    name = 'data-api',
    data = outputMtcars,
    filter = function(data, req) {
      outputData = data 
      shiny:::httpResponse(
        200, 'application/json', outputData
      )
    }
  )
  session$sendCustomMessage("urlPath", pathUrl)
  session$sendCustomMessage("test", outputMtcars)
  print(pathUrl)

    pathValueUrl = session$registerDataObj(
    name = 'api',
    data = list(),
    filter = function(data, req) {
      outputData = rnorm(1) %>% toJSON()
      shiny:::httpResponse(
        200, 'application/json', outputData
      )
    }
  )
  session$sendCustomMessage("valUrlPath", pathValueUrl)


# Cloudflare related - to keep session alive >100 seconds
  autoInvalidate <- reactiveTimer(90000)
  seconds = 0

  observeEvent(autoInvalidate(), {
    # Invalidate and re-execute this reactive expression every time the
    # timer fires.
    seconds <<- seconds + 90
    # Do something each time this is invalidated.
    # The isolate() makes this observer _not_ get invalidated and re-executed
    # when input$n changes.
    session$sendCustomMessage("sessionDuration", seconds)
  }, ignoreInit=TRUE)

}