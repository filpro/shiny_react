
# Provide that connection is opened and closed after completing task
openCloseConnection = function() {
  #options(warn = -1)
  function(FUN){
    log_info_dev("DB TO BE CONNECTED")
    con = DBI::dbConnect(
      drv = RMariaDB::MariaDB(),
      dbname = "babski_kram_dev",
      host = "192.168.0.88",
      username = "root",
      password = "root"
    )
    result = FUN(con)
    log_info_dev("DB TO BE DISCONNECTED")
    DBI::dbDisconnect(con)
    #options(warn = 0)
    return(result)
  }
}