import { NextResponse } from 'next/server';

// Optional global store fallback for sandbox/dev testing
declare global {
  var __uniloop_otps: Map<string, { otp: string; expires: number }> | undefined;
}

if (!global.__uniloop_otps) {
  global.__uniloop_otps = new Map();
}

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid phone number is required.' }, { status: 400 });
    }

    // Clean phone number to standard format
    const cleanDigits = phone.replace(/[^0-9]/g, '');
    const mobile = cleanDigits.length === 10 ? '91' + cleanDigits : cleanDigits;

    const apiKey = process.env.MSG91_API_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;

    // If MSG91 credentials are configured in environment variables, dispatch live SMS
    if (apiKey && templateId) {
      const url = `https://control.msg91.com/api/v5/otp?template_id=${encodeURIComponent(templateId)}&mobile=${encodeURIComponent(mobile)}&authkey=${encodeURIComponent(apiKey)}`;
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();

      if (data.type === 'success' || res.ok) {
        return NextResponse.json({
          success: true,
          mode: 'msg91_live',
          message: 'OTP SMS sent successfully to ' + phone
        });
      } else {
        console.warn('MSG91 returned error, falling back to simulated sandbox:', data);
      }
    }

    // Sandbox / Simulation Mode (immediate testing before/during DLT approval)
    // Generate a 6-digit random code
    const simulatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 mins validity

    global.__uniloop_otps!.set(mobile, { otp: simulatedOtp, expires });
    console.log(`[UniLoop SMS Gateway] Simulated OTP for ${mobile}: ${simulatedOtp}`);

    return NextResponse.json({
      success: true,
      mode: 'sandbox',
      simulatedOtp, // Exposed for easy sandbox demonstration in browser
      message: `[Sandbox] OTP sent! For testing, use code: ${simulatedOtp}`
    });
  } catch (error: any) {
    console.error('Error in send-otp route:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to send OTP.' }, { status: 500 });
  }
}
