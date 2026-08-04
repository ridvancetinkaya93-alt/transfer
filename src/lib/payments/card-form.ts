export interface CardFormValues {
  cardHolder: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function detectCardBrand(number: string): 'visa' | 'mastercard' | 'unknown' {
  const digits = number.replace(/\D/g, '');
  if (digits.startsWith('4')) return 'visa';
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'mastercard';
  return 'unknown';
}

export function maskCardNumber(number: string): string {
  const digits = number.replace(/\D/g, '');
  const padded = digits.padEnd(16, '•');
  return padded.replace(/(.{4})/g, '$1 ').trim();
}

export function validateCardForm(values: CardFormValues): string | null {
  const digits = values.cardNumber.replace(/\D/g, '');
  if (digits.length < 15) return 'Geçerli bir kart numarası girin.';
  if (!values.cardHolder.trim()) return 'Kart üzerindeki ismi girin.';

  const month = Number(values.expiryMonth);
  const year = Number(values.expiryYear);
  if (!month || month < 1 || month > 12) return 'Geçerli bir son kullanma ayı girin.';
  if (!year || values.expiryYear.length !== 2) return 'Geçerli bir son kullanma yılı girin (YY).';

  const now = new Date();
  const expiry = new Date(2000 + year, month, 0, 23, 59, 59);
  if (expiry < now) return 'Kartın son kullanma tarihi geçmiş.';

  const cvv = values.cvv.replace(/\D/g, '');
  if (cvv.length < 3) return 'Geçerli bir CVV girin.';

  return null;
}

export function injectCheckoutHtml(container: HTMLElement, html: string) {
  container.innerHTML = html;
  container.querySelectorAll('script').forEach(oldScript => {
    const script = document.createElement('script');
    Array.from(oldScript.attributes).forEach(attr => {
      script.setAttribute(attr.name, attr.value);
    });
    script.textContent = oldScript.textContent;
    oldScript.replaceWith(script);
  });
}
