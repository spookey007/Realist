import axios from 'axios';
import * as cheerio from 'cheerio';

export const validateLicense = async (req, res) => {
  try {
    const { licenseNumber } = req.body;
    
    if (!licenseNumber) {
      return res.status(400).json({
        success: false,
        message: 'License number is required'
      });
    }

    // Make request to DPOR License Lookup API with form-encoded data
    const response = await axios.post(
      'https://dporweb.dpor.virginia.gov/LicenseLookup/Search',
      `phone-number=&search-text=${licenseNumber}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Parse the HTML response using cheerio
    const $ = cheerio.load(response.data);
    
    // Find the tab-content div
    const tabContent = $('.tab-content');
    
    // Default empty response
    const defaultResponse = {
      name: '',
      companyName: '',
      address: {
        full: '',
        city: '',
        state: '',
        zip: ''
      }
    };

    if (tabContent.length === 0) {
      console.log('No tab-content div found in the response');
      return res.status(200).json({
        success: true,
        data: defaultResponse
      });
    }

    // Extract name (only the first part before any additional text)
    const nameElement = tabContent.find('div.col-xs-6:contains("Name")').next();
    const name = nameElement.length ? nameElement.text().trim().split('\n')[0].trim() : '';

    // Extract company name from the second td in the table row
    const companyName = tabContent.find('tr td').eq(1).length ? 
      tabContent.find('tr td').eq(1).text().trim() : '';

    // Extract address
    const addressElement = tabContent.find('div.col-xs-6:contains("Address")').next();
    const addressFull = addressElement.length ? addressElement.text().trim() : '';

    // Parse address components
    let city = '', state = '', zip = '';
    if (addressFull) {
      const addressParts = addressFull.split(',');
      if (addressParts.length > 1) {
        city = addressParts[0].trim();
        const stateZip = addressParts[1].trim();
        const stateZipParts = stateZip.split(' ');
        if (stateZipParts.length > 1) {
          state = stateZipParts[0];
          zip = stateZipParts[1];
        }
      }
    }

    // Create structured license info
    const licenseInfo = {
      isValid: true,
      name,
      companyName,
      address: {
        full: addressFull,
        city,
        state,
        zip
      }
    };

    // Log the extracted data
    console.log('Extracted License Information:', licenseInfo);

    res.status(200).json({
      success: true,
      data: licenseInfo
    });
  } catch (error) {
    console.error('License validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating license number'
    });
  }
};
