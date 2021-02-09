customerAddNew = function(received) {
    newCustomerId = addCustomer(
                    FIRST_NAME = received$FIRST_NAME,
                    LAST_NAME = received$LAST_NAME)
    result = getCustomersById(newCustomerId) 
    result
}