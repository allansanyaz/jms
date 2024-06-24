import { NextResponse } from 'next/server';
import { workflowsAPI, toolsCategoriesAPI } from '@/lib/endpoints';

export async function GET() {

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const result = await fetch(workflowsAPI, {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	})
	.then( response => response.json())
	.catch( error => {
		console.error(`Could not fetch data from ${workflowsAPI} API due to:`);
		console.error(error);
	});

    const toolCategories = await fetch(toolsCategoriesAPI, {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	})
    .then( response => response.json())
    .catch( error => {
        console.error(`Could not fetch data from ${toolsCategoriesAPI} API due to:`);
        console.error(error);
    });

    const processedResult = processWorflowsData(result, toolCategories);

	return NextResponse.json(processedResult);

}

const processWorflowsData = (workflows: any, categories: any) => {
    
    let categoryHolder: any = {};

    // loop through the worflows
    Object.entries(workflows).forEach(([_, value]) => {
        const toolID = (value as any).WorkflowID;
        const categoryID = (value as any).Category;
        const toolName = (value as any).WorkflowName;
        const toolDescription = (value as any).Description;
        const toolPublic = (value as any).PublicInd;

        // tool version is the first index of the array
        const toolVersion = (value as any).WorkflowVersions[0].WorkflowVersionNum;

        const toolCategory = categoryFilter(categoryID, categories);

        categoryHolder = {...categoryHolder, [toolCategory]: {...categoryHolder[toolCategory], [toolID]: {categoryID, toolName, toolDescription, toolPublic, toolCategory, toolVersion}}};
    });

    return categoryHolder;
}

const categoryFilter = (categoryID: string, categories: any) => {
    let category = categories.filter((category: any) => {
        return category.CategoryID === categoryID;
    });

    return category[0].CategoryName;
}
