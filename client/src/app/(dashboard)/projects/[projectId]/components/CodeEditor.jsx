import { useParams } from "next/navigation";

export default function CodeEditor() {
    const params = useParams();
    const fileId = params.fileId;
    return <div>Code Editor Component for file ID: {fileId}</div>;
}