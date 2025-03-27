import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Box,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

interface NewsItem {
  id: number;
  title: string;
  content: string;
}

const App = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editItem, setEditItem] = useState<NewsItem | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);


  useEffect(() => {
  const stored = localStorage.getItem('news');
  if (stored) {
    try {
      setNews(JSON.parse(stored));
    } catch (e) {
      console.error('Ошибка парсинга:', e);
    }
  }
  setIsInitialized(true); 
}, []);

useEffect(() => {
  if (isInitialized) {
    localStorage.setItem('news', JSON.stringify(news));
  }
}, [news, isInitialized]);

  const addNews = () => {
    if (!title.trim() || !content.trim()) return;
    const newItem: NewsItem = {
      id: Date.now(),
      title,
      content,
    };
    setNews([newItem, ...news]);
    setTitle('');
    setContent('');
  };

  const updateNews = () => {
    if (!editItem) return;
    setNews(news.map(n => (n.id === editItem.id ? editItem : n)));
    setEditItem(null);
  };

  const deleteNews = (id: number) => {
    setNews(news.filter(n => n.id !== id));
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Новости
      </Typography>

      <Stack spacing={2}>
  <TextField
    label="Заголовок"
    fullWidth
    value={title}
    onChange={(e) => setTitle(e.target.value)}
  />
  <TextField
    label="Содержание"
    fullWidth
    multiline
    rows={4}
    value={content}
    onChange={(e) => setContent(e.target.value)}
  />
  <Button variant="contained" onClick={addNews}>
    Добавить
  </Button>
</Stack>

<Stack spacing={2} sx={{ mt: 2 }}>
  {news.map((item) => (
    <Card key={item.id}>
      <CardContent>
        <Typography sx={{
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word', 
  }} variant="h6">{item.title}</Typography>
        <Typography
  variant="body2"
  sx={{
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word', 
  }}
>
  {item.content}
</Typography>
        <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
          <IconButton onClick={() => setEditItem(item)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => deleteNews(item.id)}>
            <Delete />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  ))}
</Stack>

      <Dialog open={!!editItem} onClose={() => setEditItem(null)} fullWidth>
        <DialogTitle>Редактировать</DialogTitle>
        <DialogContent>
          <TextField
            label="Заголовок"
            fullWidth
            value={editItem?.title || ''}
            onChange={e =>
              setEditItem(prev => (prev ? { ...prev, title: e.target.value } : null))
            }
            sx={{ mt: 2 }}
          />
          <TextField
            label="Содержание"
            fullWidth
            multiline
            rows={4}
            value={editItem?.content || ''}
            onChange={e =>
              setEditItem(prev => (prev ? { ...prev, content: e.target.value } : null))
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditItem(null)}>Отмена</Button>
          <Button onClick={updateNews} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default App;
