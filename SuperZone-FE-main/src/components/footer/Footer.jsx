import './FooterStyle.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <h4>Hakkımızda</h4>
                <p>
                    SuperZone, kullanıcı dostu arayüzü ve kaliteli ürünleriyle
                    alışveriş deneyiminizi en üst seviyeye çıkarmayı amaçlar.
                </p>
            </div>
            <div className="footer-bottom">
                © {new Date().getFullYear()} SuperZone. Tüm hakları saklıdır.
            </div>
        </footer>
    );
}
