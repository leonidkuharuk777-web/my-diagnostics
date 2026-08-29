
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

const diagnosticsDir = path.join(__dirname, "diagnostics");

// Создаём папку для диагностики при запуске
if (!fs.existsSync(diagnosticsDir)) {
    fs.mkdirSync(diagnosticsDir, { recursive: true });
}


const server = http.createServer((req, res) => {

    // ========================================
    // CORS
    // ========================================

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );


    // ========================================
    // OPTIONS / CORS PREFLIGHT
    // ========================================

    if (req.method === "OPTIONS") {

        res.writeHead(204);
        res.end();

        return;
    }


    // ========================================
    // ГЛАВНАЯ
    // ========================================

    if (
        req.method === "GET" &&
        req.url === "/"
    ) {

        fs.readFile(
            path.join(__dirname, "index.html"),
            "utf8",
            (err, html) => {

                if (err) {

                    console.error(
                        "Ошибка чтения index.html:",
                        err
                    );

                    res.writeHead(500, {
                        "Content-Type":
                            "text/plain; charset=utf-8"
                    });

                    res.end(
                        "index.html не найден"
                    );

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


    // ========================================
    // ПРОВЕРКА СЕРВЕРА
    // ========================================

    if (
        req.method === "GET" &&
        req.url === "/health"
    ) {

        res.writeHead(200, {
            "Content-Type":
                "application/json; charset=utf-8"
        });

        res.end(
            JSON.stringify({
                online: true,
                server: "my-diagnostics"
            })
        );

        return;
    }


    // ========================================
    // ПОЛУЧЕНИЕ ДИАГНОСТИКИ
    // ========================================

    if (
        req.method === "POST" &&
        req.url === "/diagnostics"
    ) {

        let body = "";


        req.on("data", chunk => {

            body += chunk.toString();


            // Защита от слишком большого запроса
            if (body.length > 500000) {

                res.writeHead(413, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(
                    JSON.stringify({
                        success: false,
                        error: "Слишком большой запрос"
                    })
                );

                req.destroy();

                return;
            }
        });


        req.on("end", () => {

            try {

                // ========================================
                // JSON
                // ========================================

                const data = JSON.parse(body);


                // ========================================
                // СОЗДАЁМ ЗАПИСЬ
                // ========================================

                const record = {

                    // Время получения сервером
                    time:
                        new Date().toISOString(),


                    // Публичный IP,
                    // который передал клиент
                    ip:
                        data.ip ?? "Недоступно",


                    // Сетевые данные
                    localIP:
                        data.localIP ?? "Недоступно",

                    connection:
                        data.connection ?? "Недоступно",

                    online:
                        data.online ?? "Недоступно",


                    // Система
                    os:
                        data.os ?? "Недоступно",

                    platform:
                        data.platform ?? "Недоступно",

                    processor:
                        data.processor ?? "Недоступно",

                    cpuCores:
                        data.cpuCores ?? "Недоступно",

                    memory:
                        data.memory ?? "Недоступно",


                    // Браузер
                    browser:
                        data.browser ?? "Недоступно",

                    userAgent:
                        data.userAgent ?? "Недоступно",

                    language:
                        data.language ?? "Недоступно",

                    languages:
                        data.languages ?? "Недоступно",

                    timezone:
                        data.timezone ?? "Недоступно",


                    // Графика
                    gpu:
                        data.gpu ?? "Недоступно",

                    webGL:
                        data.webGL ?? "Недоступно",

                    webGLVendor:
                        data.webGLVendor ?? "Недоступно",

                    webGLRenderer:
                        data.webGLRenderer ?? "Недоступно",


                    // Экран
                    screen:
                        data.screen ?? "Недоступно",

                    window:
                        data.window ?? "Недоступно",

                    pixelRatio:
                        data.pixelRatio ?? "Недоступно",

                    orientation:
                        data.orientation ?? "Недоступно",


                    // Ввод
                    touchPoints:
                        data.touchPoints ?? "Недоступно",


                    // Хранилище
                    cookies:
                        data.cookies ?? "Недоступно",

                    localStorage:
                        data.localStorage ?? "Недоступно",


                    // Настройки
                    darkMode:
                        data.darkMode ?? "Недоступно"
                };


                // ========================================
                // УНИКАЛЬНОЕ ИМЯ ФАЙЛА
                // ========================================

                const now = new Date();

                const filename =
                    "diagnostic-" +

                    now.getFullYear() +

                    "-" +

                    String(
                        now.getMonth() + 1
                    ).padStart(2, "0") +

                    "-" +

                    String(
                        now.getDate()
                    ).padStart(2, "0") +

                    "-" +

                    String(
                        now.getHours()
                    ).padStart(2, "0") +

                    String(
                        now.getMinutes()
                    ).padStart(2, "0") +

                    String(
                        now.getSeconds()
                    ).padStart(2, "0") +

                    "-" +

                    String(
                        now.getMilliseconds()
                    ).padStart(3, "0") +

                    ".json";


                const filePath =
                    path.join(
                        diagnosticsDir,
                        filename
                    );


                // ========================================
                // СОХРАНЕНИЕ
                // ========================================

                fs.writeFileSync(
                    filePath,
                    JSON.stringify(
                        record,
                        null,
                        2
                    ),
                    "utf8"
                );


                // ========================================
                // КОНСОЛЬ
                // ========================================

                console.log("");
                console.log(
                    "========================================"
                );
                console.log(
                    "          ===== ДИАГНОСТИКА ====="
                );
                console.log(
                    "========================================"
                );

                console.log(
                    "Публичный IP:",
                    record.ip
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
                    "Процессор:",
                    record.processor
                );

                console.log(
                    "Ядра:",
                    record.cpuCores
                );

                console.log(
                    "RAM:",
                    record.memory
                );

                console.log(
                    "Видеокарта:",
                    record.gpu
                );

                console.log(
                    "WebGL Vendor:",
                    record.webGLVendor
                );

                console.log(
                    "WebGL Renderer:",
                    record.webGLRenderer
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
                    "Все языки:",
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
                    "Cookies:",
                    record.cookies
                );

                console.log(
                    "LocalStorage:",
                    record.localStorage
                );

                console.log(
                    "Тёмная тема:",
                    record.darkMode
                );

                console.log(
                    "Файл:",
                    filename
                );

                console.log(
                    "========================================"
                );
                console.log("");


                // ========================================
                // ОТВЕТ
                // ========================================

                res.writeHead(200, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(
                    JSON.stringify({
                        success: true,
                        file: filename
                    })
                );


            } catch (error) {

                console.error(
                    "Ошибка обработки диагностики:",
                    error
                );


                res.writeHead(400, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(
                    JSON.stringify({
                        success: false,
                        error: "Некорректный JSON"
                    })
                );
            }
        });

        return;
    }


    // ========================================
    // 404
    // ========================================

    res.writeHead(404, {
        "Content-Type":
            "text/plain; charset=utf-8"
    });

    res.end("404 Not Found");
});


// ========================================
// ЗАПУСК
// ========================================

server.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log("");
        console.log(
            "========================================"
        );
        console.log(
            "             СЕРВЕР ЗАПУЩЕН"
        );
        console.log(
            "========================================"
        );

        console.log(
            "Порт:",
            PORT
        );

        console.log(
            "Локально:",
            "http://localhost:" + PORT
        );

        console.log(
            "Диагностика:",
            "/diagnostics"
        );

        console.log(
            "Проверка:",
            "/health"
        );

        console.log(
            "Сохранение:",
            diagnosticsDir
        );

        console.log(
            "========================================"
        );
        console.log("");
    }
);

