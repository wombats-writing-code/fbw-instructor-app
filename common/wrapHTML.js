


function wrapHTML (markup, withStyleURL, withKatexURL, withKatexExtension) {
  markup = markup.replace(/&nbsp;/g, ' ');
  return `<!DOCTYPE html>
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
        </style>
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet">
        <link rel="stylesheet" href="${withStyleURL}">
      </head>

      <body>
        ${markup}


      <script src="${withKatexURL}"></script>
      <script src="${withKatexExtension}"></script>
      <script defer>
        renderMathInElement(document.body);
      </script>
      <script defer>
        // window.setTimeout(function() {
          window.location.hash = 1;
          var body = document.body;
          var html = document.documentElement;

          // document.title = Math.max( body.scrollHeight, body.offsetHeight,
          //                  html.clientHeight, html.scrollHeight, html.offsetHeight);

          document.title = body.scrollHeight || body.offsetHeight ||
                           html.clientHeight || html.scrollHeight || html.offsetHeight;

          // document.title = 200;

        // }, 5000);
      </script>
      </body>


    </html>`;
};

module.exports = wrapHTML;
