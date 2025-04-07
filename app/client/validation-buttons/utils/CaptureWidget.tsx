import { env as Environment } from "@/app/config/environment";

const HtmlWidgetContent = (buttonid: string, verification_link: string) => {
  // Use the provided verification_link parameter or fallback to environment variable
  const finalVerificationLink = verification_link || Environment.verification_link + buttonid + "&trackid=";

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DIRO Widget</title>
    <!-- CSS CDN -->
    <link rel="stylesheet" href="${Environment.capture_widget_CSS_CDN}">
  </head>

  <body>
    <!-- Place this div where you want the widet to be rendered -->
    <div class="diro-widget" id="diro-widget-container"></div>
    <!-- JS CDN -->
    <script src="${Environment.capture_widget_JS_CDN}"></script>
    <script>
      // Initialize the widget after the JS is loaded
      window.initializeDiroWidget(
        document.getElementById("diro-widget-container"),
        {
          targetUrl: "${finalVerificationLink}",
          allowRedirection: true,
          buttonText: "Start verification",
          openWith: "",
          containerStyles: {
            backgroundColor: "#f0f0f0",
            padding: "20px",
            borderRadius: "10px",
          },
          buttonStyles: {
            fontSize: "16px",
            borderRadius: "12px",
            width: "300px",
          },
        }
      );
    </script>
  </body>
</html>
    `;

  return htmlContent;
};

export default HtmlWidgetContent;
