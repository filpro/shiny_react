library(shiny)
library(magrittr)
library(jsonlite)
#Development mode
source('main.R')


ui <- function() {
  htmlTemplate("../React/public/index.html")
}


server <- function(input, output, session) {

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
  print(pathUrl)

}

# Serve the bundle at static/main.js
if (dir.exists("dist")) {
  addResourcePath("static", "dist")
}

# Run the application 
shinyApp(ui = ui, server = server)
