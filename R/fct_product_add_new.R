productAddNew = function(productName) {
    productId = addProduct(PRODUCT_NAME = productName)
    result = getProductsById(productId) %>% as.list()
    result
}