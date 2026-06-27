import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Hakkımızda & Yasal Bilgiler',
  description: 'RCetinkaya Turizm hakkında bilgi, KVKK aydınlatma metni, kullanım koşulları ve iptal politikası.',
};

const sections = [
  { id: 'hakkimizda', title: 'Hakkımızda' },
  { id: 'kvkk', title: 'KVKK Aydınlatma Metni' },
  { id: 'kullanim', title: 'Kullanım Koşulları' },
  { id: 'iptal', title: 'İptal Politikası' },
  { id: 'mesafeli', title: 'Mesafeli Satış Sözleşmesi' },
];

export default function HakkimizdaPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.eyebrow}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>info</span>
            Kurumsal
          </p>
          <h1 className={styles.title}>Hakkımızda & Yasal Bilgiler</h1>
          <p className={styles.desc}>
            RCetinkaya Turizm olarak Türkiye&apos;nin en seçkin villa portföyünü güvenli ve şeffaf bir rezervasyon deneyimiyle sunuyoruz.
          </p>
        </div>
      </section>

      <div className="container">
        <div className={styles.layout}>
          <nav className={styles.nav}>
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`} className={styles.navLink}>
                {s.title}
              </a>
            ))}
          </nav>

          <div className={styles.content}>
            <article id="hakkimizda" className={styles.section}>
              <h2>Hakkımızda</h2>
              <p>
                RCetinkaya Turizm, Akdeniz ve Ege kıyılarında lüks villa kiralama ve VIP transfer hizmetleri sunan,
                TÜRSAB onaylı bir turizm acentesidir. Fethiye, Bodrum, Antalya, Kalkan, Kaş ve İzmir bölgelerinde
                titizlikle seçilmiş villa portföyümüzle misafirlerimize unutulmaz tatil deneyimleri yaşatmayı hedefliyoruz.
              </p>
              <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                  <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--color-primary)' }}>verified</span>
                  <strong>TÜRSAB Onaylı</strong>
                  <span>Kayıtlı turizm acentesi güvencesi</span>
                </div>
                <div className={styles.infoCard}>
                  <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--color-success)' }}>lock</span>
                  <strong>Güvenli Ödeme</strong>
                  <span>iyzico ile 3D Secure ödeme</span>
                </div>
                <div className={styles.infoCard}>
                  <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--color-primary)' }}>support_agent</span>
                  <strong>7/24 Destek</strong>
                  <span>WhatsApp ve telefon desteği</span>
                </div>
              </div>
            </article>

            <article id="kvkk" className={styles.section}>
              <h2>KVKK Aydınlatma Metni</h2>
              <p>
                6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında, RCetinkaya Turizm olarak
                kişisel verilerinizin güvenliğine önem veriyoruz. Rezervasyon sürecinde toplanan ad, soyad, e-posta,
                telefon numarası ve kimlik bilgileriniz yalnızca rezervasyon işlemlerinin yürütülmesi, ödeme alınması
                ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir.
              </p>
              <ul>
                <li>Verileriniz üçüncü taraflarla yalnızca hizmet sunumu için paylaşılır (ödeme kuruluşu, villa sahibi).</li>
                <li>KVKK kapsamındaki haklarınız için <a href="mailto:info@rcetinkayaturizm.com">info@rcetinkayaturizm.com</a> adresine başvurabilirsiniz.</li>
                <li>Verileriniz Türkiye Cumhuriyeti sınırları içinde güvenli sunucularda saklanır.</li>
              </ul>
            </article>

            <article id="kullanim" className={styles.section}>
              <h2>Kullanım Koşulları</h2>
              <p>
                Bu web sitesini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız. Site üzerinden yapılan
                tüm rezervasyonlar RCetinkaya Turizm ile misafir arasında bağlayıcı sözleşme niteliği taşır.
              </p>
              <ul>
                <li>Rezervasyon fiyatları seçilen tarih aralığına göre hesaplanır ve onay anında sabitlenir.</li>
                <li>Villa kurallarına uyum misafirin sorumluluğundadır.</li>
                <li>Site içeriği ve görseller bilgilendirme amaçlıdır; küçük farklılıklar olabilir.</li>
                <li>Ödeme işlemleri iyzico güvenli ödeme altyapısı üzerinden gerçekleştirilir.</li>
              </ul>
            </article>

            <article id="iptal" className={styles.section}>
              <h2>İptal Politikası</h2>
              <p>Villa rezervasyonları için iptal koşulları aşağıdaki gibidir:</p>
              <ul>
                <li><strong>Giriş tarihinden 30+ gün önce:</strong> Tam iade (hizmet bedeli hariç)</li>
                <li><strong>Giriş tarihinden 15–29 gün önce:</strong> Toplam tutarın %50 iadesi</li>
                <li><strong>Giriş tarihinden 14 gün ve altı:</strong> İade yapılmaz</li>
                <li>Force majeure durumlarında özel değerlendirme yapılır.</li>
              </ul>
              <p>İptal talepleri için <Link href="/iletisim">iletişim formu</Link> veya WhatsApp üzerinden bize ulaşabilirsiniz.</p>
            </article>

            <article id="mesafeli" className={styles.section}>
              <h2>Mesafeli Satış Sözleşmesi</h2>
              <p>
                6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında,
                villa kiralama hizmeti mesafeli satış kapsamındadır. Rezervasyonunuzu tamamladığınızda bu sözleşmeyi
                kabul etmiş olursunuz.
              </p>
              <ul>
                <li>Satıcı: RCetinkaya Turizm</li>
                <li>Hizmet: Villa kiralama ve ilgili turizm hizmetleri</li>
                <li>Ödeme: Kredi kartı (iyzico 3D Secure) veya havale</li>
                <li>Teslimat: Belirtilen giriş tarihinde villa teslimi</li>
              </ul>
            </article>
          </div>
        </div>
      </div>
    </main>
  );
}
