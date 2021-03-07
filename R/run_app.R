#' Run the Shiny Application
#'
#' @param ... A series of options to be used inside the app.
#'
#' @export
#' @importFrom shiny shinyApp
#' @importFrom golem with_golem_options
#' @param reactPagePath A path to React page managed by npm
run_app <- function(
  reactPagePath,
  mainJs,
  ...
) {
  with_golem_options(
    app = shinyApp(
      ui = app_ui, 
      server = app_server,
      options = list(      host = "0.0.0.0",
      port = 3000)
    ), 
    golem_opts = list(...)
  )
}
