const { execFile } = require("child_process");
const path = require("path");

const databasePath = path.join(__dirname, "transport.db");


// =====================================================
// RUN SQLITE QUERY
// =====================================================

function execute(sql) {

    return new Promise((resolve, reject) => {

        execFile(

            "sqlite3",

            [

                "-separator",
                "|",

                databasePath,

                sql

            ],

            (error, stdout, stderr) => {

                if (error) {

                    return reject(

                        new Error(

                            stderr ||
                            error.message

                        )

                    );

                }


                const output =
                    stdout.trim();


                if (!output) {

                    return resolve([]);

                }


                const rows =
                    output
                        .split("\n")
                        .map(line => line.split("|"));


                resolve(rows);

            }

        );

    });

}


// =====================================================
// DATABASE API
// =====================================================

module.exports = {


    all(sql) {

        return execute(sql);

    },


    get(sql) {

        return execute(sql)

            .then(rows => {

                return rows[0] || null;

            });

    },


    run(sql) {

        return execute(sql);

    },


    close() {

        return Promise.resolve();

    }

};
