import { NextRequest, NextResponse } from 'next/server';

/**
 * Stubbed payment webhook endpoint.
 * Currently unused — payments are collected manually via bank transfer and
 * marked as paid in the admin panel. Kept in case an online payment
 * provider is integrated later.
 *
 * Integration steps when ready:
 * 1. Verify the webhook signature using the provider's secret key.
 * 2. Parse the payment status from the request body.
 * 3. Update the subscription's payment_status, payment_provider, and payment_reference.
 * 4. Return 200 to acknowledge receipt.
 */
export async function POST(_request: NextRequest) {
  // TODO: Implement signature verification for the chosen payment provider
  // const signature = request.headers.get('x-provider-signature');
  // if (!verifySignature(signature, body, WEBHOOK_SECRET)) {
  //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  // }

  // TODO: Parse payment notification
  // const body = await request.json();
  // const { transactionId, status, referenceId } = body;

  // TODO: Update subscription
  // const supabase = createServiceClient();
  // await supabase
  //   .from('subscriptions')
  //   .update({
  //     payment_status: status === 'success' ? 'paid' : 'failed',
  //     payment_provider: 'provider-name',
  //     payment_reference: transactionId,
  //   })
  //   .eq('id', referenceId);

  return NextResponse.json(
    { error: 'Payment webhook not yet configured' },
    { status: 501 }
  );
}
