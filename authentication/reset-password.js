import { router as _router, CryptoJS as _CryptoJS, conn as _mysqlConn, jwt, axios, jwtSecretKey } from "../component/appHeaders.js";

_router.post("/reset", function (req, res, next) {

    var password = _CryptoJS.RabbitLegacy.decrypt(req.body.__rPeLikey, "my-secret-key@123");
    var decryptedPassword = password.toString(_CryptoJS.enc.Utf8);

    var tokenNo = _CryptoJS.RabbitLegacy.decrypt(req.body.__csIPAceltkN, "my-secret-key@123");
    var decryptedToken = tokenNo.toString(_CryptoJS.enc.Utf8);


    let sql = `SELECT * FROM users WHERE token = '${decryptedToken}'`;
    _mysqlConn.query(sql, (err, results) => {
        if (results.length > 0) {

            let sql_1 = `UPDATE users SET password = '${decryptedPassword}', token = '', tokenElapse = '' WHERE token = '${decryptedToken}'`;
            _mysqlConn.query(sql_1, (err) => {
                if (err) {
                    res
                        .status(500)
                        .send({ success: false, message: "Error in resetting Password" });
                }
                else {
                    res
                        .status(200)
                        .send({ success: false, message: "Password changed successfully..." });
                }
            });
        }
        else {
            // No User with the request TOKEN
            res.status(401).send({
                success: false,
                subscribed: false,
                message: "Unauthorized to process request",
            });
        }
    });
});

export default _router;
