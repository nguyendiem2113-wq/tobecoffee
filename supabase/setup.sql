-- Supabase database setup for content-managed pages
-- Run this script in Supabase SQL editor or via psql.

create extension if not exists pgcrypto;

create table if not exists page_contents (
  id uuid primary key default gen_random_uuid(),
  page text not null unique,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table page_contents enable row level security;

create policy "Public read page contents"
  on page_contents
  for select
  using (true);

create policy "Authenticated insert page contents"
  on page_contents
  for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated update page contents"
  on page_contents
  for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated delete page contents"
  on page_contents
  for delete
  using (auth.role() = 'authenticated');

-- Seed records with complete default data structure
insert into page_contents (page, content)
values
  ('index', '{
    "hero": {
      "title": "Cà phê Việt Nam chuẩn chất lượng",
      "subtitle": "Đem tinh túy cà phê từ nông trại đến tay bạn",
      "imageUrl": ""
    },
    "productCategories": [],
    "stats": [],
    "blogPosts": []
  }'),
  ('story', '{
    "hero": {
      "title": "Giới thiệu TOBE",
      "subtitle": "Brew Bold, Be TOBE",
      "imageUrl": ""
    },
    "missions": [
      {
        "icon": "🌍",
        "title": "Nâng Tầm Giá Trị Cà Phê Việt Trên Bản Đồ Thế Giới",
        "desc": "Từ mối liên kết với hơn 600 hộ nông dân trồng cà phê tại Lâm Đồng, TOBE ứng dụng mô hình thu mua quả chín, tổ chức hội thảo tập huấn hàng năm, thay đổi thời quen sản xuất để nâng cao chất lượng cà phê."
      },
      {
        "icon": "🌱",
        "title": "Cải Thiện Đời Sống Người Nông Dân Trồng Cà Phê",
        "desc": "Dựa trên niềm tin và sự hợp tác bền vững, đi kèm với chính sách công thưởng về sản lượng và chất lượng nguyên liệu, TOBE muốn góp phần cải thiện đời sống của người nông dân và hệ sinh thái cà phê."
      },
      {
        "icon": "☕",
        "title": "Để Người Việt Được Thưởng Thức Cà Phê Ngon",
        "desc": "Luôn nỗ lực đi đầu về chất lượng, TOBE mang đến người tiêu dùng Việt Nam những sản phẩm cà phê tươi mới và thơm ngon nhất. Bởi quan trọng hơn cả, người Việt xứng đáng được thưởng thức cà phê ngon."
      }
    ],
    "stats": [
      { "number": "90%+", "label": "Tỷ lệ quả chín đạt chuẩn sản xuất sang xay nguyên chất" },
      { "number": "600+", "label": "Nông hộ liên kết trồng & sản xuất nhân xanh chất lượng cao" },
      { "number": "2000+", "label": "Tấn nguyên liệu chất lượng cao khai thác nguồn cung cả mùa vụ" },
      { "number": "150+", "label": "Tấn cà phê rang xay cung ứng cho khách hàng mỗi năm" }
    ],
    "services": [
      {
        "imgUrl": "",
        "label": "Cung ứng",
        "title": "Cung Ứng Cà Phê Nhân Xanh",
        "desc": "Nguồn nguyên liệu tốt sẽ tạo nên sản phẩm chất lượng. TOBE cam kết nguồn cung cà phê nhân xanh chất lượng cao suốt niên vụ cho các nhà rang xay và doanh nghiệp sản xuất thương mại."
      },
      {
        "imgUrl": "",
        "label": "Cung cấp",
        "title": "Cung Cấp Cà Phê Rang Xay",
        "desc": "Đồ uống ngon là phần tử quyết định tạo nên sự thành công của một thương hiệu. Vì vậy, ưu tiên hàng đầu của TOBE là hạt cà phê phải tươi mới và hợp vị khi giao đến khách hàng."
      },
      {
        "imgUrl": "",
        "label": "Tư vấn giải pháp",
        "title": "Tư Vấn Giải Pháp Kinh Doanh Cà Phê",
        "desc": "TOBE đồng hành cùng đối tác và khách hàng trong các giải pháp về đầu tư chi phí, quản lý chất lượng và phát triển kinh doanh, tối ưu nhu cầu sử dụng sản phẩm tại địa điểm kinh doanh."
      }
    ]
  }'),
  ('product', '{
    "hero": {
      "title": "Sản phẩm",
      "subtitle": "Đa dạng lựa chọn cho mọi gu thưởng thức",
      "imageUrl": ""
    },
    "products": []
  }'),
  ('blog', '{
    "title": "Tin tức & Blog",
    "subtitle": "Cập nhật kiến thức và câu chuyện cà phê",
    "posts": []
  }'),
  ('contact', '{
    "hero": {
      "title": "Liên hệ",
      "subtitle": "Chúng tôi luôn sẵn sàng lắng nghe bạn",
      "imageUrl": ""
    },
    "info": [
      { "label": "Địa chỉ", "value": "Lô CN9 P, KCN, B''Lao, Lâm Đồng 66450, Việt Nam" },
      { "label": "Hotline", "value": "0909 806 947" },
      { "label": "Email", "value": "tobebaoloc@gmail.com" },
      { "label": "Giờ làm việc", "value": "T2 – T7: 8:00 – 18:00" }
    ]
  }')
on conflict (page) do nothing;

