import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { getPageContent } from "@/lib/supabase";
import { ContactContent, defaultContactContent } from "@/lib/content";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  const [contactContent, setContactContent] = useState<ContactContent>(defaultContactContent);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    async function fetchContact() {
      const content = await getPageContent<ContactContent>("contact", defaultContactContent);
      setContactContent(content);
      setLoading(false);
    }
    fetchContact();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");
    setForm({ name: "", email: "", message: "" });
  };

  if (loading) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Đang tải nội dung...</p>
          </div>
        </section>
      </Layout>
    );
  }

  const iconMap: { [key: string]: React.ComponentType<{ size: number; className: string }> } = {
    "Địa chỉ": MapPin,
    "Hotline": Phone,
    "Email": Mail,
    "Giờ làm việc": Clock,
  };

  return (
    <Layout>
      <section className="bg-foreground text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">{contactContent.hero.title}</h1>
          <p className="font-body text-primary-foreground/70 text-lg">{contactContent.hero.subtitle}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Info + Form */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {contactContent.info.map((item) => {
                const Icon = iconMap[item.label];
                return (
                  <div key={item.label} className="flex items-start gap-3">
                    {Icon && <Icon className="text-primary mt-1 shrink-0" size={20} />}
                    <div>
                      <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                      <p className="font-body text-sm font-medium">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-body text-sm font-medium block mb-1">Họ và tên</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-border rounded-sm px-4 py-3 font-body text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="font-body text-sm font-medium block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-border rounded-sm px-4 py-3 font-body text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="font-body text-sm font-medium block mb-1">Nội dung</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-border rounded-sm px-4 py-3 font-body text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  placeholder="Nhập nội dung tin nhắn..."
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto rounded-sm font-body uppercase tracking-wider text-xs px-8">
                Gửi tin nhắn
              </Button>
            </form>
          </div>

          {/* Right - Map */}
          <div className="rounded-sm overflow-hidden border border-border min-h-[400px]">
            <iframe
  title="B'Lao"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125096.40989196904!2d107.67887321099633!3d11.532995680503024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3173f7eb6431cb4d%3A0x77401a85c2d4756d!2zQidMYW8sIEzDom0gxJDhu5NuZywgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1781685885947!5m2!1svi!2s"
  width="100%"
  height="500"
  style={{ border: 0 }}
  loading="lazy"
  allowFullScreen
  referrerPolicy="no-referrer-when-downgrade"
/>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
