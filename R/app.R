library(shiny)

#Development mode
source('main.R')


ui <- function() {
  htmlTemplate("../React/public/index.html")
}


server <- function(input, output, session) {

  observeEvent(input$call, {
    print('The call has been made!')
    session$sendCustomMessage("test", mtcars)
    session$sendCustomMessage("urlPath", pathUrl)
  })

  pathUrl = session$registerDataObj(
    name = 'data-api',
    data = mtcars,
    filter = function(data, req) {
      outputData = jsonlite::toJSON(data)
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
