# Content Gap Analysis — Phân Tích Lỗ Hổng Nội Dung AI

Công cụ phân tích đối soát nội dung SEO On-Page tự động giữa website của bạn và đối thủ cạnh tranh, sử dụng Kyma AI (Model Qwen 3 Coder).

## 🚀 Live Production URL
👉 **[https://penny-gap.vercel.app](https://penny-gap.vercel.app)**

## 📦 GitHub Repository
👉 **[https://github.com/pennydinh/content-gap-analysis](https://github.com/pennydinh/content-gap-analysis)**

## ✨ Tính năng chính
- **Crawl tự động**: Cào sitemap và bài viết trực tiếp từ website của bạn và 1 - 5 đối thủ.
- **Tùy chọn quy mô**: 10, 20, 50, 100 hoặc Toàn bộ website (Tối đa 500 trang).
- **Phân tích AI**: Bóc tách cụm từ khóa (N-grams), chủ đề bài viết còn thiếu, phân bổ định dạng (bảng giá, hướng dẫn, FAQ, so sánh...).
- **Ma trận ưu tiên**: Phân loại P0 (Thắng nhanh), P1 (Trọng tâm), P2, P3.
- **Lịch nội dung**: Tự động gợi ý lịch biên tập 12 tuần.
- **Cấu hình Kyma Key**: Tích hợp ô dán API Key lưu local trên máy người dùng + Nút đăng ký tài khoản Kyma API.
- **Xuất dữ liệu**: Xuất file CSV báo cáo từ khóa lỗ hổng.

## 🛠️ Công nghệ
- **Frontend**: React 19, Vite, Pennypage Light Theme Design System, Lucide SVG Icons.
- **Backend**: Express.js & Vercel Serverless Functions (`/api/analyze`).
- **AI Gateway**: Kyma API (Model `qwen-3-coder`).
