# Nâng cấp trang chi tiết Sản phẩm & Blog

## 1. Trang chi tiết sản phẩm (`src/pages/ProductDetail.tsx`)
Phần **"Khám phá thêm hương vị khác"**:
- Bố cục cuộn ngang (horizontal scroll) siêu đẹp, hiển thị **3 card sản phẩm** vừa khít trong khung nhìn (mỗi card chiếm ~1/3 chiều rộng container trên desktop, 1.2 card trên mobile để gợi ý còn cuộn được).
- Thêm nút mũi tên **trái/phải** để cuộn (ẩn trên mobile, dùng vuốt).
- Card đẹp hơn: ảnh vuông nền dịu, hiệu ứng hover phóng ảnh + đổ bóng, badge danh mục, tên + mô tả 2 dòng, nút "Xem chi tiết".
- Giữ nút "Xem tất cả →" và tiêu đề section.
- Áp dụng cùng kiểu card cho phần **"Sản phẩm liên quan"** để đồng bộ.

## 2. Trang chi tiết blog (`src/pages/BlogDetail.tsx`)
Phần **"Bài viết liên quan"**:
- Mỗi bài viết hiển thị **hình ảnh** (dùng `post.imgUrl`, fallback ô "TOBE" khi chưa có ảnh).
- Card đẹp: ảnh tỉ lệ 16/9 bo góc, chủ đề (topic) dạng badge, tiêu đề, mô tả ngắn 2 dòng, ngày đăng, hiệu ứng hover.
- Làm toàn trang blog detail tinh tế hơn: khoảng cách, typography, khung nội dung.

## Chi tiết kỹ thuật
- Chỉ chỉnh sửa 2 file trên; dùng semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`...), không hardcode màu.
- Card width dùng `basis`/`w-[calc(...)]` để đúng 3 card/khung trên `lg`, responsive xuống mobile.
- Nút cuộn dùng `ref` + `scrollBy` với icon `ChevronLeft/ChevronRight` từ lucide-react.
- Không thay đổi dữ liệu, schema hay logic CMS.
