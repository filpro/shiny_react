# Utils
firstToUpper = function(str) {
  substr(str, 1, 1) <- toupper(substr(str, 1, 1))
  str
}