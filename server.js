const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 80; // Thay đổi port thành 80

const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Lỗi máy chủ');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(content);
        });
    } else if (req.url === '/api/ip') {
        let clientIp = req.socket.remoteAddress;
        // Xử lý địa chỉ IPv4 được ánh xạ trong IPv6 (ví dụ: ::ffff:192.168.1.5)
        if (clientIp && clientIp.substr(0, 7) === "::ffff:") {
            clientIp = clientIp.substr(7);
        }
        // Đối với kết nối localhost thuần IPv6
        if (clientIp === '::1') {
            clientIp = '127.0.0.1'; // Hiển thị dạng IPv4 quen thuộc hơn
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ip: clientIp }));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Không tìm thấy trang');
    }
});

server.listen(PORT, () => {
    console.log(`Máy chủ đang chạy tại http://localhost` + (PORT === 80 ? '' : `:${PORT}`));
    console.log(`Hoặc truy cập từ thiết bị khác trong cùng mạng LAN bằng địa chỉ IP của máy này` + (PORT === 80 ? '' : `:${PORT}`) + `, ví dụ: http://<IP_MAY_CHU>` + (PORT === 80 ? '' : `:${PORT}`));
});
