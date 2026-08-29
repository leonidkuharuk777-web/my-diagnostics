const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {

    // =========================
    // CORS
    // =========================

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }


    // =========================
    // ГЛАВНАЯ
    // =========================

    if (req.method === "GET" && req.url === "/") {

        fs.readFile(
            path.join(__dirname, "index.html"),
            "utf8",
            (err, html) => {

                if (err) {
                    res.writeHead(500);
                    res.end("index.html не найден");
                    return;
                }

                res.writeHead(200, {
                    "Content-Type":
                        "text/html; charset=utf-8"
                });

                res.end(html);
            }
        );

        return;
    }


    // =========================
    // ДИАГНОСТИКА
    // =========================

    if (
        req.method === "POST" &&
        req.url === "/diagnostics"
    ) {

        let body = "";

        req.on("data", chunk => {

            body += chunk;

            if (body.length > 200000) {
                req.destroy();
            }
        });


        req.on("end", () => {

            try {

                const data = JSON.parse(body);


                // =========================
                // СОЗДАЁМ ЗАПИСЬ
                // =========================

                const record = {

                    time:
                        new Date().toISOString(),

                    // Сохраняем старые поля
                    ip:
                        data.ip || "Недоступно",

                    localIP:
                        data.localIP || "Недоступно",

                    processor:
                        data.processor || "Недоступно",

                    cpuCores:
                        data.cpuCores || "Недоступно",

                    gpu:
                        data.gpu || "Недоступно",


                    // ОС / браузер
                    os:
                        data.os || "Недоступно",

                    browser:
                        data.browser || "Недоступно",


                    // Память
                    memory:
                        data.memory || "Недоступно",


                    // Экран
                    screen:
                        data.screen || "Недоступно",

                    availableScreen:
                        data.availableScreen ||
                        "Недоступно",

                    window:
                        data.window ||
                        "Недоступно",

                    pixelRatio:
                        data.pixelRatio ||
                        "Недоступно",

                    colorDepth:
                        data.colorDepth ||
                        "Недоступно",

                    orientation:
                        data.orientation ||
                        "Недоступно",


                    // Язык / время
                    language:
                        data.language ||
                        "Недоступно",

                    languages:
                        data.languages ||
                        "Недоступно",

                    timezone:
                        data.timezone ||
                        "Недоступно",

                    timezoneOffset:
                        data.timezoneOffset ||
                        "Недоступно",


                    // Интернет
                    connection:
                        data.connection ||
                        "Недоступно",

                    online:
                        data.online ??
                        "Недоступно",


                    // Браузер
                    cookies:
                        data.cookies ||
                        "Недоступно",

                    userAgent:
                        data.userAgent ||
                        "Недоступно",


                    // Дополнительные возможности
                    touchPoints:
                        data.touchPoints ||
                        "Недоступно",

                    platform:
                        data.platform ||
                        "Недоступно",

                    pdfViewer:
                        data.pdfViewer ||
                        "Недоступно",

                    webGL:
                        data.webGL ||
                        "Недоступно",

                    webGLVendor:
                        data.webGLVendor ||
                        "Недоступно",

                    webGLVersion:
                        data.webGLVersion ||
                        "Недоступно"
                };


                // =========================
                // ПАПКА
                // =========================

                const diagnosticsDir =
                    path.join(
                        __dirname,
                        "diagnostics"
                    );


                if (!fs.existsSync(
                    diagnosticsDir
                )) {

                    fs.mkdirSync(
                        diagnosticsDir,
                        {
                            recursive: true
                        }
                    );
                }


                // =========================
                // ИМЯ ФАЙЛА
                // =========================

                const now = new Date();

                const filename =
                    "diagnostic-" +
                    now.getFullYear() + "-" +
                    String(
                        now.getMonth() + 1
                    ).padStart(2, "0") + "-" +
                    String(
                        now.getDate()
                    ).padStart(2, "0") + "-" +
                    String(
                        now.getHours()
                    ).padStart(2, "0") +
                    String(
                        now.getMinutes()
                    ).padStart(2, "0") +
                    String(
                        now.getSeconds()
                    ).padStart(2, "0") + "-" +
                    String(
                        now.getMilliseconds()
                    ) +
                    ".json";


                // =========================
                // СОХРАНЕНИЕ
                // =========================

                fs.writeFileSync(

                    path.join(
                        diagnosticsDir,
                        filename
                    ),

                    JSON.stringify(
                        record,
                        null,
                        2
                    ),

                    "utf8"
                );


                // =========================
                // КОНСОЛЬ
                // =========================

                console.log("");
                console.log(
                    "===== ДИАГНОСТИКА ====="
                );

                console.log(
                    "Публичный IP:",
                    record.ip
                );

                console.log(
                    "Локальный IP:",
                    record.localIP
                );

                console.log(
                    "Процессор:",
                    record.processor
                );

                console.log(
                    "Ядра:",
                    record.cpuCores
                );

                console.log(
                    "Видеокарта:",
                    record.gpu
                );

                console.log(
                    "ОС:",
                    record.os
                );

                console.log(
                    "Браузер:",
                    record.browser
                );

                console.log(
                    "RAM:",
                    record.memory
                );

                console.log(
                    "Экран:",
                    record.screen
                );

                console.log(
                    "Окно:",
                    record.window
                );

                console.log(
                    "Pixel Ratio:",
                    record.pixelRatio
                );

                console.log(
                    "Язык:",
                    record.language
                );

                console.log(
                    "Языки:",
                    record.languages
                );

                console.log(
                    "Часовой пояс:",
                    record.timezone
                );

                console.log(
                    "Соединение:",
                    record.connection
                );

                console.log(
                    "Онлайн:",
                    record.online
                );

                console.log(
                    "Touch Points:",
                    record.touchPoints
                );

                console.log(
                    "Platform:",
                    record.platform
                );

                console.log(
                    "WebGL:",
                    record.webGL
                );

                console.log(
                    "======================="
                );

                console.log(
                    "Файл:",
                    filename
                );

                console.log("");


                // =========================
                // ОТВЕТ
                // =========================

                res.writeHead(200, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(
                    JSON.stringify({
                        success: true
                    })
                );


            } catch (error) {

                console.error(
                    "Ошибка:",
                    error
                );

                res.writeHead(400, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(
                    JSON.stringify({
                        success: false
                    })
                );
            }
        });

        return;
    }


    // =========================
    // 404
    // =========================

    res.writeHead(404);
    res.end("404 Not Found");
});


// =========================
// ЗАПУСК
// =========================

const PORT =
    process.env.PORT || 3000;

server.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log("");
        console.log(
            "=============================="
        );
        console.log(
            "       СЕРВЕР ЗАПУЩЕН"
        );
        console.log(
            "=============================="
        );
        console.log("");
        console.log(
            "Порт:",
            PORT
        );
        console.log("");
    }
);
