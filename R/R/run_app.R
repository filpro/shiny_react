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
  ...
) {
  with_golem_options(
    app = shinyApp(
      ui = app_ui(reactPagePath = reactPagePath), 
      server = app_server,
      options = list(...)
    ), 
    golem_opts = list(...)
  )
}
