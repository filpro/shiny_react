library(R6)
library(data.table)
library(DBI)


DataService = R6Class(
  cloneable = FALSE,
  public = list(
    initialize = function(pool){
      private$pool = pool
    }
  ),
  private = list(
    pool = NULL
  )
)

dfToUpper = function(df){
  result = data.frame(lapply(df, function(v) {
    if (is.character(v)) return(toupper(v))
    else return(v)
  })) %>% as.data.table()
  return(result)
}

DataService$set("private","setId",function(vec = vector(), n, prefix, date_ref = Sys.Date()){
  date_ref = format(date_ref,"%y%m")
  category_part = substr(vec,1,1)
  date_part = substr(vec,2,5) 
  number_part = substr(vec,6,nchar(vec)) %>% as.numeric()
  
  ref_elems_i = which(date_part == date_ref & category_part == prefix)
  num_endpoint = ifelse(length(ref_elems_i) == 0, 0,max(number_part[ref_elems_i]))
  new_num_parts = seq(num_endpoint + 1, num_endpoint + n, 1)
  result = paste0(prefix %>% toupper(),date_ref,new_num_parts)
  
  return(result)
})

DataService$set("public","getTable",function(table_name, show_all = FALSE, show_content = TRUE){
  result = dbReadTable(private$pool,table_name) %>% as.data.table()
  if(!show_all){
    result = result[order(DATE_MODIFIED)] %>% unique(by="ID", fromLast=TRUE)
    result = result[IS_DELETED == 0]
  }
  
  if(!show_content){
    result = result[numeric(0)]
  }
  return(result)
})

DataService$set("public","getAllCustomers",function(show_all = FALSE, show_content = TRUE){
  result = self$getTable("customers", show_all = show_all, show_content = show_content)
  return(result)
})

DataService$set("public","getAllProducts",function(show_all = FALSE, show_content = TRUE){
  result = self$getTable("products", show_all = show_all, show_content = show_content)
  return(result)
})

DataService$set("public","getAllTransmissions",function(show_all = FALSE, show_content = TRUE){
  result = self$getTable("transmissions", show_all = show_all, show_content = show_content)
  return(result)
})

DataService$set("public","getAllTransactions",function(show_all = FALSE, show_content = TRUE){
  result = self$getTable("transactions", show_all = show_all, show_content = show_content)
  return(result)
})




DataService$set("public","getCustomerById",function(id){
  result = self$getAllCustomers()[ID %in% id]
  if(nrow(result)==0) result = NA
  return(result)
})

DataService$set("public","getTransactionById",function(id){
  result = self$getAllTransactions()[ID %in% id]
  if(nrow(result)==0) result = NA
  return(result)
})

DataService$set("public","getProductById",function(id){
  result = self$getAllProducts()[ID %in% id]
  if(nrow(result)==0) result = NA
  return(result)
})


DataService$set("public","addRow", function(table_name, object, prefix = "", update_id = NA, to_upper = TRUE) {
  #browser()
  if(to_upper){
    object = dfToUpper(object)
  }
  conn <- pool
  
  table_ref = self$getTable(table_name)[,-c("INT_ID")]
  ids = table_ref$ID

  object$DATE_MODIFIED = Sys.time() %>% as.character()
  
  if(is.na(update_id)){
    object$IS_DELETED = FALSE
    object$DATE_CREATED = Sys.time() %>% as.character() 
    
    if("ID" %in% colnames(object)){
      if(is.na(object$ID)){
        id = private$setId(vec = ids, n = 1, prefix = prefix)
      } else {
        id = object$ID %>% as.character()
      }
    } else {
      id = private$setId(vec = ids, n = 1, prefix = prefix)
    }
  } else {

    id = update_id
    ref_row = table_ref[ID %in% id]
    creation_date = ref_row$DATE_CREATED
    
    object = Filter(function(x) !(all(x=="")), object)
    
    for(col_name in colnames(object)){
      ref_row[[col_name]] = object[[col_name]]
    }
    object = ref_row[,-c("ID","DATE_MODIFIED","DATE_CREATED")]
    
    object$DATE_CREATED = creation_date
  }
  #browser()
  object$ID = id %>% as.character()
  object$DATE_MODIFIED = Sys.time() %>% as.character()
  object$AUTHOR = user_name 
  
  #browser()
  query = sqlAppendTable(conn, table_name, object %>% as.data.frame())
  # query = paste0(
  #   "INSERT INTO ",table_name, " ('",paste0(c("ID",object %>% colnames(),"DATE_CREATED","IS_DELETED","DATE_MODIFIED"), collapse = "','"),
  #   "') VALUES ('", c(id,object %>% as.matrix(),creation_date ,is_deleted,modification_date) %>% paste0(collapse = "','"),"')")
  
  if(self$getTable(table_name)[ID %in% id] %>% nrow() == 0 | !is.na(update_id)){
    dbExecute(conn, query)
    #dbCommit(conn)   # or dbRollback(conn) if something went wrong
    #poolReturn(conn)
    print(paste0("Added/updated: ", paste0(id, collapse = ", ")))
    return(id)
  } else {
    print("This ID already exists in the table! Change ID or update")
    return(id)
  }

})


DataService$set("public","addCustomer", function(first_name = NULL, last_name = NULL, update_id = NA){
  new_object = data.table(
    FIRST_NAME = first_name,
    LAST_NAME = last_name)
  result = self$addRow("customers",new_object, prefix = "C", update_id = update_id)
  return(result)
})


DataService$set("public","addProduct", function(ID = NULL, PRODUCT_NAME = NULL, update_id = NA){
  new_object = data.table(
    PRODUCT_NAME = PRODUCT_NAME
  )
  result = self$addRow("products",new_object, prefix = "P", update_id = update_id)
  return(result)
  
})

DataService$set("public","addTransaction",function(CUSTOMER_ID = NULL,PRODUCT_ID = NULL,TRANSMISSION_ID = NULL,PRODUCT_PRICE = NULL, IS_PAID = NULL, IS_DELIVERED = NULL, update_id = NA){
  new_object = data.table(
    CUSTOMER_ID = CUSTOMER_ID,
    PRODUCT_ID = PRODUCT_ID,
    TRANSMISSION_ID = TRANSMISSION_ID,
    PRODUCT_PRICE = PRODUCT_PRICE,
    IS_PAID = IS_PAID,
    IS_DELIVERED = IS_DELIVERED
  )
  result = self$addRow("transactions",new_object, prefix = "T", update_id = update_id)
  return(result)
  
})


DataService$set("public","addTransmission", function(ID = NULL, TRANSMISSION_DATE = NULL, update_id = NA){
  new_object = data.table(
    ID = ID,
    TRANSMISSION_DATE = TRANSMISSION_DATE
  )
  result = self$addRow("transmissions",new_object, update_id = update_id)
  return(result)
})


DataService$set("public","prepareData", function(){
  c_n = 200
  tm_n = 40
  p_n = 2000
  tn_n = 2000
  
  
  dates = seq.Date(Sys.Date()-3*tm_n, Sys.Date(),"day") %>% sample(tm_n)
  
  customers_tbl =  data.table(
    ID = private$setId(n=c_n, prefix = "C"),
    FIRST_NAME = randomNames::randomNames(c_n, which.names = "first"),
    LAST_NAME = randomNames::randomNames(c_n, which.names = "last"),
    DATE_CREATED = Sys.time() %>% as.character(),
    IS_DELETED = FALSE,
    DATE_MODIFIED = Sys.time() %>% as.character(),
    AUTHOR = "test.skrypt@gmail.com"
  ) %>% dfToUpper()
  
  transmissions_tbl = data.table(
    ID = format(dates,"%Y-%m-%d"),
    TRANSMISSION_DATE = dates %>% as.character(),
    DATE_CREATED = Sys.time() %>% as.character(),
    IS_DELETED = FALSE,
    DATE_MODIFIED = Sys.time() %>% as.character(),
    AUTHOR = "test.skrypt@gmail.com"
  )
  
  product_ids = private$setId(n=p_n, prefix = "P")

  products_tbl = data.table(
    ID =product_ids,
    PRODUCT_NAME = product_ids,
    DATE_CREATED = Sys.time() %>% as.character(),
    IS_DELETED = FALSE,
    DATE_MODIFIED = Sys.time() %>% as.character(),
    AUTHOR = "test.skrypt@gmail.com"
  )
  
  
  transactions_tbl = data.table(
    ID = private$setId(n=tn_n, prefix = "T"),
    CUSTOMER_ID = sample(customers_tbl$ID,tn_n,replace = TRUE),
    PRODUCT_ID = sample(products_tbl$ID, tn_n,replace = TRUE),
    TRANSMISSION_ID = sample(transmissions_tbl$ID,tn_n,replace = TRUE),
    PRODUCT_PRICE = runif(tn_n,1,5) %>% round(),
    IS_PAID = sample(size = tn_n, c(TRUE, FALSE), replace = TRUE),
    IS_DELIVERED = sample(size = tn_n, c(TRUE, FALSE), replace = TRUE),
    DATE_CREATED = Sys.time() %>% as.character(),
    IS_DELETED = FALSE,
    DATE_MODIFIED = Sys.time() %>% as.character(),
    AUTHOR = "test.skrypt@gmail.com"
  ) 
  
  if(dbExistsTable(private$pool,"customers")){
    dbRemoveTable(private$pool, "customers")
  }
  dbWriteTable(private$pool,"customers",customers_tbl)
  
  if(dbExistsTable(private$pool,"products")){
    dbRemoveTable(private$pool, "products")
  }
  dbWriteTable(private$pool,"products",products_tbl)
  
  if(dbExistsTable(private$pool,"transactions")){
    dbRemoveTable(private$pool, "transactions")
  }
  dbWriteTable(private$pool,"transactions", transactions_tbl)
  
  if(dbExistsTable(private$pool,"transmissions")){
    dbRemoveTable(private$pool, "transmissions")
  }
  dbWriteTable(private$pool,"transmissions", transmissions_tbl)
  
})
