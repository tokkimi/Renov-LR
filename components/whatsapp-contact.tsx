const quoteMessage = [
  'Bonjour Rénov LR, je souhaiterais un devis pour des travaux de rénovation.',
  '',
  'Travaux envisagés :',
  'Ville :',
  'Période souhaitée :',
].join('\n');

export function whatsappQuoteUrl(phone: string) {
  let number = phone.replace(/\D/g, '');
  if (number.startsWith('00')) number = number.slice(2);
  else if (/^0[1-9]\d{8}$/.test(number)) number = '33' + number.slice(1);
  if (/^330[1-9]\d{8}$/.test(number)) number = '33' + number.slice(3);
  return /^[1-9]\d{7,14}$/.test(number)
    ? `https://wa.me/${number}?text=${encodeURIComponent(quoteMessage)}`
    : '';
}

export function WhatsAppIcon() {
  return (
    <svg className="rl-whatsapp-icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 0a11.9 11.9 0 0 0-10.3 17.87L.05 24l6.29-1.65A11.96 11.96 0 1 0 12.04 0Zm0 21.9a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.73.98 1-3.64-.24-.37a9.92 9.92 0 1 1 8.37 4.62Zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.28-.1-.48-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.29-.15-1.25-.46-2.39-1.47a9.02 9.02 0 0 1-1.65-2.06c-.17-.3-.02-.46.13-.61.13-.14.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.71.63.72.23 1.37.2 1.89.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.57-.35Z"/>
    </svg>
  );
}
