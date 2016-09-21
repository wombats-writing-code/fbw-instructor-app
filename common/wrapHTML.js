


function wrapHTML (markup) {

  return `
  <DOCTYPE html>
    <html>
      <head>
        <style type="text/css">
          * {
          -webkit-touch-callout: none;
          -webkit-user-select: none; /* Disable selection/copy in UIWebView */
          }
          body {
            font-family: 'Open Sans', sans-serif;
            font-size: 14px;
            line-height: 1.4;
          }
          .collapsible__header {
            padding-top: 1.5em;
          }
        </style>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.6.0/katex.min.css">
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet">

        <script src="https://cdn.mathjax.org/mathjax/2.6-latest/MathJax.js?config=TeX-AMS_HTML"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.6.0/katex.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.6.0/contrib/auto-render.min.js"></script>
      </head>

      <body>
        <div id="markup">
          ${markup}
        </div>

        <script>
            MathJax.Hub.Config({
              "HTML-CSS": { scale: 100, linebreaks: { automatic: true } },
              displayAlign: "left",
              TeX: {
                extensions: ['cancel.js']
              }
           });
        </script>

        <script type="text/javascript">
            var el = document.getElementById('markup');
            renderMathInElement(el);

            // MathJax.Hub.Queue(["Typeset", MathJax.Hub, document.body]);

            var rawHeight = parseInt(Math.max(el.offsetHeight, el.clientHeight));

            document.title = rawHeight + 14*1.4*2;

            window.location.hash = Math.random();
        </script>

      </body>


    </html>`;
};

module.exports = wrapHTML;
