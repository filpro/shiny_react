library(shiny)
library(magrittr)
library(jsonlite)
library(pool)
library(magrittr)

source("db/dbservice.R")
pool = dbPool(
   drv = RSQLite::SQLite(),
   dbname = file.path(getwd(),"db","db.sqlite")
)
dataService = DataService$new(pool)
user_name = NULL


# Serve the bundle at static/main.js
if (dir.exists("dist")) {
  addResourcePath("static", "dist")
}
