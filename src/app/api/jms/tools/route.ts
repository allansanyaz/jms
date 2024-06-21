import { NextResponse } from 'next/server';
import { toolsAPI, toolsCategoriesAPI } from '@/lib/endpoints';

export async function GET() {

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const result = await fetch(toolsAPI, {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	})
	.then( response => response.json())
	.catch( error => {
		console.log("Could not fetch data from API due to:");
		console.log('error', error);
	});

    const toolCategories = await fetch(toolsCategoriesAPI, {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	})
    .then( response => response.json())
    .catch( error => {
        console.log("Could not fetch data from API due to:");
        console.log('error', error);
    });

    const processedResult = processToolsData(result, toolCategories);

	return NextResponse.json(processedResult);

}

const processToolsData = (tools: any, categories: any) => {
    /**
     * Information needed is the
     * Category
     * Tool Name
     * Description
     * Public
     * Latetst Version index 0
     * Options
     */
    let categoryHolder: any = {};

    // loop through the tools
    Object.entries(tools).forEach(([_, value]) => {
        const toolID = (value as any).ToolID;
        const categoryID = (value as any).Category;
        const toolName = (value as any).ToolName;
        const toolDescription = (value as any).ToolDescription;
        const toolPublic = (value as any).PublicInd;

        // tool version is the first index of the array
        const toolVersion = (value as any).ToolVersions[0].ToolVersionNum;

        const toolCategory = categoryFilter(categoryID, categories);

        categoryHolder = {...categoryHolder, [toolCategory]: {...categoryHolder[toolCategory], [toolID]: {categoryID, toolName, toolDescription, toolPublic, toolCategory, toolVersion}}};
    });

    return categoryHolder;
}

const categoryFilter = (categoryID: string, categories: any) => {
    let category = categories.filter((category: any) => {
        return category[categoryID] === categoryID;
    });

    return category[0].CategoryName;
}
