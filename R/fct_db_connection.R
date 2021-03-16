
# Provide that connection is opened and closed after completing task
#' @import DBI
#' @import future
#' @import promises
openCloseConnection = function() {
  #options(warn = -1)
  function(FUN){
    log_info_dev("DB TO BE CONNECTED")
    con = DBI::dbConnect(
      drv = RMariaDB::MariaDB(),
      dbname = "babski_kram_test",
      host = "192.168.0.88",
      username = "root",
      password = "root"
    )    

    result = FUN(con)
    log_info_dev("DB TO BE DISCONNECTED")
    future(DBI::dbDisconnect(con))
    #options(warn = 0)
    return(result)
  }
}