import { NextResponse } from 'next/server';
import { updateProduct } from '@/lib/excel';
import { revalidatePath } from 'next/cache';

import { cookies } from 'next/headers';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get('admin_auth');
    if (!adminAuth || adminAuth.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const updates = await request.json();

    const success = await updateProduct(id, updates);

    if (success) {
      // Clear Next.js cache for pages displaying products
      revalidatePath('/');
      revalidatePath('/shop');
      revalidatePath('/admin');
      
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
