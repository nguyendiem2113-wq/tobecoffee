import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { getPageContent } from "@/lib/supabase";
import { ContactContent, defaultContactContent } from "@/lib/content";
import StaticMap from "@/components/StaticMap";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  type LucideIcon,
} from "lucide-react";

const Contact = () => {
  const [contactContent, setContactContent] =
    useState<ContactContent>(defaultContactContent);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    async function fetchContact() {
      const content = (await getPageContent<ContactContent>("contact")) ?? defaultContactContent;

      setContactContent(content);
      setLoading(false);
    }

    fetchContact();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");

    setForm({
      name: "",
      email: "",
      message: "",
    });
  };

  const iconMap: Record<string, LucideIcon> = {
    "Địa chỉ": MapPin,
    Hotline: Phone,
    Email: Mail,
    "Giờ làm việc": Clock,
  };

  if (loading) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">
              Đang tải nội dung...
            </p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* HERO */}
      <section className="bg-foreground text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
            {contactContent.hero.title}
          </h1>

          <p className="font-body text-primary-foreground/70 text-lg">
            {contactContent.hero.subtitle}
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {contactContent.info.map((item) => {
                const Icon = iconMap[item.label];

                return (
                  <div
                    key={item.label}
                    className="flex items-start gap-3"
                  >
                    {Icon && (
                      <Icon
                        size={20}
                        className="text-primary mt-1 shrink-0"
                      />
                    )}

                    <div>
                      <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                        {item.label}
                      </p>

                      <p className="font-body text-sm font-medium">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="font-body text-sm font-medium block mb-1">
                  Họ và tên
                </label>

                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="w-full border border-border rounded-sm px-4 py-3 font-body text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="font-body text-sm font-medium block mb-1">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className="w-full border border-border rounded-sm px-4 py-3 font-body text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="font-body text-sm font-medium block mb-1">
                  Nội dung
                </label>

                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      message: e.target.value,
                    })
                  }
                  className="w-full border border-border rounded-sm px-4 py-3 font-body text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  placeholder="Nhập nội dung tin nhắn..."
                />
              </div>

              <Button
                type="submit"
                className="w-full sm:w-auto rounded-sm font-body uppercase tracking-wider text-xs px-8"
              >
                Gửi tin nhắn
              </Button>
            </form>
          </div>

          {/* RIGHT - MAP (tĩnh, không nhúng iframe) */}
          <StaticMap
            address={
              contactContent.info.find((i) => i.label === "Địa chỉ")?.value ||
              "Bảo Lộc, Lâm Đồng, Việt Nam"
            }
            title="TOBE Coffee"
            className="min-h-[500px]"
          />
        </div>
      </section>
    </Layout>
  );
};

export default Contact;