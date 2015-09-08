export default function () {
  return function (err, req, res, next) {
    res.status(
      err.code || err.statusCode || 500
    ).send(
      err.message || 'Error'
    );
  };
}
