import {Injectable} from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

@Injectable()
export class DocumentsService {
    async generatePdf(data: any,url): Promise<Buffer> {
        // Get the absolute path to the template.html file
        const templatePath = path.resolve(__dirname, '../public/template/template.html');
        const {firstName, surName, address, zipcode,numberOfShares,totalAmount} = data
        // First-Name, Name, address, zip code

        // Read the HTML template file
        const template = fs.readFileSync(templatePath, 'utf-8');
        // Compile the Handlebars template
        const compiledTemplate = handlebars.compile(template);

        const imagePath = path.resolve(__dirname, '../public/images/img.png');
        const imagePathSignature = path.resolve(__dirname, '../public/images/Signature.png');
        const imagePathAddress = path.resolve(__dirname, '../public/images/Address.png');
        const imagePathViber = path.resolve(__dirname, '../public/images/Viber.png');
        const imagePathEmail = path.resolve(__dirname, '../public/images/Email.png');
        const imagePathLogo = path.resolve(__dirname, '../public/images/logo.png');


        // Convert the image file to a Base64-encoded string
        const imageData = fs.readFileSync(imagePath, 'base64');
        const imageSignature = fs.readFileSync(imagePathSignature, 'base64');
        const imageAddress = fs.readFileSync(imagePathAddress, 'base64');
        const imageViber = fs.readFileSync(imagePathViber, 'base64');
        const imageEmail = fs.readFileSync(imagePathEmail, 'base64');
        const imageLogo = fs.readFileSync(imagePathLogo, 'base64');

        const currentDate = new Date().toLocaleDateString();

        const variables = {
            imageData: `data:image/png;base64,${imageData}`, // Use the Base64-encoded image data
            currentDate: currentDate, // Pass the current date variable
            imageSignature: `data:image/png;base64,${imageSignature}`,
            imageAddress: `data:image/png;base64,${imageAddress}`,
            imageViber: `data:image/png;base64,${imageViber}`,
            imageEmail: `data:image/png;base64,${imageEmail}`,
            imageLogo: `data:image/png;base64,${imageLogo}`,
            firstName:firstName,
            surName:surName,
            address:address,
            zipcode:zipcode,
            numberOfShares:numberOfShares,
            totalAmount:totalAmount,
            clientSignature:`https://traccy.${url}`
        };

        // Render the template with variable values
        const html = compiledTemplate(variables);

        // Launch a headless browser instance
        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox']
        });

        // Create a new page
        const page = await browser.newPage();

        // Set the page content to the HTML
        await page.setContent(html);

        // Generate PDF from the page content
        const pdf = await page.pdf();

        // Close the browser
        await browser.close();

        return pdf;
    }
}
