import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export function createSuccessResponse(data: any) {
  return NextResponse.json(data);
}

export function createErrorResponse(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status }
  );
}