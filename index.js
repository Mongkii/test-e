import express from 'express';
import { Leapcell } from '@leapcell/leapcell-js';

const leapcell = new Leapcell({ apiKey: process.env.API_KEY });
const table = leapcell.repo(process.env.REPO).table(process.env.TABLE, 'name');

const app = express();
app.set('view engine', 'ejs');

app.listen(6699, () => {
  console.log('Server started');
});

app.get('/', async (req, res) => {
  const records = await table.records.findMany({ select: { fields: ['标题', 'slug'] } });
  res.render('home', {
    posts: records.map(({ fields }) => ({ title: fields['标题'], slug: fields['slug'] })),
    search: '',
  });
});

app.get('/search', async (req, res) => {
  const { q } = req.query;
  const { records } = await table.records.search({ query: q, search_fields: ['标题'] });
  res.render('home', {
    posts: records.map(({ fields }) => ({ title: fields['标题'], slug: fields['slug'] })),
    search: q,
  });
});

app.get('/post/:slug', async (req, res) => {
  const { fields } = (
    await table.records.findMany({ where: { slug: { eq: req.params.slug } } })
  )[0];
  res.render('post', { title: fields['标题'], body: fields['正文'], slug: fields.slug });
});
