import express from 'express';
import cors from 'cors';
import natural from 'natural';
import fs from 'fs';
import parse from 'csv-parser';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

// CORS
app.use(cors());

interface DataItem {
  text: string;
  label: string;
}
// NAIVE BAYES CLASSIFIER
const classifier = new natural.BayesClassifier();

function loadCSVData(filePath: string): Promise<DataItem[]> {
  return new Promise((resolve, reject) => {
    const data: DataItem[] = [];
    fs.createReadStream(filePath)
      .pipe(parse())
      .on(
        'data',
        (row: {
          'Issue Title': string;
          'Issue Body': string;
          'Feature Request': string;
        }) => {
          const text = `${row['Issue Title']} ${row['Issue Body']}`;
          data.push({ text, label: row['Feature Request'] });
        }
      )
      .on('end', () => resolve(data))
      .on('error', reject);
  });
}

async function trainModel() {
  try {
    const data = await loadCSVData('uploads/data_jacob_with_label.csv');
    data.forEach((item) => {
      classifier.addDocument(item.text, item.label);
    });
    classifier.train();
  } catch (error) {
    console.error('Error training model:', error);
  }
}

app.post('/predict', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).send('No text provided');
  }

  const label = classifier.classify(text);
  res.json({ 'Feature Request': label });
});

app.get('/', (req: any, res: any) => {
  console.log('Hello world');
  return res.status(200).json({
    message:
      'Hi there! This is a backend project for Naive Bayes Classifier with Express.js. Check my GitHub: https://github.com/Hikmahx/naive-bayes-api for more info',
  });
});

app.listen(PORT, () => console.log('This is listening on PORT: ' + PORT));

trainModel().catch(console.error);
