import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/kategori/$id")({ beforeLoad: ({params}) => { if(params.id === "saat-mucevher") throw redirect({to:"/saat-mucevher-kutulari",statusCode:301}); throw notFound(); } });
