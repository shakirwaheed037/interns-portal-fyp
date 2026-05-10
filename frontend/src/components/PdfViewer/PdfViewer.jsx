import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X, Download } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker for react-pdf with multiple fallback options
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PdfViewer = ({ fileUrl, onClose }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setLoading(false);
        setError(null);
    }

    function onDocumentLoadError(error) {
        console.error('PDF load error:', error);
        setError('Failed to load PDF. The file may be corrupted or not a valid PDF.');
        setLoading(false);
    }

    // Validate file URL
    const isValidPdfUrl = (url) => {
        if (!url) return false;
        // Check if it's a PDF URL or has PDF content type
        return url.toLowerCase().includes('.pdf') || 
               url.toLowerCase().includes('pdf') ||
               url.includes('cloudinary') ||
               url.includes('drive.google.com');
    };

    const changePage = (offset) => {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    };

    const previousPage = () => changePage(-1);
    const nextPage = () => changePage(1);

    const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.0));
    const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

    // Early return if file URL is invalid
    if (!isValidPdfUrl(fileUrl)) {
        return (
            <div className="pdf-viewer-overlay">
                <div className="pdf-viewer-modal">
                    <div className="pdf-viewer-header">
                        <h3>Document Viewer</h3>
                        <button className="close-btn" onClick={onClose}><X size={20} /></button>
                    </div>
                    <div className="pdf-document-container">
                        <div className="pdf-error">
                            Invalid PDF URL or file not found. Please check the document link.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pdf-viewer-overlay">
            <div className="pdf-viewer-modal">
                <div className="pdf-viewer-header">
                    <h3>Document Viewer</h3>
                    <div className="pdf-controls">
                        <button onClick={zoomOut} title="Zoom Out"><ZoomOut size={18} /></button>
                        <span>{Math.round(scale * 100)}%</span>
                        <button onClick={zoomIn} title="Zoom In"><ZoomIn size={18} /></button>
                        <div className="divider"></div>
                        <button 
                            disabled={pageNumber <= 1 || loading} 
                            onClick={previousPage}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="page-info">
                            Page {pageNumber} of {numPages || '--'}
                        </span>
                        <button 
                            disabled={pageNumber >= numPages || loading} 
                            onClick={nextPage}
                        >
                            <ChevronRight size={18} />
                        </button>
                        <div className="divider"></div>
                        <a href={fileUrl} download target="_blank" rel="noopener noreferrer" className="download-btn">
                            <Download size={18} />
                        </a>
                        <button className="close-btn" onClick={onClose}><X size={20} /></button>
                    </div>
                </div>

                <div className="pdf-document-container">
                    {error ? (
                        <div className="pdf-error">
                            <div style={{ marginBottom: '1rem' }}>{error}</div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                                Try downloading the file instead or check if the URL is accessible.
                            </div>
                        </div>
                    ) : (
                        <Document
                            file={{
                                url: fileUrl,
                                httpHeaders: {
                                    'Access-Control-Allow-Origin': '*',
                                    'Cross-Origin-Resource-Policy': 'cross-origin'
                                }
                            }}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            loading={<div className="pdf-loading">Loading PDF...</div>}
                            error={<div className="pdf-error">Failed to load PDF. Please try downloading it instead.</div>}
                            options={{
                                cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
                                standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/'
                            }}
                        >
                            <Page 
                                pageNumber={pageNumber} 
                                scale={scale} 
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                                className="pdf-page"
                            />
                        </Document>
                    )}
                </div>
            </div>

            <style>{`
                .pdf-viewer-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(15, 23, 42, 0.85);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    padding: 20px;
                }

                .pdf-viewer-modal {
                    background: #f8fafc;
                    width: 100%;
                    max-width: 1000px;
                    height: 90vh;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }

                .pdf-viewer-header {
                    padding: 12px 20px;
                    background: #ffffff;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 15px;
                }

                .pdf-viewer-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    color: #0f172a;
                    font-weight: 700;
                }

                .pdf-controls {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .pdf-controls button {
                    background: #f1f5f9;
                    border: none;
                    border-radius: 6px;
                    padding: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #475569;
                    transition: all 0.2s;
                }

                .pdf-controls button:hover:not(:disabled) {
                    background: #e2e8f0;
                    color: #1e293b;
                }

                .pdf-controls button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .divider {
                    width: 1px;
                    height: 24px;
                    background: #e2e8f0;
                    margin: 0 4px;
                }

                .page-info {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #64748b;
                    min-width: 80px;
                    text-align: center;
                }

                .download-btn {
                    color: #6366f1;
                    padding: 6px;
                    display: flex;
                    align-items: center;
                }

                .close-btn {
                    margin-left: 10px;
                    background: #fee2e2 !important;
                    color: #ef4444 !important;
                }

                .close-btn:hover {
                    background: #fecaca !important;
                }

                .pdf-document-container {
                    flex: 1;
                    overflow: auto;
                    display: flex;
                    justify-content: center;
                    padding: 20px;
                    background: #334155;
                }

                .react-pdf__Document {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .react-pdf__Page {
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
                    margin-bottom: 20px;
                }

                .pdf-loading, .pdf-error {
                    color: white;
                    padding: 40px;
                    text-align: center;
                }

                @media (max-width: 768px) {
                    .pdf-viewer-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .pdf-controls {
                        width: 100%;
                        justify-content: space-between;
                    }
                    .pdf-viewer-modal {
                        height: 95vh;
                        margin: 10px;
                        max-width: calc(100% - 20px);
                    }
                    .pdf-viewer-overlay {
                        padding: 10px;
                    }
                    .pdf-document-container {
                        padding: 10px;
                    }
                }

                @media (max-width: 480px) {
                    .pdf-viewer-modal {
                        height: 98vh;
                        margin: 5px;
                        max-width: calc(100% - 10px);
                        border-radius: 8px;
                    }
                    .pdf-viewer-overlay {
                        padding: 5px;
                    }
                    .pdf-viewer-header {
                        padding: 8px 12px;
                    }
                    .pdf-viewer-header h3 {
                        font-size: 1rem;
                    }
                    .pdf-controls {
                        gap: 4px;
                    }
                    .pdf-controls button {
                        padding: 4px;
                    }
                    .page-info {
                        font-size: 0.75rem;
                        min-width: 60px;
                    }
                    .pdf-document-container {
                        padding: 5px;
                    }
                }
            `}</style>
        </div>
    );
};

export default PdfViewer;
