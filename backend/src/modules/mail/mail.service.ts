import transporter from "../../config/mail.config";

// This interface for a single item remains the same
interface EmailOrderItem {
  productName: string;
  imageUrl: string | null;
  quantity: number;
  unitPrice: string;
}

// This is the data structure the function will receive. It's already perfect.
export interface OrderDetailsForEmail {
  to: string;
  orderId: number;
  totalAmount: string;
  items: EmailOrderItem[];
}

export async function sendConfirmationEmail(details: OrderDetailsForEmail) {

  // --- DYNAMICALLY CREATE HTML ROWS FOR EACH ITEM ---
  // This is the key change. We map over the 'items' array.
  const itemRowsHtml = details.items.map(item => `
    <tr style="border-bottom: 1px solid #eeeeee;">
        <td style="padding: 15px 5px; display: flex; align-items: center;">
            <img 
                src="${item.imageUrl || 'https://via.placeholder.com/60'}" 
                alt="${item.productName}" 
                style="width: 60px; height: 60px; margin-right: 15px; border-radius: 4px;"
            >
            <span style="font-weight: bold; color: #333;">${item.productName}</span>
        </td>
        <td style="padding: 15px 5px; text-align: center;">${item.quantity}</td>
        <td style="padding: 15px 5px; text-align: right;">$${(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}</td>
    </tr>
  `).join(''); // Join all the rows into a single string of HTML

  // --- THE MAIN EMAIL TEMPLATE ---
  // We will inject the itemRowsHtml into the table body.
  const mailOptions = {
      from: `"ElectroVision Company" <${process.env.MAIL_USER}>`,
      to: details.to,
      subject: `Your ElectroVision Order is Confirmed (#${details.orderId})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #f4f7f6;">
            <div style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                
                <div style="background-color: #0d6efd; color: #ffffff; padding: 25px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    <h1 style="margin: 0; font-size: 28px;">Thank You For Your Order!</h1>
                </div>
                
                <div style="padding: 25px; color: #333333; line-height: 1.6;">
                    <p>Hi there,</p>
                    <p>Your order has been successfully placed. We're getting it ready and will notify you once it's on its way. Here are the details for your reference:</p>
                    <p style="font-size: 16px; background-color: #f4f7f6; padding: 10px; border-radius: 4px;"><strong>Order ID: #${details.orderId}</strong></p>
                    
                    <h2 style="font-size: 20px; color: #0d6efd; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-top: 30px;">Order Summary</h2>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <thead>
                            <tr>
                                <th style="padding: 10px 0; text-align: left;">Product</th>
                                <th style="padding: 10px 0; text-align: center;">Quantity</th>
                                <th style="padding: 10px 0; text-align: right;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- This is where the dynamic rows will be injected -->
                            ${itemRowsHtml}
                        </tbody>
                    </table>

                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <tr>
                            <td style="text-align: right; padding: 15px 0; font-weight: bold; font-size: 20px; border-top: 2px solid #e0e0e0;">Total Paid:</td>
                            <td style="text-align: right; padding: 15px 0; font-weight: bold; font-size: 20px; width: 120px;">$${details.totalAmount}</td>
                        </tr>
                    </table>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:5173/order-history" style="background-color: #198754; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">View Order History</a>
                    </div>

                    <p>If you have any questions, feel free to reply directly to this email.</p>
                    <p>Best regards,<br>The ElectroVision Team</p>
                </div>

                <div style="background-color: #f4f7f6; padding: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; font-size: 12px; color: #777777;">
                    <p>&copy; ${new Date().getFullYear()} ElectroVision. All Rights Reserved.</p>
                    <p>123 Code Lane, Developer City, DC 45678</p>
                </div>

            </div>
        </body>
        </html>
      `
  };

  try {
      await transporter.sendMail(mailOptions);
      console.log(`Confirmation email sent to ${details.to} for order #${details.orderId}`);
  } catch (error: any) {
      console.error(`Error sending confirmation email to ${details.to}:`, error);
      // It's important to not crash the webhook if the email fails.
      // The order is fulfilled, that's the main thing. Just log the error.
  }
}