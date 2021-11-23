import { useEffect, useRef } from "react";

interface PreviewProps {
  bundledCode: string;
}

const html = `
  <html>
    <head></head>
    <body>
      <div id="root"></div>
      <script>
        window.addEventListener('message', event => {
          try {
            eval(event.data);
          } catch (error) {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red;"><h4> Runtime error</h4>' + error + '</div>'
            console.error(error);
          }
        }, false);
      </script>
    </body>
  </html>
`;

const CodePreview: React.FC<PreviewProps> = ({ bundledCode }) => {
  const iframeRef = useRef<any>();

  useEffect(() => {
    // reset the iframe document after each execution. This is to prevent the
    // application from crashing due to document.body.innerHTML = '';
    iframeRef.current.srcdoc = html;
    iframeRef.current.contentWindow.postMessage(bundledCode, "*");
  }, [bundledCode]);

  return (
    <iframe
      title="preview"
      sandbox="allow-scripts"
      ref={iframeRef}
      srcDoc={html}
    />
  );
};

export default CodePreview;
