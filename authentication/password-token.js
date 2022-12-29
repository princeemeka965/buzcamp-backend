import { router as _router, CryptoJS as _CryptoJS, conn as _mysqlConn, jwt, jwtSecretKey } from "../component/appHeaders.js";

_router.post("/passwordToken", function (req, res, next) {

    var email = _CryptoJS.RabbitLegacy.decrypt(req.body.__mailKQr, "my-secret-key@23");

    var name = '';

    var tokenNo = (Math.floor(Math.random() * 10000) + 90000).toString();

    var currentTime = Math.floor(Date.now() / 1000);
    var tokenExpires = currentTime + (86400).toString();

    const token = jwt.sign(tokenNo, jwtSecretKey);


    let sql = `SELECT * FROM users WHERE email = '${email}'`;
    _mysqlConn.query(sql, (err, results) => {
        if (results.length > 0) {

            let sql_1 = `UPDATE users SET tokenElapse = '${tokenExpires}', WHERE email = '${email}'`;
            _mysqlConn.query(sql_1);

            results.forEach((result) => {
                name = (result.name).split(" ");
            });

                    const dataBody = {
                        personalizations: [
                            {
                                to: [
                                    {
                                        email: `${email}`,
                                    },
                                ],
                                subject: "Buzcamp Password Reset",
                            },
                        ],
                        from: {
                            name: "Carrado",
                            email: "support@buzcamp.com",
                        },
                        content: [
                            {
                                type: "text/html",
                                value:
                                    '<div style="border: 1px solid #eee; width: 388px; padding: 46px 45px; margin: 50px auto">' +
                                    '<span style="margin-top: 20px;">' +
                                    '<h3 style="font-family: Roboto,Helvetica,Arial,sans-serif; font-size: 16px; line-height: 1.5em">' +
                                    '<strong> Hi' + name[1] + '</strong>' +
                                    '</h3>' +
                                    '<p style="font-family: Roboto,Helvetica,Arial,sans-serif; margin-top: 10px; font-size: 16px; line-height: 1.5em">' +
                                     'Someone recently requested to reset your Buzcamp account password. </p > ' +
                                    '<p style="font-family: Roboto,Helvetica,Arial,sans-serif; margin-top: 10px; font-size: 16px; line-height: 1.5em">' +
                                    'Use the button below to continue' +
                                    '<strong>' +
                                    '<a href="' + process.env.BUZCAMP_BASE_URL + '?reset_token=' + token + '&_setMail='+email+'" style="font-family: Roboto,Helvetica,Arial,sans-serif; margin-top: 6px; color: #fff; border-radius: 3px; padding: 6px 12px; display: inline-block; background-color: #38c172; border: 10px solid #38c172>' +
                                    'Reset your password'+
                                    '</a>' +
                                    '</strong>' +
                                    '</p>' +
                                    '</span>' +
                                    '<span style="margin-top: 20px;">' +
                                    '<p style="font-family: Roboto,Helvetica,Arial,sans-serif; font-size: 16px; line-height: 1.5em">' +
                                    'This password reset is only valid for the next 24 hours.' +
                                    '</p>' +
                                    '<p style="font-family: Roboto,Helvetica,Arial,sans-serif; margin-top: 10px; font-size: 16px; line-height: 1.5em">' +
                                    '<strong>' +
                                    'Note, if you did not request a password reset, please ignore this email.' +
                                    '</strong>' +
                                    '</p>' +
                                    '</span>' +
                                    '<span style="margin-top: 30px;">' +
                                    '<p style="font-family: Roboto,Helvetica,Arial,sans-serif; font-size: 16px; line-height: 1.5em">' +
                                    'Regards,' +
                                    'br />' +
                                    '<strong>' + 'Carrado Team' + '</strong>'+
                                    '</div>',
                            },
                        ],
                    };

                    const options = {
                        method: "POST",
                        url: `${process.env.EMAIL_API}`,
                        headers: {
                            "content-type": "application/json",
                            "X-RapidAPI-Key":
                                "d77e58d745msh315ac01c190b056p15860ajsnc32644a77641",
                            "X-RapidAPI-Host": "rapidprod-sendgrid-v1.p.rapidapi.com",
                        },
                        data: dataBody,
                    };

                    axios
                        .request(options)
                        .then((data) => res.json(data))
                        .catch((err) => next(err));
        }
        else {
            // Credentials entered does not have a valid User
            res.status(405).send({
                success: false,
                subscribed: false,
                message: "No account with this email address",
            });
        }
            });
        });

    export default _router;
