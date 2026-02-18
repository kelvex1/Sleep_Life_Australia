import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const RECIPIENT_EMAIL = 'jrip7@outlook.com';

interface ReferralEmailRequest {
  referralId: string;
  formData: {
    patientInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      dateOfBirth: string;
    };
    medicalHistory: {
      referringPhysician: string;
    };
    osa50Score: number;
    stopbangScore: number;
    epworthScore: number;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { referralId, formData }: ReferralEmailRequest = await req.json();

    // Fetch the referral number from the database
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    const referralResponse = await fetch(`${supabaseUrl}/rest/v1/referral_forms?id=eq.${referralId}&select=referral_number`, {
      headers: {
        'apikey': supabaseServiceKey!,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
    });

    const referralData = await referralResponse.json();
    const referralNumber = referralData[0]?.referral_number || referralId;

    const emailSubject = `New Sleep Study Referral - ${formData.patientInfo.firstName} ${formData.patientInfo.lastName} (Ref: ${referralNumber})`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
          .section { background: white; padding: 15px; margin: 10px 0; border-radius: 4px; border-left: 4px solid #2563eb; }
          .score-box { display: inline-block; background: #dbeafe; padding: 10px 15px; margin: 5px; border-radius: 4px; }
          .score-label { font-size: 12px; color: #64748b; }
          .score-value { font-size: 24px; font-weight: bold; color: #1e40af; }
          .info-row { margin: 8px 0; }
          .label { font-weight: bold; color: #475569; }
          .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">New Sleep Study Referral</h1>
            <p style="margin: 5px 0 0 0;">Referral Number: ${referralNumber}</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h2 style="margin-top: 0; color: #1e40af;">Patient Information</h2>
              <div class="info-row">
                <span class="label">Name:</span> ${formData.patientInfo.firstName} ${formData.patientInfo.lastName}
              </div>
              <div class="info-row">
                <span class="label">Date of Birth:</span> ${formData.patientInfo.dateOfBirth}
              </div>
              <div class="info-row">
                <span class="label">Phone:</span> ${formData.patientInfo.phone}
              </div>
              <div class="info-row">
                <span class="label">Email:</span> ${formData.patientInfo.email}
              </div>
            </div>

            <div class="section">
              <h2 style="margin-top: 0; color: #1e40af;">Referring Physician</h2>
              <div class="info-row">
                ${formData.medicalHistory.referringPhysician}
              </div>
            </div>

            <div class="section">
              <h2 style="margin-top: 0; color: #1e40af;">Assessment Scores</h2>
              <div style="text-align: center;">
                <div class="score-box">
                  <div class="score-label">OSA50</div>
                  <div class="score-value">${formData.osa50Score}/10</div>
                </div>
                <div class="score-box">
                  <div class="score-label">STOP-BANG</div>
                  <div class="score-value">${formData.stopbangScore}/8</div>
                </div>
                <div class="score-box">
                  <div class="score-label">Epworth</div>
                  <div class="score-value">${formData.epworthScore}/24</div>
                </div>
              </div>
              ${formData.osa50Score >= 5 ? '<p style="color: #dc2626; font-weight: bold; text-align: center; margin-top: 15px;">⚠️ OSA50 Referral Recommended</p>' : ''}
              ${formData.stopbangScore >= 5 ? '<p style="color: #dc2626; font-weight: bold; text-align: center;">⚠️ STOP-BANG High Risk</p>' : ''}
            </div>

            <div class="footer">
              <p>This is an automated notification from Sleep Life Referral System</p>
              <p>Please review the attached PDF for complete patient information and assessment details</p>
              <p>Submitted on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const patientEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .referral-box { background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .referral-number { font-size: 32px; font-weight: bold; color: #92400e; letter-spacing: 2px; margin: 10px 0; }
          .message { background: white; padding: 20px; border-radius: 4px; margin: 20px 0; }
          .important-box { background: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; margin: 15px 0; }
          .step-number { display: inline-block; width: 28px; height: 28px; background: #2563eb; color: white; border-radius: 50%; text-align: center; line-height: 28px; font-weight: bold; margin-right: 10px; }
          .contact-info { background: #f1f5f9; padding: 15px; border-radius: 4px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Sleep Study Referral Confirmation</h1>
          </div>

          <div class="content">
            <div class="referral-box">
              <p style="margin: 0 0 5px 0; font-size: 14px; color: #92400e;">Your Referral Number</p>
              <div class="referral-number">${referralNumber}</div>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #78350f;">Please save this number for your records</p>
            </div>

            <div class="message">
              <p>Dear ${formData.patientInfo.firstName},</p>

              <p>Thank you for submitting your sleep study referral form. We have successfully received your information and it has been forwarded to our team for review.</p>

              <div class="important-box">
                <p style="margin: 0; font-weight: bold; color: #1e40af;">Important Timeline Information</p>
                <p style="margin: 5px 0 0 0;">Your referral will take up to 7 days to be processed. Please book your appointment online via our website no less than 7 days after your GP appointment.</p>
              </div>

              <p><strong>What happens next?</strong></p>
              <ul style="padding-left: 20px;">
                <li style="margin: 10px 0;">
                  <span class="step-number">1</span>
                  <strong>Processing (Up to 7 Days):</strong> Our team will review your assessment results and referral information
                </li>
                <li style="margin: 10px 0;">
                  <span class="step-number">2</span>
                  <strong>Book Your Appointment:</strong> After 7 days from your GP appointment, visit our website to book your consultation online
                </li>
                <li style="margin: 10px 0;">
                  <span class="step-number">3</span>
                  <strong>Prepare for Your Visit:</strong> We may contact you at ${formData.patientInfo.phone} if we need any additional information
                </li>
              </ul>

              <div class="contact-info">
                <p style="margin: 0 0 10px 0; font-weight: bold; color: #1e40af;">Contact Information</p>
                <p style="margin: 5px 0;">Phone: <strong>${formData.patientInfo.phone}</strong></p>
                <p style="margin: 5px 0;">Email: <strong>${formData.patientInfo.email}</strong></p>
                <p style="margin: 5px 0;">Website: <strong>www.sleeplifeaustralia.com.au</strong></p>
              </div>

              <p>If you have any immediate questions or concerns, please don't hesitate to contact us using your referral number <strong>${referralNumber}</strong>.</p>

              <p>Best regards,<br>
              <strong>Sleep Life Team</strong></p>
            </div>

            <div class="footer">
              <p>This is an automated confirmation from Sleep Life</p>
              <p>Submitted on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    if (!RESEND_API_KEY) {
      console.log('RESEND_API_KEY not configured - email simulation mode');
      console.log('Would send email to:', RECIPIENT_EMAIL);
      console.log('Patient email to:', formData.patientInfo.email);
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Email simulation - no RESEND_API_KEY configured',
          referralId,
          referralNumber
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const emailToPhysician = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Sleep Life <referrals@sleeplife.com>',
        to: [RECIPIENT_EMAIL],
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    if (!emailToPhysician.ok) {
      const errorText = await emailToPhysician.text();
      console.error('Failed to send email to physician:', errorText);
      throw new Error('Failed to send email to physician');
    }

    const emailToPatient = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Sleep Life <referrals@sleeplife.com>',
        to: [formData.patientInfo.email],
        subject: `Sleep Study Referral Confirmation - Ref #${referralNumber}`,
        html: patientEmailHtml,
      }),
    });

    if (!emailToPatient.ok) {
      console.error('Failed to send confirmation email to patient');
    }

    await fetch(`${supabaseUrl}/rest/v1/referral_forms?id=eq.${referralId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey!,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        email_sent: true,
        email_sent_at: new Date().toISOString(),
        pdf_generated: true,
      }),
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Emails sent successfully',
        referralId,
        referralNumber
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in send-referral-email function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
