import { NextResponse } from 'next/server';
import { toolsAPI, toolsCategoriesAPI } from '@/app/api';

export async function GET() {

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	};

	const result = await fetch(toolsAPI, requestOptions)
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

    const processedResult = processToolsData(result, toolCategories);

	return NextResponse.json(processedResult);

}

const processToolsData = (tools, categories) => {
    /**
     * Information needed is the
     * Category
     * Tool Name
     * Description
     * Public
     * Latetst Version index 0
     * Options
     */
    let categoryHolder = {};

    // loop through the tools
    Object.entries(tools).forEach(([_, value]) => {
        const toolID = value.ToolID;
        const categoryID = value.Category;
        const toolName = value.ToolName;
        const toolDescription = value.ToolDescription;
        const toolPublic = value.PublicInd;

        // tool version is the first index of the array
        const toolVersion = value.ToolVersions[0].ToolVersionNum;

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
