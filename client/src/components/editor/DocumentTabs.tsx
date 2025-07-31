import { useEditorStore } from '@/store/editorStore';

export default function DocumentTabs() {
  const { 
    documents, 
    activeDocumentId, 
    setActiveDocument, 
    closeDocument,
    createDocument 
  } = useEditorStore();

  const handleNewDocument = () => {
    const docCount = documents.length + 1;
    createDocument(`Untitled-${docCount}`, 800, 600);
  };

  return (
    <div className="h-9 bg-secondary-dark border-b border-tertiary-dark flex items-center overflow-x-auto">
      <div className="flex">
        {documents.map((document) => (
          <div
            key={document.id}
            className={`flex items-center px-4 py-2 cursor-pointer ${
              document.id === activeDocumentId
                ? 'bg-tertiary-dark border-b-2 border-accent-blue'
                : 'hover:bg-tertiary-dark'
            }`}
            onClick={() => setActiveDocument(document.id)}
          >
            <span className="text-sm">
              {document.name}
              {!document.saved && '*'}
            </span>
            <button
              className="ml-2 hover:bg-quaternary-dark rounded p-1"
              onClick={(e) => {
                e.stopPropagation();
                closeDocument(document.id);
              }}
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>
        ))}
      </div>
      <button 
        className="ml-2 p-2 hover:bg-tertiary-dark rounded" 
        title="New Document"
        onClick={handleNewDocument}
      >
        <i className="fas fa-plus text-sm"></i>
      </button>
    </div>
  );
}
