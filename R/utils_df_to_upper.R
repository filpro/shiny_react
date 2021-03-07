#' @importFrom purrr modify_depth
dfToUpper = function(df){
  result = modify_depth(df,2,function(x) ifelse(is.character(x), toupper(x), x))
  return(result)
}