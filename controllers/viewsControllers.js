
exports.viewHome = async function (req, res) {
  res.render('index', { titleForm: 'Input Product', titleTable: 'Products', titleChat: 'Mini Chat'});
}