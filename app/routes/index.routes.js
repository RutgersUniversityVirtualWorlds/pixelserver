module.exports = function(app) {
  app.get('/', function(req, res) {
    //recall we set views to ./app/views
    res.render('pages/index.ejs');
  });
};
