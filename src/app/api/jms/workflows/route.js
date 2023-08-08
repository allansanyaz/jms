import { NextResponse } from 'next/server';
import { workflowsAPI, toolsCategoriesAPI } from '@/app/api';

export async function GET() {

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	};

	const result = await fetch(workflowsAPI, requestOptions)
	.then( response => response.json())
	.catch( error => {
		console.log("Could not fetch data from API due to:");
		console.log('error', error);
	});

    const toolCategories = await fetch(toolsCategoriesAPI, requestOptions)
    .then( response => response.json())
    .catch( error => {
        console.log("Could not fetch data from API due to:");
        console.log('error', error);
    });

    const processedResult = processWorflowsData(result, toolCategories);

	return NextResponse.json(processedResult);

}

const processWorflowsData = (worflows, categories) => {
    
    let categoryHolder = {};

    // loop through the worflows
    Object.entries(worflows).forEach(([_, value]) => {
        const toolID = value.WorkflowID;
        const categoryID = value.Category;
        const toolName = value.WorkflowName;
        const toolDescription = value.Description;
        const toolPublic = value.PublicInd;

        // tool version is the first index of the array
        const toolVersion = value.WorkflowVersions[0].WorkflowVersionNum;

        const toolCategory = categoryFilter(categoryID, categories);

        categoryHolder = {...categoryHolder, [toolCategory]: {...categoryHolder[toolCategory], [toolID]: {categoryID, toolName, toolDescription, toolPublic, toolCategory, toolVersion}}};
    });

    return categoryHolder;
}

const categoryFilter = (categoryID, categories) => {
    let category = categories.filter((category) => {
        return category.CategoryID === categoryID;
    });

    return category[0].CategoryName;
}
