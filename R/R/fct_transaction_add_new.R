transactionAddNew = function(received) {
    result = addTransaction(
                    CUSTOMER_ID = received$CUSTOMER_ID,
                    PRODUCT_ID = received$PRODUCT_ID,
                    TRANSMISSION_ID = as.Date(received$TRANSMISSION_ID) %>% as.character(),
                    PRODUCT_PRICE = received$PRODUCT_PRICE,
                    IS_PAID = FALSE,
                    IS_DELIVERED = FALSE
                )
    response = getTransactionsById(result)
    response
}