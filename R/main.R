# Run the Shiny app in development mode

options(shiny.port = 3838)
options(shiny.launch.browser = FALSE)
options(shiny.autoreload = TRUE)
options(shiny.trace = TRUE)
options(shiny.host = '0.0.0.0')
# Only reload on server-side changes
options(shiny.autoreload.pattern = ".*\\.(r|html)$")

shiny::runApp()
