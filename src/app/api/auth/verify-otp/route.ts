import { NextResponse } from 'next/server';

declare global {
  var __uniloop_otps: Map<string, { otp: string; expires: number }> | undefined;
}

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json({ verified: false, error: 'Phone number and OTP code are required.' }, { status: 400 });
    }

    const cleanDigits = phone.replace(/[^0-9]/g, '');
    const mobile = cleanDigits.length === 10 ? '91' + cleanDigits : cleanDigits;
    const cleanOtp = otp.toString().trim();

    const apiKey = process.env.MSG91_API_KEY;

    // Check MSG91 verification if key present
    if (apiKey) {
      const url = `https://control.msg91.com/api/v5/otp/verify?otp=${encodeURIComponent(cleanOtp)}&mobile=${encodeURIComponent(mobile)}&authkey=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();

      if (data.type === 'success') {
        return NextResponse.json({ verified: true, message: 'Phone number verified successfully via MSG91!' });
      }
    }

    // Sandbox / Simulation Check
    const stored = global.__uniloop_otps?.get(mobile);

    // Accept master test code '123456' or match generated sandbox OTP
    if (cleanOtp === '123456' || (stored && stored.otp === cleanOtp && Date.now() <= stored.expires)) {
      if (stored) global.__uniloop_otps?.delete(mobile);
      return NextResponse.json({
        verified: true,
        message: 'Phone number verified successfully!'
      });
    }

    return NextResponse.json({
      verified: false,
      error: 'Invalid or expired OTP. Please check the code or request a new one.'
    }, { status: 400 });

  } catch (error: any) {
    console.error('Error in verify-otp route:', error);
    return NextResponse.json({ verified: false, error: error.message || 'OTP verification failed.' }, { status: 500 });
  }
}
