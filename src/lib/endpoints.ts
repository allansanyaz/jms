// defines the endpoints for the JMS application

const isProduction = process.env.NODE_ENV === 'production';
const productionApi = `https://jms.rubi.ru.ac.za`;
const developmentApi = `http://127.0.0.1:8000`;

const backendApi = (isProduction) ? productionApi : developmentApi;

export const dashboardAPI = `${backendApi}/api/jms/dashboard`;
export const settingsAPI = `${backendApi}/api/jms/settings`;
export const queuesAPI = `${backendApi}/api/jms/settings/queues`;
export const nodesAPI = `${backendApi}/api/jms/settings/nodes`;
export const jobsAPI = `${backendApi}/api/jms/jobs`;
export const toolsAPI = `${backendApi}/api/jms/tools`;
export const workflowsAPI = `${backendApi}/api/jms/workflows`;
export const toolsCategoriesAPI = `${backendApi}/api/jms/tools/categories`;
