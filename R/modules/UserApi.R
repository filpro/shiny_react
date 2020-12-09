userApiModule = function(input, output, session) {
    userApi = session$registerDataObj(
        name = 'user-api',
        data = list(),
        filter = function(data, req) {
            if( req$REQUEST_METHOD == "POST" ) {
                received = req$rook.input$read_lines() %>% fromJSON()
                print(received)
                shiny:::httpResponse(200, 'application/json', received %>% toJSON(auto_unbox = TRUE))
            }
        }
    )
    session$sendCustomMessage('userApi', userApi)
}