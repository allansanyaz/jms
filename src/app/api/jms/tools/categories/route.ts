import { NextResponse } from 'next/server';
import { toolsCategoriesAPI } from '@/lib/endpoints';

export async function GET() {

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

    const result = await fetch(toolsCategoriesAPI, {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	})
    .then( response => response.json())
    .catch( error => {
        console.log("Could not fetch data from API due to:");
        console.log('error', error);
    });

	return NextResponse.json(result);

}

const categoriesProcess = (tools: any, categories: any) => {
    
}
