import { env as Environment } from "@/app/config/environment";

const HtmlUploadWidgetContent = (buttonid: string) => {
  console.log("buttonid222", buttonid);
  const htmlContent = `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Dynamic React App Injection</title>
            <!-- Add any global stylesheets or initial styles here -->

            <!-- <=== Here provided the CSS CDN ===> -->
            <link rel="stylesheet" href="${Environment.upload_widget_CSS_CDN}">

        </head>

        <body>
            <!-- This div will have necessary attributes for custom css 
            Custom attributes:
            Place your "trackid" here. (ex. data-trackid= "abc")
            Place your "wrapper" object here. (ex. wrapper='{ "height": "380px", "width": "500px", "themeColor":"black", "fontFamily":"Montserrat", "fontSize":"12px" }')
            We have provided default styling which can be modified as per custom implementation.            
            -->

            <div 
            id="reactWidget" 
            data-buttonid="${buttonid}" 
            data-trackid=""
            wrapper='{ "height": "380px", "width": "500px", "themeColor":"black", "fontFamily":"Montserrat", "fontSize":"12px" }'>
            </div>

            <!--  <=== Here provided the Javascript CDN ====> -->
            <script src="${Environment.upload_widget_JS_CDN}"></script>

        </body>

        </html>
  `;
  return htmlContent;
};

export default HtmlUploadWidgetContent;
