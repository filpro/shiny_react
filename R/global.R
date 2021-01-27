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


source("db/connection.R")
source("db/db_read.R")
source("db/db_write.R")

user_name = NULL


# Serve the bundle at static/main.js
if (dir.exists("dist")) {
  addResourcePath("static", "dist")
}



# products = tbl(pool, "products")
# transactions = tbl(pool, "transactions")

# x = transactions %>% 
#   select(PRODUCT_ID, TRANSMISSION_ID, DATE_CREATED, IS_DELETED, DATE_MODIFIED, AUTHOR) %>% 
#   filter(IS_DELETED == FALSE) %>%
#   group_by(TRANSMISSION_ID, PRODUCT_ID) %>% 
#   summarize(n = n()) %>% 
#   arrange(desc(n))

#   y = transactions %>% 
#   as_tibble() %>%
#   mutate(EDITED_PRODUCT_ID = PRODUCT_ID %>% gsub(" ","",.)) %>%
#   mutate(PRODUCT_ID = paste0('P',TRANSMISSION_ID %>% gsub("-","",.),EDITED_PRODUCT_ID)) %>%
#   select(-c(EDITED_PRODUCT_ID))

# toSave = list(
#   transmissions = dbReadTable(pool,'transmissions'),
#   products = dbReadTable(pool,'products'),
#   customers = dbReadTable(pool,'customers'),
#   transactions = dbReadTable(pool,'transactions')
# )

# saveRDS(toSave, 'backup.RDS')