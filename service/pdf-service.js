// service/pdf-service.js
import puppeteer from 'puppeteer';
import fs from 'fs';
const buildPDF = async (profile, res) => {
  // console.log(profile);
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    // const browser = await puppeteer.launch({headless: 'new'});
    const page = await browser.newPage();
    const imagePath = `E:/Projects/web/mern/resume/uploads/${profile.file}`;
    const image = fs.readFileSync(imagePath, 'base64');
    const imageSrc = `data:image/jpeg;base64,${image}`;



    const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CV</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              margin: 20px;
          }
  
          h1 {
              color: #333;
          }
  
          h2 {
              color: #555;
          }
  
          p {
              margin-bottom: 15px;
          }
  
          .section {
              margin-bottom: 30px;
          }
  
          .section h2 {
              border-bottom: 2px solid #333;
              padding-bottom: 5px;
              margin-bottom: 10px;
          }
  
          .section p {
              margin-bottom: 10px;
          }
           img {
            width: 150px;
            height: 150px;
            object-fit: cover;
            border-radius: 50%;
            border: 5px solid #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
      </style>
  </head>
  
  <body>
  
      <h1>${profile.user.name}</h1>
      <img src="${imageSrc}" alt="no img"/>
      <!-- Personal Information Section -->
      <p>- Curriculum Vitae</p>
      <div class="section">
          <h2>Personal Information</h2>
          <p><strong>Phone:</strong> ${profile.phone}</p>
          <p><strong>Address:</strong> ${profile.address}</p>
          <p><strong>Email:</strong> ${profile.user.email}</p>
          <p><strong>Birth Date:</strong> ${profile.birthDate}</p>
          <p><strong>Gender:</strong> ${profile.gender}</p>
  
      </div>
  
      <!-- Education Section -->
      <div class="section">
          <h2>Education</h2>
          <p>${profile.education}</p>
      </div>
  
      <!-- Experience Section -->
      <div class="section">
          <h2>Experience</h2>
          <p>${profile.experience}</p>
      </div>
  
      <!-- Skills Section -->
      <div class="section">
          <h2>Skills</h2>
          <p>${profile.skills}</p>
      </div>
  
      <!-- Certifications Section -->
      <div class="section">
          <h2>Certifications</h2>
          <p>${profile.certification}</p>
      </div>
  
      <!-- Language Section -->
      <div class="section">
          <h2>Language Proficiency</h2>
          <p>${profile.language}</p>
      </div>
  
      <!-- Courses Section -->
      <div class="section">
          <h2>Courses</h2>
          <p>${profile.courses}</p>
      </div>
  
      <div class="section">
<h2>
Personal Interests
</h2>
<p> ${profile.personalIntersets}</p>
</div>
<div class="section">
<h2>References
</h2>
<p> ${profile.references}</p>
</div>
<div class="section">

<h2>OnlineProfiles</h2>

  <p> ${profile.onlineProfiles}</p>
  </div>
  </body>
  
  </html>
  
  `;
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('img'); // Wait for the image to be present in the DOM
    const pdfBuffer = await page.pdf();
    // Send the PDF buffer in the response
    res.end(pdfBuffer);

    await browser.close();
  } catch (error) {
    console.error('Error building PDF:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default buildPDF;