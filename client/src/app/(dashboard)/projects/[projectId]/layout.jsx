import SideBar from "./components/SideBar";

export default function ProjectLayout({children , params}){
    const {projectId} = params;
    return <>
        <SideBar projectId={projectId} />
        <main className="ml-64 p-6">
            {children}
        </main>
    </>
}