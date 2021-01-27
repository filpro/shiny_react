
# Utils
setId = function(vec = vector(), n, prefix, date_ref = Sys.Date()) {
  date_ref = format(date_ref,"%y%m")
  category_part = substr(vec,1,1)
  date_part = substr(vec,2,5) 
  number_part = substr(vec,6,nchar(vec)) %>% as.numeric()
  
  ref_elems_i = which(date_part == date_ref & category_part == prefix)
  num_endpoint = ifelse(length(ref_elems_i) == 0, 0,max(number_part[ref_elems_i]))
  new_num_parts = seq(num_endpoint + 1, num_endpoint + n, 1)
  result = paste0(prefix %>% toupper(),date_ref,new_num_parts)
  
  return(result)
}

dfToUpper = function(df){
  result = modify_depth(df,2,function(x) ifelse(is.character(x), toupper(x), x))
  return(result)
}

setters_list = list()

# Append table
setters_list$appendTable = function(table_name, object, prefix = "", update_id = NA, to_upper = TRUE, user_name = NULL) {
  if(to_upper) object = dfToUpper(object)
  getters_list$getTable(table_name, function(table, con) {
    ids = table %>% pull(ID)
    object$DATE_MODIFIED = Sys.time() %>% as.character()
    
    if(is.na(update_id)){
      object$IS_DELETED = FALSE
      object$DATE_CREATED = Sys.time() %>% as.character() 
      
      if("ID" %in% colnames(object)){
        if(is.na(object$ID)){
          id = setId(vec = ids, n = 1, prefix = prefix)
        } else {
          id = object$ID %>% as.character()
        }
      } else {
        id = setId(vec = ids, n = 1, prefix = prefix)
      }
    } else {
      
      id = update_id
      ref_row = table %>% 
        filter(ID %in% id) %>% 
        select(-c("INT_ID")) %>%
        collect()
      
      creation_date = ref_row$DATE_CREATED
      
      object %>% 
        map_if(function(col_val) !(all(col_val=="")), unlist) %>% 
        iwalk(function(value,col_name) ref_row[[col_name]] <<- value)
      
      object = ref_row %>% select(-c(ID,DATE_MODIFIED,DATE_CREATED))
      
      object$DATE_CREATED = creation_date
    }
    
    object$ID = id %>% as.character()
    object$DATE_MODIFIED = Sys.time() %>% as.character()
    object$AUTHOR = user_name 
    
    if(table %>% filter(ID %in% id) %>% summarize(n=n()) %>% pull() == 0 | !is.na(update_id)){
      dbAppendTable(con, table_name, object)
      log_success(paste0("Added/updated: ", paste0(id, collapse = ", ")))
      return(id)
    } else {
      log_warn("This ID already exists in the table! Change ID or update")
      return(NULL)
    }
    
  })
}




setters_list$addCustomer = function(FIRST_NAME = NULL, LAST_NAME = NULL, update_id = NA){
  new_object = tibble(
    FIRST_NAME = FIRST_NAME,
    LAST_NAME = LAST_NAME)
  result = setters_list$appendTable("customers",new_object, prefix = "C", update_id = update_id)
  return(result)
}


setters_list$addProduct = function(PRODUCT_NAME = NULL, update_id = NA){
  new_object = tibble(
    PRODUCT_NAME = PRODUCT_NAME
  )
  result = setters_list$appendTable("products",new_object, prefix = "P", update_id = update_id)
  return(result)
}

setters_list$addTransaction = function(CUSTOMER_ID = NULL,PRODUCT_ID = NULL,TRANSMISSION_ID = NULL,PRODUCT_PRICE = NULL, IS_PAID = NULL, IS_DELIVERED = NULL, update_id = NA){
  new_object = tibble(
    CUSTOMER_ID = CUSTOMER_ID,
    PRODUCT_ID = PRODUCT_ID,
    TRANSMISSION_ID = TRANSMISSION_ID,
    PRODUCT_PRICE = PRODUCT_PRICE,
    IS_PAID = IS_PAID,
    IS_DELIVERED = IS_DELIVERED
  )
  result = setters_list$appendTable("transactions",new_object, prefix = "T", update_id = update_id)
  return(result)
}



