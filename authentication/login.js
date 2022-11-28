import { router as _router, CryptoJS as _CryptoJS, conn as _mysqlConn, jwt, jwtSecretKey } from "../component/appHeaders.js";

_router.post("/login", function (req, res, next) {
    var userId = "";

    var username = _CryptoJS.RabbitLegacy.decrypt(req.body.__ibTser, "my-secret-key@23");
    var decryptedUsername = username.toString(_CryptoJS.enc.Utf8);

    var password = _CryptoJS.RabbitLegacy.decrypt(req.body.__rPekey, "my-secret-key@123");
    var decryptedPassword = password.toString(_CryptoJS.enc.Utf8);

    let data = {
        username: decryptedUsername,
        password: decryptedPassword,
    };

    let sql = `SELECT * FROM users WHERE username = '${data.username}' AND password = '${data.password}'`;
    _mysqlConn.query(sql, (err, results) => {

        if (results.length > 0) {
            // Credentials entered, has a valid user
            results.forEach((result) => {
                userId = result.userId;
            });

            let sql_1 = `UPDATE users SET verification = '${req.sessionID}', WHERE userId = '${userId}'`;
            _mysqlConn.query(sql_1);

            let sql_2 = `INSERT INTO sessions (session_id, expires, data) 
            VALUES ('${req.sessionID}', '${req.session.cookie.originalMaxAge
                }', '${JSON.stringify(req.session)}')`;

            _mysqlConn.query(sql_2, function (err, result) {
                if (err) {
                    res.status(405).send({
                        success: false,
                        subscribed: false,
                        message: "Login Failed... Please try again later",
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
        }
        else {
            // Credentials entered does not have a valid User
            res.status(405).send({
                success: false,
                subscribed: false,
                message: "Invalid Username or Password",
            });
        }
    });
});

export default _router;
