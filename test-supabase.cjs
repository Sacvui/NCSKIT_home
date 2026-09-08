const https = require('https');

const SUPABASE_URL = "https://xfftxehejtmxcoftkkmo.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZnR4ZWhlanRteGNvZnRra21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NzE2NjgsImV4cCI6MjA4NDU0NzY2OH0.zjtRDoXZ7VLQiF8Y2Uqvj4v7shwecjAB7ccHwKlBBSE";

console.log("========================================");
console.log("🚀 BẮT ĐẦU TEST KẾT NỐI SUPABASE");
console.log("========================================");
console.log(`URL: ${SUPABASE_URL}`);
console.log("Đang gọi API tới bảng 'academy_resources' dưới danh nghĩa người dùng ẩn danh (Anonymous)...");

const options = {
    hostname: SUPABASE_URL.replace('https://', ''),
    path: '/rest/v1/academy_resources?select=*',
    method: 'GET',
    headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`
    }
};

const req = https.request(options, (res) => {
    console.log(`\n📦 KẾT QUẢ TỪ MÁY CHỦ SUPABASE:`);
    console.log(`HTTP Status: ${res.statusCode} ${res.statusMessage}`);
    
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            const parsed = JSON.parse(data);
            console.log(`\n✅ THÀNH CÔNG! Trả về ${parsed.length} bản ghi.`);
            if (parsed.length === 0) {
                console.log("\n❌ CẢNH BÁO: Mảng dữ liệu trả về RỖNG [].");
                console.log("NGUYÊN NHÂN GỐC RỄ (ROOT CAUSE):");
                console.log("1. Bạn chưa Insert dữ liệu thành công (bảng thực sự rỗng).");
                console.log("2. RLS (Row Level Security) đang chặn luồng đọc Anonymous, khiến nó tự động trả về mảng rỗng thay vì báo lỗi.");
            } else {
                console.log("\nDữ liệu mẫu (Bản ghi đầu tiên):");
                console.log(JSON.stringify(parsed[0], null, 2).substring(0, 500) + '...\n');
            }
        } else {
            console.log(`\n❌ LỖI TRUY VẤN:`);
            console.log(data);
        }
        console.log("========================================\n");
    });
});

req.on('error', (error) => {
    console.error("\n❌ LỖI KẾT NỐI MẠNG:");
    console.error(error);
});

req.end();
