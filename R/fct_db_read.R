#' @import dbplyr
getTable = function(tablename, FUN = collect, show_all = FALSE, conInput = NA){
  action = function(con) {
      log_info_dev("getTable - DECLARING TABLE:")
      table = dplyr::tbl(con, tablename)
      if (!show_all) {
        log_info_dev("FILTERING")
        table = table %>% 
          mutate(rn = !!build_sql("ROW_NUMBER() OVER (PARTITION BY ID ORDER BY DATE_MODIFIED DESC)", con = con)) %>% 
          filter(rn == 1) %>% 
          filter(IS_DELETED == 0) %>%
          select(-c(rn))
      }
      log_info_dev("getTable - STARTING SUBFUNCTION:")
      FUN(table, con)
  }

  if(!is.na(conInput)) {
    action(conInput)
  } else {
    oCC = openCloseConnection()
    oCC(action)
  }
}


getAllTransactions = function(FUN = collect, conInput = NA) {
    if(!is.na(conInput)) con = conInput
    getTable('transactions', function(table, con) FUN(table))
}

getAllTransmissions = function(FUN = collect, conInput = NA) {
    if(!is.na(conInput)) con = conInput
    getTable('transmissions', function(table, con) FUN(table))
}

getAllProducts = function(FUN = collect, conInput = NA) {
    if(!is.na(conInput)) con = conInput
    getTable('products', function(table, con) FUN(table))
}

getAllCustomers = function(FUN = collect, conInput = NA) {
    if(!is.na(conInput)) con = conInput
    getTable('customers', function(table, con) FUN(table))
}

getTransactionsById = function(id, FUN = collect, conInput = NA) {
    if(!is.na(conInput)) con = conInput
    getTable('transactions', function(table, con){
      table %>% filter(ID %in% id) %>% FUN()
    })
}

getTransmissionsById = function(id, FUN = collect, conInput = NA) {
    if(!is.na(conInput)) con = conInput
    getTable('transmissions', function(table, con){
      table %>% filter(ID %in% id) %>% FUN()
    })
}
getProductsById = function(id, FUN = collect, conInput = NA) {
    if(!is.na(conInput)) con = conInput
    getTable('products', function(table, con){
      table %>% filter(ID %in% id) %>% FUN()
    })
}
getCustomersById = function(id, FUN = collect, conInput = NA) {
    if(!is.na(conInput)) con = conInput
    getTable('customers', function(table, con){
      table %>% filter(ID %in% id) %>% FUN()
    })
}













