
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {
    
    res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");

if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
}

    // =========================
    // ГЛАВНАЯ СТРАНИЦА
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
                    "Content-Type": "text/html; charset=utf-8"
                });

                res.end(html);
            }
        );

        return;
    }


    // =========================
    // ДИАГНОСТИКА
    // =========================

    if (req.method === "POST" && req.url === "/diagnostics") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;

            if (body.length > 100000) {
                req.destroy();
            }
        });

        req.on("end", () => {

            try {

                const data = JSON.parse(body);

                const record = {
                    time: new Date().toISOString(),

                    ip: data.ip || "Недоступно",

                    localIP: data.localIP || "Недоступно",

                    os: data.os || "Недоступно",

                    browser: data.browser || "Недоступно",

                    processor:
                        data.processor || "Недоступно",

                    cpuCores:
                        data.cpuCores || "Недоступно",

                    memory:
                        data.memory || "Недоступно",

                    gpu:
                        data.gpu || "Недоступно",

                    screen:
                        data.screen || "Недоступно",

                    window:
                        data.window || "Недоступно",

                    pixelRatio:
                        data.pixelRatio || "Недоступно",

                    language:
                        data.language || "Недоступно",

                    timezone:
                        data.timezone || "Недоступно",

                    connection:
                        data.connection || "Недоступно",

                    cookies:
                        data.cookies || "Недоступно",

                    userAgent:
                        data.userAgent || "Недоступно"
                };


                const diagnosticsDir = path.join(__dirname, "diagnostics");

if (!fs.existsSync(diagnosticsDir)) {
    fs.mkdirSync(diagnosticsDir);
}

const now = new Date();

const filename =
    `diagnostic-${now.getFullYear()}-` +
    `${String(now.getMonth() + 1).padStart(2, "0")}-` +
    `${String(now.getDate()).padStart(2, "0")}-` +
    `${String(now.getHours()).padStart(2, "0")}` +
    `${String(now.getMinutes()).padStart(2, "0")}` +
    `${String(now.getSeconds()).padStart(2, "0")}-` +
    `${now.getMilliseconds()}.json`;

fs.writeFileSync(
    path.join(diagnosticsDir, filename),
    JSON.stringify(record, null, 2),
    "utf8"
);

                console.log("");
                console.log("===== ДИАГНОСТИКА =====");
                console.log("Публичный IP:", record.ip);
                console.log("Локальный IP:", record.localIP);
                console.log("Процессор:", record.processor);
                console.log("Ядра:", record.cpuCores);
                console.log("Видеокарта:", record.gpu);
                console.log("=======================");
                console.log("");


                res.writeHead(200, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(JSON.stringify({
                    success: true
                }));


            } catch (error) {

                console.error(error);

                res.writeHead(400, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(JSON.stringify({
                    success: false
                }));
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


server.listen(process.env.PORT || 3000, "0.0.0.0", () => {
    const port = process.env.PORT || 3000;

    console.log("");
    console.log("==============================");
    console.log("       СЕРВЕР ЗАПУЩЕН");
    console.log("==============================");
    console.log("");
    console.log("Открой:");
    console.log("http://localhost:" + port);
    console.log("");
});
