import { NextResponse } from 'next/server';
import { toolsCategoriesAPI } from '@/app/api';

export async function GET() {

    console.log("************************");
    console.log("running category fetch");
    console.log("************************");

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	};

    const toolCategories = await fetch(toolsCategoriesAPI, requestOptions)
    .then( response => response.json())
    .catch( error => {
        console.log("Could not fetch data from API due to:");
        console.log('error', error);
    });

    console.log(toolCategories);
    console.log(typeof toolCategories);

	return NextResponse.json(result);

}

const categoriesProcess = (tools, categories) => {
    
}
