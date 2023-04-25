// const puppeteer = require('puppeteer');

import puppeteer from 'puppeteer';

async function scrapeLinkedInPage(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const aboutMe = await page.evaluate(() => {
    return document.querySelector('.pv-about-section .pv-about__summary-text').innerText;
  });

  const skills = await page.evaluate(() => {
    const skillsElements = document.querySelectorAll('.pv-skill-category-entity__name');
    const skillsList = [];
    skillsElements.forEach(skillElement => {
      skillsList.push(skillElement.innerText);
    });
    return skillsList;
  });

  const experience = await page.evaluate(() => {
    const experienceElements = document.querySelectorAll('.pv-experience-section .pv-position-entity');
    const experienceList = [];
    experienceElements.forEach(experienceElement => {
      const title = experienceElement.querySelector('.pv-entity__summary-info h3').innerText;
      const company = experienceElement.querySelector('.pv-entity__secondary-title').innerText;
      const duration = experienceElement.querySelector('.pv-entity__date-range span:nth-child(2)').innerText;
      const description = experienceElement.querySelector('.pv-entity__description').innerText;
      experienceList.push({
        title,
        company,
        duration,
        description
      });
    });
    return experienceList;
  });

  const education = await page.evaluate(() => {
    const educationElements = document.querySelectorAll('.pv-education-section .pv-profile-section__card-item');
    const educationList = [];
    educationElements.forEach(educationElement => {
      const school = educationElement.querySelector('.pv-entity__school-name').innerText;
      const degree = educationElement.querySelector('.pv-entity__degree-name span:nth-child(2)').innerText;
      const fieldOfStudy = educationElement.querySelector('.pv-entity__fos span:nth-child(2)').innerText;
      const duration = educationElement.querySelector('.pv-entity__dates span:nth-child(2)').innerText;
      educationList.push({
        school,
        degree,
        fieldOfStudy,
        duration
      });
    });
    return educationList;
  });

  await browser.close();

  return {
    aboutMe,
    skills,
    experience,
    education
  };
}

scrapeLinkedInPage('https://www.linkedin.com/in/brendanjhwu')
  .then(data => console.log(data))
  .catch(error => console.error(error));
