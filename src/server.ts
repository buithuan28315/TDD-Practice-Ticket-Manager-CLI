import app from './api';

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`KB API running at http://localhost:${PORT}`);
});