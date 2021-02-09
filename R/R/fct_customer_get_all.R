#' @import dplyr
customerGetAll = function() {
                oCC = openCloseConnection()
                customers = oCC(function(con){
                    customers = tbl(con, 'customers')
                    transactions = tbl(con, 'transactions')
                    result = customers %>% left_join(transactions %>% 
                        group_by(CUSTOMER_ID) %>% 
                        summarize(LAST_TRANSACTION = max(DATE_CREATED)), by=c("ID" = "CUSTOMER_ID")) %>% 
                        collect() 
                })
                customers
}