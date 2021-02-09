#' @import dplyr
checkIfExistsTransaction = function(productName, transactionDate) {
            oCC = openCloseConnection()
            doesExists = oCC(function(con){
                products = tbl(con, "products")
                result = (tbl(con, "transactions") %>%
                    filter(TRANSMISSION_ID == transactionDate) %>%
                    left_join(products, by = c("PRODUCT_ID" = "ID")) %>%
                    filter(PRODUCT_NAME == productName) %>% summarize(nrows = n()) %>%
                    pull()) > 0
                result
            })
            doesExists
}