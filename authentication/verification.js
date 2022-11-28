import { router as _router, CryptoJS as _CryptoJS, conn as _mysqlConn, jwt, jwtSecretKey } from "../component/appHeaders.js";

_router.post("/verify-account", function (req, res, next) {
    var currentTime = Math.floor(Date.now() / 1000).toString();

    var token = req.body.__tkLd5a;

    var userId = "";

    let sql = `SELECT * FROM users WHERE token = '${token}' AND tokenElapse < '${currentTime}'`;
    let fquery = _mysqlConn.query(sql, (err, results) => {
        results.forEach((result) => {
            userId = result.userId;
        });

        if (results.length > 0) {
            let sql_1 = `UPDATE users SET verification = '${req.sessionID}', token = '', tokenElapse = '' WHERE userId = '${userId}'`;
            _mysqlConn.query(sql_1);

            let sql_2 = `INSERT INTO sessions (session_id, expires, data) 
      VALUES ('${req.sessionID}', '${req.session.cookie.originalMaxAge
                }', '${JSON.stringify(req.session)}')`;

            _mysqlConn.query(sql_2, function (err, result) {
                if (err) {
                    res.status(405).send({
                        success: false,
                        subscribed: false,
                        message: "Error in validating OTP",
                    });
                }
                else {
                    let tokenData = {
                        session: `${req.sessionID}`,
                    }

                    const jsToken = jwt.sign(tokenData, jwtSecretKey);

                    res.status(200).send({
                        success: true,
                        subscribed: true,
                        data: { __tkI9shaB: jsToken }
                    });
                }
            });
        } else {
            res.status(405).send({
                success: false,
                subscribed: false,
                message: "OTP entered is invalid",
            });
        }
    });
});

export default _router;

