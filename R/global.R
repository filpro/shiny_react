library(shiny)
library(magrittr)
library(jsonlite)
library(pool)
library(magrittr)
library(dplyr)
library(DBI)
library(logger)
library(purrr)
library(dbplyr)

log_layout(layout_glue_colors)

user_name = NULL

dataUpdateTrigger = reactiveVal(0);
# Serve the bundle at static/main.js
if (dir.exists("dist")) {
  addResourcePath("static", "dist")
}