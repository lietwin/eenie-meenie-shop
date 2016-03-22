// Utils
exports.checkErr = (error) => {
  if (error) {
    console.log('Error ' + error);
    process.exit(1);
  }
}; //end checkErr()
