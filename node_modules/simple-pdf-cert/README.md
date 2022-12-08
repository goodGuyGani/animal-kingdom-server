# simple-pdf-cert

Simple PDF Cert creator for NodeJS.  


Simply whipped is up for a small project. Forks and contribution are welcomed and encouraged.

## Installation

```npm i simple-pdf-cert```

## Sample Code:

```js
const simplePDFCert = require("simple-pdf-cert");

const sampleData = {
  logo: {
    path: "./sampleLogo.png",
  },
  company: {
    name: "Idemy Courses Inc",
  },
  words: {
    title: "Certificate of Completion",
    h2: "Awarded To",
    awardee: "User Admin",
    reason: "for completing THE NOTHING course",
  },
};

simplePDFCert(sampleData, "output.pdf");
```

## Screenshot:  

![Screenshot](/screenshot.PNG)

##### [SamplePDF](/test.pdf)  

Inspired by [Nice Invoice](https://github.com/ayazshah2/nice-invoice)
