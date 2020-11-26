#
# This is a Shiny web application. You can run the application by clicking
# the 'Run App' button above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#

library(shiny)

# Define UI for application that draws a histogram
ui <- function() {
  htmlTemplate("../React/public/index.html")
}

# Define server logic required to draw a histogram
server <- function(input, output, session) {

  observeEvent(input$call, {
    print('The call has been made!')
    session$sendCustomMessage("test", mtcars)
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
  print(pathUrl)

}

# Serve the bundle at static/main.js
if (dir.exists("dist")) {
  addResourcePath("static", "dist")
}

# Run the application 
shinyApp(ui = ui, server = server)
