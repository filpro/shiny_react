# All functions list
getters_list = list()


getters_list$getTable = function(tablename, FUN = collect, show_all = FALSE, conInput = NA){
  action = function(con) {
      log_info("getTable - DECLARING TABLE:")
      if(!is.na(conInput)) con = conInput
      table = tbl(con, tablename)
      if (!show_all) {
        log_info("FILTERING")
        table = table %>% 
          mutate(rn = !!build_sql("ROW_NUMBER() OVER (PARTITION BY ID ORDER BY DATE_MODIFIED DESC)", con = con)) %>% 
          filter(rn == 1) %>% 
          filter(IS_DELETED == 0) %>%
          select(-c(rn))
      }
      log_info("getTable - STARTING SUBFUNCTION:")
      FUN(table, con)
  }
  
  if(!is.na(conInput)) {
    action(conInput)
  } else {
    oCC = openCloseConnection()
    oCC(action)
  }
}

### PARTICULAR DB FUNCTIONS ###

tablesList = openCloseConnection()(function(con) dbListTables(con))

# Utils

firstToUpper = function(str) {
  substr(str, 1, 1) <- toupper(substr(str, 1, 1))
  str
}

# GET ALL *
f_names = sprintf("getAll%s", tablesList %>% firstToUpper())
temp_f_list = lapply(tablesList, function(tblName) {
  function(FUN = collect, conInput = NA) {
    if(!is.na(conInput)) con = conInput
    getters_list$getTable(tblName, function(table, con) FUN(table))
  }
})
names(temp_f_list) = f_names
getters_list = getters_list %>% append(temp_f_list)

# GET * BY ID
f_names = sprintf("get%sById", tablesList %>% firstToUpper())
temp_f_list = lapply(tablesList, function(tblName) {
  function(id, FUN = collect, conInput = NA) {
    if(!is.na(conInput)) con = conInput
    getters_list$getTable(tblName, function(table, con){
      table %>% filter(ID %in% id) %>% FUN()
    })
  }
})
names(temp_f_list) = f_names
getters_list = getters_list %>% append(temp_f_list)












