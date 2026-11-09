// WhatsApp helpers. The number comes from WHATSAPP_NUMBER in the environment;
// 918797777269 is the verified business number and is only a fallback default.
function whatsappNumber() {
  return process.env.WHATSAPP_NUMBER || '918797777269';
}

function formatPrice(price) {
  return price == null ? 'Price on enquiry' : `Rs ${Number(price).toLocaleString('en-IN')}`;
}

function buildWhatsAppOrderMessage({ items, totalAmount, shippingAddress, paymentMethod }) {
  const lines = items.map((i) => `- ${i.name} x ${i.quantity} — ${formatPrice(i.price)}`);
  return [
    'Namaste, I want to place an order from Roushan Sewing Machine & Electronics:',
    ...lines,
    `Total (priced items): Rs ${Number(totalAmount).toLocaleString('en-IN')}`,
    `Payment: ${paymentMethod === 'COD' ? 'Cash on Delivery' : 'WhatsApp'}`,
    `Name: ${shippingAddress.name}`,
    `Phone: ${shippingAddress.phone}`,
    `Address: ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state || ''} ${shippingAddress.pinCode}`,
  ].join('\n');
}

function buildWhatsAppEnquiryMessage({ name, price, quantity = 1 }) {
  return `Namaste, I want to enquire about ${name} x ${quantity} — ${formatPrice(price)}. Please confirm the price and availability.`;
}

function whatsappLink(message) {
  return `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(message)}`;
}

module.exports = { whatsappNumber, formatPrice, buildWhatsAppOrderMessage, buildWhatsAppEnquiryMessage, whatsappLink };
