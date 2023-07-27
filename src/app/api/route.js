import { NextResponse } from 'next/server';

export async function GET() {
	const data = JSON.stringify({ message: 'Hello World!' });
	return NextResponse.json(data);
}