class ErrorController {
  index({ params, response, view }) {
    const { errorCode } = params;

    response.status(errorCode);

    return view.render('error', {
      errorCode,
    });
  }
}

module.exports = ErrorController;
